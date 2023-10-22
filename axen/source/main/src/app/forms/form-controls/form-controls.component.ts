import {Component} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators,} from '@angular/forms';
import {HttpEventType} from "@angular/common/http";
import {UploadFileService} from '../UploadFileService';


@Component({
  selector: 'app-form-controls',
  templateUrl: './form-controls.component.html',
  styleUrls: ['./form-controls.component.scss'],
})
export class FormControlsComponent {
  // Form
  basicDetailsGroup: UntypedFormGroup;
  battingStyleLabel: 'Right' | 'Left' = 'Right';
  bowlingStyleLabel: 'Right' | 'Left' = 'Right';
  fileAadhar: File | null = null;
  filePlayer: File | null = null;
  currentProgress = 0

  breadscrums = [
    {
      title: 'Bunts Empire Trophy Registration',
      items: [],
      active: '',
    },
  ];

  onChangeAadhar(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileAadhar = file;
    }
  }

  onChangePlayer(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.filePlayer = file;
    }
  }

  confirmAdd(){
    const rawData= this.basicDetailsGroup.getRawValue();
    if(this.fileAadhar != null && this.filePlayer != null){
      // @ts-ignore


      this.currentProgress = 0

      // @ts-ignore
      this.uploadService.pushFileToStorage(this.fileAadhar,this.filePlayer,rawData).subscribe(
        event => {

          if (event.type === HttpEventType.DownloadProgress) {
            console.log("Download progress event", event);
          }

          if (event.type === HttpEventType.UploadProgress) {
            console.log("Upload progress event", event);
            // @ts-ignore
            this.currentProgress = Math.round(100 * event.loaded / event.total);
          }

          if (event.type === HttpEventType.Response) {
            const response = event.body;
            console.log("response received",response);


            // @ts-ignore
            const rid = response["ref_id"];
            // @ts-ignore
            const phone = response["phone"];

            // @ts-ignore
            const res = response["res"];

            if (res == 2) {
              window.location.href = "https://shettysempire.co.in/pay?orderId="+rid+"&phone="+phone;
            } else if(res ==3) {
              // @ts-ignore
              window.location.href = response["redirect"];
            }
          }

        }
      );
    }

  }

  constructor(fb: UntypedFormBuilder,private uploadService: UploadFileService) {
    this.basicDetailsGroup = fb.group({
        name:['', [Validators.required]],
        phone:['', [Validators.required]],
        place:['', [Validators.required]],
        role:['', [Validators.required]],
        battingStyle:['Right', [Validators.required]],
        bowlingStyle:['Right', [Validators.required]],
        tshirt:['', [Validators.required]],
        aadharPic:['', [Validators.required]],
        playerPic:['', [Validators.required]],
    });
  }

}
