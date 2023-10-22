var https = require('https');
const path = require('path');
const express = require('express')
const multer = require('multer');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const fs = require('fs');
const { parse } = require('querystring');

const app = express();


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname);
//app.use(express.static('./assets'));
app.use(express.static(path.join(__dirname, 'assets')));

const port = 8080;
const PaytmChecksum = require('./PaytmChecksum');
const Config = require('./config');

app.get('/pay', async (req, res) => {


      const { orderId, phone } = req.query;


      const connection = await db.getConnection();
      const [results, user_prm] = await connection.query("SELECT * FROM users WHERE phone = ? AND ref_id = ?",[phone,orderId]);

      if(results.length != 1){
            connection.release();
            res.redirect('https://shettysempire.co.in/');
            return;
      }

      const user = results[0];


      const gu = generateRandomNumber();

      var paytmParams = {};

      paytmParams.body = {
            "requestType": "Payment",
            "mid": Config.MID,
            "websiteName": Config.WEBSITE,
            "orderId": orderId,
            "callbackUrl": "https://shettysempire.co.in/pay/callback",
            "txnAmount": {
                  "value": "10",
                  "currency": "INR",
            },
            "userInfo": {
                  "custId": "CUST_001",
            },
      };

      PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), Config.MKEY).then(function (checksum) {
            paytmParams.head = {
                  "signature": checksum
            };

            var post_data = JSON.stringify(paytmParams);

            var options = {

                  /* for Staging */
                  hostname: Config.ENV,
                  port: 443,
                  path: '/theia/api/v1/initiateTransaction?mid=' + Config.MID + '&orderId=' + orderId,
                  method: 'POST',
                  headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': post_data.length
                  }
            };

            var response = "";
            var post_req = https.request(options, function (post_res) {
                  post_res.on('data', function (chunk) {
                        response += chunk;
                  });

                  post_res.on('end', function () {
                        var obj = JSON.parse(response);
                        var data = { env: Config.ENV,
                              mid: Config.MID,
                              amount: 10,
                              orderid: orderId,
                              txntoken: obj.body.txnToken,
                              name: user["name"],
                              phone: user["phone"]};

                        res.render(__dirname + '/index.html', { data: data });
                  });
            });
            post_req.write(post_data);
            post_req.end();
      });
});

app.post('/pay/callback', (req, res) => {
      let body = '';
      req.on('data', chunk => {
            body += chunk.toString();
      });
      req.on('end', () => {

            var postbodyjson = parse(body);
            postbodyjson = JSON.parse(JSON.stringify(postbodyjson));

            var checksum = postbodyjson.CHECKSUMHASH;
            delete postbodyjson['CHECKSUMHASH'];

            var verifyChecksum = PaytmChecksum.verifySignature(postbodyjson, Config.MKEY, checksum);
            if (verifyChecksum) {
                  res.render(__dirname + '/callback.html', { verifySignature: "true", data: postbodyjson });
            }
            else {
                  res.render(__dirname + '/callback.html', { verifySignature: "false", data: postbodyjson });
            }

      });

})

app.get('/pay/txnstatus', (req, res) => {
      const {txn,phone} = req.query;
      var paytmParams = {};
      /* body parameters */
      paytmParams.body = {
            "mid": Config.MID,
            /* Enter your order id which needs to be check status for */
            "orderId": txn,
      };
      PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), Config.MKEY).then(function (checksum) {
            /* head parameters */
            paytmParams.head = {
                  "signature": checksum
            };
            /* prepare JSON string for request */
            var post_data = JSON.stringify(paytmParams);

            var options = {
                  hostname: Config.ENV,
                  port: 443,
                  path: '/v3/order/status',
                  method: 'POST',
                  headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': post_data.length
                  }
            };
            var response = "";
            var post_req = https.request(options, function (post_res) {
                  post_res.on('data', function (chunk) {
                        response += chunk;
                  });

                  post_res.on('end', function () {
                        var obj = JSON.parse(response);
                        res.render(__dirname + '/txnstatus.html', { data: obj.body, msg: obj.body.resultInfo.resultMsg });
                  });
            });
            post_req.write(post_data);
            post_req.end();
      });

})


function generateRandomNumber() {
      return Math.floor(Math.random()*90)+10;
}

const storage = multer.diskStorage({
      destination: 'uploads',
      filename: function (req, file, cb) {
            const originalName = file.originalname;
            const ext = originalName.split('.')[1];
            const nm = originalName.split('.')[0];
            const gu = generateRandomNumber();
            const fileName = `${Date.now()}_${nm}_${gu}.${ext}`;
            cb(null, fileName);
      }
});

const upload = multer({ storage });

const db = mysql.createPool({
      connectionLimit : 100, //important
      host: 'localhost',
      user: 'shettyse_shetty',
      password: 'shetty@7019',
      database: 'shettyse_shetty',
      debug    :  false
});

async function validateForm(req, res, next) {

      console.error("in validate");

      const {name,phone,place,role,bat_style,bowl_style,tshirt} = req.body;



      const connection = await db.getConnection();
      const [results, user_prm] = await connection.query("SELECT * FROM users WHERE phone = ? ",[phone]);

      console.error("read user");


      if (results.length > 0) {

            const [txn_results, txn_prm ] = await connection.query("SELECT * FROM transactions WHERE phone = ? AND status = 1 ",[phone]);

            console.error("redirect txn status");

            connection.release();
            if (txn_results.length > 0) {

                  const aadhar_url = req.files.aadharPic[0].path;
                  const photo_url = req.files.playerPic[0].path;
                  fs.unlinkSync(aadhar_url);
                  fs.unlinkSync(photo_url);
                  return res.redirect(`/pay/txnstatus?phone=${phone}`);
            }

            next();
      }
      else{
            console.error("start pay");
            connection.release();
            next();
      }
}


app.post('/pay/upload-photos', upload.fields([{
      name: 'aadharPic', maxCount: 1
}, {
      name: 'playerPic', maxCount: 1
}]), validateForm, async function (req, res) {

      console.error("in upload");

      const {name,phone,place,role,bat_style,bowl_style,tshirt} = req.body;
      const aadhar_url = req.files.aadharPic[0].path;
      const photo_url = req.files.playerPic[0].path;

      var ref_id = "Ord_" + Date.now();
      const user = {name, phone, place, role, bat_style, bowl_style, photo_url, aadhar_url, tshirt, ref_id};
      const status = 0;
      const order_id = ref_id;
      const txn = {phone,order_id,status};
      const connection = await db.getConnection();
      const del_res = await connection.query("DELETE FROM users WHERE phone = ?",[phone]);

      const [results, params] = await connection.query('INSERT INTO users SET ?',user);

      const [txn_results, txn_params] = await connection.query('INSERT INTO transactions SET ?',txn);

      connection.release();

      res.json({ref_id:ref_id,phone:phone,res:2});
      return;

});



app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
});