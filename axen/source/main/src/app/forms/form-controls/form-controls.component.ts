import {Component} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators,} from '@angular/forms';
import {HttpEventType} from "@angular/common/http";
import {UploadFileService} from '../UploadFileService';
import Swal from 'sweetalert2';


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
  filePayment: File | null = null;
  currentProgress = 0
  iskarnataka = false;
  isAgreed = false

  breadscrums = [
    {
      title: 'Player Registration',
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

  onChangePayment(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.filePayment = file;
    }
  }

  showCustomPosition() {
    Swal.fire({
      icon: 'success',
      title: 'Player Info saved!',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  confirmAdd(){
    const rawData= this.basicDetailsGroup.getRawValue();
    if(this.fileAadhar != null && this.filePlayer != null && this.filePayment != null){
      // @ts-ignore


      this.currentProgress = 0

      // @ts-ignore
      this.uploadService.pushFileToStorage(this.fileAadhar,this.filePlayer,rawData,this.iskarnataka,this.filePayment).subscribe(
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
              this.showCustomPosition()
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
      paymentPic:['', [Validators.required]],
        jersy:['', [Validators.required]],
        jersyNumber:['', [Validators.required]],
      currentPlace:['',],
      contactPhone:['', ],
      contactName:['', ],
      isKarnataka:[],
      isAgreed:[],
      transactionId:['', [Validators.required]],
    });

    // @ts-ignore
    this.basicDetailsGroup.get('isKarnataka').valueChanges.subscribe(val => {
      console.log("on value change",this.iskarnataka, val)
      if (val) {
        this.basicDetailsGroup.controls['contactName'].setValidators([Validators.required]);
        this.basicDetailsGroup.controls['contactPhone'].setValidators([Validators.required]);
        this.basicDetailsGroup.controls['currentPlace'].setValidators([Validators.required]);
      } else {
        this.basicDetailsGroup.controls['contactName'].clearValidators();
        this.basicDetailsGroup.controls['contactPhone'].clearValidators();
        this.basicDetailsGroup.controls['currentPlace'].clearValidators();

      }
      this.basicDetailsGroup.controls['contactName'].updateValueAndValidity();
      this.basicDetailsGroup.controls['contactPhone'].updateValueAndValidity();
      this.basicDetailsGroup.controls['currentPlace'].updateValueAndValidity();
    });
  }

}
