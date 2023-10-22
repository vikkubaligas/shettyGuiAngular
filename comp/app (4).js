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


app.get('/pay/', (req, res) => {
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

                  console.error("render index");
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
 }) ;

app.post('/pay/callback', (req, res) => {
 let body = '';
 req.on('data', chunk => {
   body += chunk.toString(); 
  });
 req.on('end', () => {
    var postbodyjson= parse(body);
   postbodyjson = JSON.parse(JSON.stringify(postbodyjson));
    
    var checksum= postbodyjson.CHECKSUMHASH;
    delete postbodyjson['CHECKSUMHASH'];

    var verifyChecksum =  PaytmChecksum.verifySignature(postbodyjson, Config.MKEY,checksum);
    if(verifyChecksum) {
      res.render(__dirname + '/callback.html', {verifySignature:"true",data: postbodyjson});
    }
    else{
      res.render(__dirname + '/callback.html', {verifySignature:"false",data: postbodyjson});
    } 
  });    
}) 

app.get('/pay/txnstatus', (req, res) => {
 var paytmParams = {};
 /* body parameters */
  paytmParams.body = {
   "mid": Config.MID,
   /* Enter your order id which needs to be check status for */
   "orderId": "Your_ORDERId_Here",
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});


