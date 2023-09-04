import { Injectable, Inject } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Hub } from '../models/hub.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { HttpParams } from '@angular/common/http';
import { IBaseModel } from '../models/abstract/ibaseModel.interface';
import { ISuperBaseModel } from '../models/abstract/isuperBaseModel.interface';
import { environment } from '../../environments/environment';
import { PersistenceService, StorageType } from 'angular-persistence';
import { Constant } from '../infrastructure/constant';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class BaseService {
    constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService, protected urlName: string, protected apiName: string) {
        let token = this.persistenceService.get(Constant.auths.token, StorageType.LOCAL);
    }

    public getCustomApi(apiMethod: string, params: HttpParams): Observable<ResponseModel> {
        return this.httpClient.get<ResponseModel>(`${this.urlName}/${this.apiName}/${apiMethod}`, { params: params });
    }

    public postCustomApi(apiMethod: string, model: Object): Observable<ResponseModel> {
        // console.log(this.httpClient.post<ResponseModel>(`${this.urlName}/${this.apiName}/${apiMethod}`, model));
        return this.httpClient.post<ResponseModel>(`${this.urlName}/${this.apiName}/${apiMethod}`, model);
    }

    public getCustomApiPaging(apiMethod: string, arrCols: string[] = [], params = new HttpParams(), pageSize: number = undefined, pageNumber: number = undefined): Observable<ResponseModel> {
        let cols = null;

        if (arrCols.length > 0) {
            cols = arrCols.join(',');
        }

        if(!params) params = new HttpParams();

        if (pageSize)
            params = params.append("pageSize", pageSize.toString());
        if (pageNumber)
            params = params.append("pageNumber", pageNumber.toString());
        if (cols)
            params = params.append("cols", cols);

            return this.httpClient.get<ResponseModel>(`${this.urlName}/${this.apiName}/${apiMethod}`, { params: params });
    }

    public postCustomUrlApi(urlName: string, apiMethod: string, model: Object): Observable<ResponseModel> {
        return this.httpClient.post<ResponseModel>(`${urlName}/${this.apiName}/${apiMethod}`, model);
    }

    public getCustomUrlApiPaging(urlName: string, apiMethod: string, arrCols: string[] = [], params = new HttpParams(), pageSize: number = undefined, pageNumber: number = undefined): Observable<ResponseModel> {
        let cols = null;

        if (arrCols.length > 0) {
            cols = arrCols.join(',');
        }

        if(!params) params = new HttpParams();

        if (pageSize)
            params = params.append("pageSize", pageSize.toString());
        if (pageNumber)
            params = params.append("pageNumber", pageNumber.toString());
        if (cols)
            params = params.append("cols", cols);

            return this.httpClient.get<ResponseModel>(`${urlName}/${this.apiName}/${apiMethod}`, { params: params });
    }
}
