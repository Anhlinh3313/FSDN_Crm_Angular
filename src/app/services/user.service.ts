import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Country } from '../models/country.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { AuthService } from './auth/auth.service';
import { PersistenceService } from 'angular-persistence';
import { environment } from '../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { Hub } from '../models';

@Injectable()
export class UserService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService, private authService: AuthService) {
    super(httpClient, persistenceService, environment.apiPostUrl, "account");
  }

  async getAsync(id: any): Promise<any> {
    const res = await this.get(id).toPromise();
    // if (!this.isValidResponse(res)) return;
    const data = res.data as any;
    return data;
  }

  changePassWord(currentPassWord: string, newPassWord: string): Observable<ResponseModel> {
    let model = new Object();
    model["userId"] = this.authService.getUserId();
    model["currentPassWord"] = currentPassWord;
    model["newPassWord"] = newPassWord;
    return super.postCustomUrlApi(environment.apiGeneralUrl, "changePassWord", model);
  }

  getEmpByCurrentHub() {
    return super.getCustomApiPaging("getEmpByCurrentHub");
  }

  getEmpByHubId(hubId: any) {
    let params = new HttpParams;
    params = params.append("hubId", hubId);
    return super.getCustomApi("getEmpByHubId", params);
  }

  async getEmpByHubIdAsync(hubId: any): Promise<any> {
    const res = await this.getEmpByHubId(hubId).toPromise();
    const data = res.data as any;
    return data;
  }

  async getEmpByCodeAsync(username: string){
    let params = new HttpParams;
    params = params.append("username", username);
    return await super.getCustomUrlApiPaging(environment.apiGeneralUrl,"getEmpByCode",[],params).toPromise();
  }

  async getModelEmpByHubIdAsync(hubId: any) {
    let objs = await this.getEmpByHubIdAsync(hubId);
    let data = [];

    if (objs) {
      data.push({ label: `--Chọn nhân viên--`, value: null });
      objs.forEach(element => {
        data.push({ label: `${element.fullName}`, value: element.id });
      });
    }
    return data;
  }
  
  getSearchByValue(value: string, id: any) {
    let params = new HttpParams;
    params = params.append("value", value);
    params = params.append("id", id);
    return super.getCustomUrlApiPaging(environment.apiPostUrl, "searchByValue", [], params);
  }

  async getSearchByValueAsync(value: string, id: any): Promise<Hub[]> {
    let res = await this.getSearchByValue(value, id).toPromise();
    return res.data as Hub[];
  }
}