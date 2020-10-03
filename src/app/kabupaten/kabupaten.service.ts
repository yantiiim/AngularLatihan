import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DatatablesRequest } from '../model/datatablesrequest.model';
import { DataTablesResponse } from '../model/datatablesresponse.model';
import { Kabupaten } from './kabupaten';
import { KabupatenListComponent } from './kabupatenlist.component';

@Injectable()
export class KabupatenService{
    constructor(private httpKlien: HttpClient){

    }

    insertKab(kabupaten: Kabupaten): Observable<any> {
        return this.httpKlien.post(environment.baseUrl +'/savekabjson' , kabupaten)
        .pipe(map(data => data));
    }

    listKab( ): Observable<Kabupaten[]> {
        return this.httpKlien.get(environment.baseUrl +'/listkabjson')
        .pipe(map(data => <Kabupaten[]> data));
    }

    getKabupatenById(id): Observable<Kabupaten> {
        return this.httpKlien.get(environment.baseUrl +'/listkabjson/'+id)
        .pipe(map(data => data as Kabupaten));
    }

    getListKabupatenAll(parameter: Map<string, any>, dataTablesParameters: any): Observable<DataTablesResponse> {
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
        return this.httpKlien.post(environment.baseUrl + '/listkabdatajson', dtReq
        ).pipe(map(data => data as DataTablesResponse));
    }
}