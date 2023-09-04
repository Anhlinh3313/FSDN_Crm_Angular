import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";

import { ResponseModel } from '../models/response.model';
import { GeneralService } from './general.service';
import { PersistenceService } from 'angular-persistence';
import { environment } from '../../environments/environment';

@Injectable()
export class CustomerPaymentToService extends GeneralService {
    constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService) {
        super(httpClient, persistenceService, environment.apiCRMUrl, "customerPaymentTo");
    }

    async GetCustomerPaymentToAsync(customerId: any, searchValue: any, pageSize: any, pageNum: any, cols: any[]): Promise<ResponseModel> {
        let colsStr = '';
        cols.map(m => colsStr += (m + ','));
        let params = new HttpParams();
        params = params.append("customerId", customerId);
        params = params.append("searchValue", searchValue);
        params = params.append("pageSize", pageSize);
        params = params.append("pageNum", pageNum);
        params = params.append("cols", colsStr);
        return super.getCustomApi("GetCustomerPaymentTo", params).toPromise<ResponseModel>();
    }

}