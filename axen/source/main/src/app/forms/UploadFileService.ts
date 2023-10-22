import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'})
export class UploadFileService {
  constructor(private https: HttpClient) { }
  pushFileToStorage(fileAadhar: File,filePlayer:File): Observable<HttpEvent<{}>> {
    const data: FormData = new FormData();
    data.append('aadharPic', fileAadhar);
    data.append('playerPic', filePlayer);
    const newRequest = new HttpRequest('POST', 'http://localhost:3000/', data, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.https.request(newRequest);
  }}
