import { Observable } from 'rxjs';
import { Provinsi } from './provinsi';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { DataTablesResponse } from '../model/datatablesresponse.model';
import { DatatablesRequest } from '../model/datatablesrequest.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class ProvinsiService{
    constructor(private httpKlien: HttpClient){

    }

    insertProv(provinsi: Provinsi): Observable<any> {
        return this.httpKlien.post(environment.baseUrl +'/saveprovjson' , provinsi)
        .pipe(map(data => data));
    }

    listProvinsi( ): Observable<Provinsi[]> {
        return this.httpKlien.get(environment.baseUrl +'/listprovinsijson')
        .pipe(map(data => <Provinsi[]> data));
    }

    getProvinsiById(id): Observable<Provinsi> {
        return this.httpKlien.get(environment.baseUrl +'/listprovinsijson/'+id)
        .pipe(map(data => data as Provinsi));
    }

    getListProvinsiAll(parameter: Map<string, any>, dataTablesParameters: any): Observable<DataTablesResponse> {
        const dtReq = new DatatablesRequest();
        dtReq.draw = dataTablesParameters.draw;
        dtReq.length = dataTablesParameters.length;
        dtReq.start = dataTablesParameters.start;
        dtReq.sortCol = dataTablesParameters.order[0].column;
        dtReq.sortDir = dataTablesParameters.order[0].dir;
        dtReq.extraParam = {};

        parameter.forEach((value, key) => {
            dtReq.extraParam[key] = value;
        });
        return this.httpKlien.post(environment.baseUrl + '/listprovdatajson', dtReq
        ).pipe(map(data => data as DataTablesResponse));
    }

    upload(file: File): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();

        formData.append('file', file);

        const req = new HttpRequest('POST', environment.baseUrl + '/upload', formData, {
            reportProgress: true,
            responseType: 'json'
        });

        return this.httpKlien.request(req);
    }
}