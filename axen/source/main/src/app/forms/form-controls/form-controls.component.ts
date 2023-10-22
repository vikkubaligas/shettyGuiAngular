import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { UploadFileService } from '../UploadFileService';



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

        rawData["aadharPic"] = this.fileAadhar;
        rawData["playerPic"] = this.filePlayer;

        console.log(rawData)

        //console.log(formData);
        // this.httpClient.post("http://localhost:3000/", rawData).subscribe(
        //   (response: any) => {
        //       console.log("response received",response);
        //
        //
        //     const rid = response["ref_id"];
        //     const phone = response["phone"];
        //
        //     const res = response["res"];
        //
        //     if (res == 2) {
        //       window.location.href = "https://shettysempire.co.in/pay?orderId="+rid+"&phone="+phone;
        //     } else {
        //       console.log("response error");
        //     }
        //   },
        //   (error) => {
        //     console.error('File upload failed:', error);
        //
        //   }
        // );

      }
  }

  title = 'File-Upload-Save';
  // @ts-ignore
  selectedFileAadhar: File;
  // @ts-ignore
  selectedFilePlayer: File;
  progress: { percentage: number } = { percentage: 0 };
  selectedFile = null;
  changeImage = false;

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

  downloadFile(){
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', '_File_Saved_Path');
    link.setAttribute('download', 'file_name.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  upload() {
    this.progress.percentage = 0;
    this.uploadService.pushFileToStorage(this.selectedFileAadhar,this.selectedFilePlayer).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          // @ts-ignore
          this.progress.percentage = Math.round(100 * event.loaded / event.total);
          console.log(this.progress)
        } else if (event instanceof HttpResponse) {
          alert('File Successfully Uploaded');
        }
      // this.selectedFilePlayer = undefined;
      // this.selectedFileAadhar = undefined;
      }
    );
  }
  selectFileAadhar(event:any) {
    this.selectedFileAadhar = event.target.files[0];
  }

  selectFilePlayer(event:any) {
    this.selectedFilePlayer = event.target.files[0];
  }

}
