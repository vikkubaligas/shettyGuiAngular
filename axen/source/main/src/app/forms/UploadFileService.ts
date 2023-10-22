import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'})
export class UploadFileService {
  constructor(private https: HttpClient) { }
  pushFileToStorage(fileAadhar: File,filePlayer:File, rawData: never): Observable<HttpEvent<{}>> {
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
    const newRequest = new HttpRequest('POST', 'https://shettysempire.co.in/pay/upload-photos', data, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.https.request(newRequest);
  }}
