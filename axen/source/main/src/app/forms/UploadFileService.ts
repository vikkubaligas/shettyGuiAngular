import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'})
export class UploadFileService {
  constructor(private https: HttpClient) { }
  pushFileToStorage(fileAadhar: File,filePlayer:File, rawData: never, isKarnataka:boolean): Observable<HttpEvent<{}>> {
    const data: FormData = new FormData();
    data.append('aadharPic', fileAadhar);
    data.append('playerPic', filePlayer);

    data.append("name",rawData["name"]);
    data.append("phone",rawData["phone"]);
    data.append("place",rawData["place"]);
    data.append("role",rawData["role"]);
    data.append("bat_style",rawData["battingStyle"]);
    data.append("bowl_style",rawData["bowlingStyle"]);
    data.append("tshirt",rawData["tshirt"]);
    data.append("jersy",rawData["jersy"]);
    data.append("jersyNumber",rawData["jersyNumber"]);
    data.append("contactPhone",rawData["contactPhone"]);
    data.append("currentPlace",rawData["currentPlace"]);
    data.append("contactPerson",rawData["contactName"]);
    data.append("isKarnataka",isKarnataka?"1":"0");


    //https://shettysempire.co.in/pay/upload-photos
    const newRequest = new HttpRequest('POST', 'https://shettysempire.co.in/pay/upload-photos', data, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.https.request(newRequest);
  }}
