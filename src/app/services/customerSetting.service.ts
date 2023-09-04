import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";

import { ResponseModel } from '../models/response.model';
import { GeneralService } from './general.service';
import { PersistenceService } from 'angular-persistence';
import { environment } from '../../environments/environment';
import { CustomerSetting } from '../models/customerSettng.model';

@Injectable()
export class CustomerSettingService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService) {
    super(httpClient, persistenceService, environment.apiCRMUrl, "customerSetting");
  }

  async getSettingByCustomerAsync(customerId: any):Promise<ResponseModel> {
    let params = new HttpParams();
    params = params.append("customerId", customerId);
    return super.getCustomApi("GetSettingByCustomer", params).toPromise<ResponseModel>();
  }

  async createAndUpdateSettingCustomerAsync(viewModel: CustomerSetting):Promise<ResponseModel> {
    return super.postCustomApi("UpdateSettingCustomer", viewModel).toPromise<ResponseModel>();
  }
}