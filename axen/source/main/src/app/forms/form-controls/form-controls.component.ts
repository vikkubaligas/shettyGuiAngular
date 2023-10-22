import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ThemePalette } from '@angular/material/core';
import { CheckoutService } from 'paytm-blink-checkout-angular';
import { HttpClient,HttpHeaders } from "@angular/common/http";


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
    

      const formData = new FormData();

      formData.append("name",rawData["name"]);
      formData.append("phone",rawData["phone"]);
      formData.append("place",rawData["place"]);
      formData.append("role",rawData["role"]);
      formData.append("bat_style",rawData["battingStyle"]);
      formData.append("bowl_style",rawData["bowlingStyle"]);
      formData.append("tshirt",rawData["tshirt"]);

      if(this.fileAadhar != null && this.filePlayer != null){
        formData.append("aadharPic",this.fileAadhar);
        formData.append("playerPic",this.filePlayer);


        console.log(formData);
        this.httpClient.post("https://shettysempire.co.in/pay/upload-photos/", formData).subscribe(
          (response: any) => {
              console.log(response);


            const rid = response["ref_id"];
            const phone = response["phone"];
            
            const res = response["res"];
            
            if (res == 2) {
              window.location.href = "https://shettysempire.co.in/pay?orderId="+rid+"&phone="+phone;
            } else {
              console.log("response error");
            }
          },
          (error) => {
            console.error('File upload failed:', error);
            
          }
        );

      }
  }

  
  constructor(fb: UntypedFormBuilder,public httpClient: HttpClient,) {
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
