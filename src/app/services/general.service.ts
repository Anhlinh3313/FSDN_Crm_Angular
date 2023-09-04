import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { ResponseModel } from '../models/response.model';
import { HttpParams } from '@angular/common/http';
import { BaseService } from './base.service';
import { PersistenceService } from 'angular-persistence';

@Injectable()
export class GeneralService extends BaseService {

    constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService, protected urlName: string, protected apiName: string) {
        super(httpClient, persistenceService, urlName, apiName);
    }

    public get(id: any): Observable<ResponseModel> {
        return this.httpClient.get<ResponseModel>(`${this.urlName}/${this.apiName}/get?id=${id}`);
    }

    public getAll(arrCols: string[] = [], pageSize: number = undefined, pageNumber: number = undefined): Observable<ResponseModel> {
        let params = new HttpParams();

        if (!pageSize && !pageNumber && arrCols.length === 0) {
            return this.httpClient.get<ResponseModel>(`${this.urlName}/${this.apiName}/getAll`);
        }
        else {
            let cols = null;

            if (arrCols.length > 0) {
                cols = arrCols.join(',');
            }

            if (pageSize)
                params = params.append("pageSize", pageSize.toString());
            if (pageNumber)
                params = params.append("pageNumber", pageNumber.toString());
            if (cols)
                params = params.append("cols", cols);

            return this.httpClient.get<ResponseModel>(`${this.urlName}/${this.apiName}/getAll`, { params: params });
        }
    }

    public create(model: Object): Observable<ResponseModel> {
        return this.httpClient.post<ResponseModel>(`${this.urlName}/${this.apiName}/create`, model);
    }

    public update(model: Object): Observable<ResponseModel> {
        return this.httpClient.post<ResponseModel>(`${this.urlName}/${this.apiName}/update`,  model);
    }

    public delete(model: Object): Observable<ResponseModel> {
        return this.httpClient.post<ResponseModel>(`${this.urlName}/${this.apiName}/delete`, model);
    }
}
