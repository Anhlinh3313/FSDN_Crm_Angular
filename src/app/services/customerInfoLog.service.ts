import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";

import { ResponseModel } from '../models/response.model';
import { GeneralService } from './general.service';
import { PersistenceService } from 'angular-persistence';
import { environment } from '../../environments/environment';
import { CustomerInfoLog } from '../models/customerInfoLog.model';

@Injectable()
export class CustomerInfoLogService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService) {
    super(httpClient, persistenceService, environment.apiCRMUrl, "CustomerInfoLog");
  }

  createImportExcel(cusInfo: CustomerInfoLog[]) {
    return super.postCustomUrlApi(environment.apiCRMUrl, "CreateImportExcel", cusInfo);
  }

  async createImportExcelAsync(cusInfo: CustomerInfoLog[]): Promise<ResponseModel> {
    return await this.createImportExcel(cusInfo).toPromise();
  }

  updateImportExcel(cusInfo: CustomerInfoLog[]) {
    return super.postCustomUrlApi(environment.apiCRMUrl, "UpdateImportExcel", cusInfo);
  }

  async updateImportExcelAsync(cusInfo: CustomerInfoLog[]): Promise<ResponseModel> {
    return await this.updateImportExcel(cusInfo).toPromise();
  }

  async getListCustomerInfologAsync(senderId?: any, searchText?: any, pageSize?: any, pageNum?: any): Promise<ResponseModel> {
    let params = new HttpParams();
    params = params.append("senderId", senderId);
    params = params.append("searchText", searchText);
    params = params.append("pageSize", pageSize);
    params = params.append("pageNum", pageNum);
    return super.getCustomApi("GetListCustomerInfolog", params).toPromise();
  }
}