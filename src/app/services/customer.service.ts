import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";

import { ResponseModel } from '../models/response.model';
import { GeneralService } from './general.service';
import { PersistenceService } from 'angular-persistence';
import { environment } from '../../environments/environment';
import { Customer } from '../models';
import { CustomerInfoLog } from '../models/customerInfoLog.model';

@Injectable()
export class CustomerService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService) {
    super(httpClient, persistenceService, environment.apiCRMUrl, "customer");
  }

  getListNotAccept() {
    return super.getCustomApi("GetListNotAccept", null);
  }

  async getListNotAcceptAsync() {
    let res = await this.getListNotAccept().toPromise();
    return res;
  }

  async getCreatedByAsync(searchBy: any,isAccept: any, provinceId: any, arrCols: string[] = [], pageSize: number = undefined, pageNumber: number = undefined):Promise<ResponseModel> {
    let params = new HttpParams();
    let cols = null;
    if (arrCols.length > 0) {
      cols = arrCols.join(',');
    }
    params = params.append("keySearch", searchBy);
    params = params.append("isAccept", isAccept);
    params = params.append("provinceId", provinceId);
    if (pageSize)
      params = params.append("pageSize", pageSize.toString());
    if (pageNumber)
      params = params.append("pageNumber", pageNumber.toString());
    if (cols)
      params = params.append("cols", cols);
    return super.getCustomApi("GetCreatedBy", params).toPromise<ResponseModel>();
  }

  getSearchByValue(value: string, id: any) {
    let params = new HttpParams;
    params = params.append("value", value);
    params = params.append("id", id);
    return super.getCustomUrlApiPaging(environment.apiCRMUrl, "searchByValue", [], params);
  }

  async getSearchByValueAsync(value: string, id: any): Promise<ResponseModel> {
    let res = await this.getSearchByValue(value, id).toPromise();
    return res;
  }

  getByListCode(listCode: string[]) {
    return super.postCustomUrlApi(environment.apiCRMUrl, "getByListCode", listCode);
  }

  async getByListCodeAsync(listCode: string[]): Promise<Customer[]> {
    const res = await this.getByListCode(listCode).toPromise();
    if (!res) {
      return;
    }
    const data = res.data as Customer[];
    return data;
  }

  async getByCustomerCodeAsync(code: string, id: any, pageSize: any, pageNum: any, cols: any): Promise<ResponseModel> {
    let params = new HttpParams();
    params = params.append("value", code);
    params = params.append("id", id);
    params = params.append("pageSize", pageSize);
    params = params.append("pageNum", pageNum);
    params = params.append("cols", cols);
    return super.getCustomApi("getByCustomerCode", params).toPromise();
  }
}