import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { PriceService, Area, Weight } from '../models';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { PersistenceService } from 'angular-persistence';
import { environment } from '../../environments/environment';
import { DataFilterViewModel,PriceServiceDetailExcelViewModel } from '../view-model/index';

@Injectable()
export class PriceServiceDetailService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService) {
    super(httpClient, persistenceService, environment.apiPostUrl, "priceServiceDetail");
  }

  public GetByPriceService(dataFilter: DataFilterViewModel): Observable<ResponseModel> {
    return super.postCustomApi("GetByPriceService", dataFilter);
  }

  public UploadExcelPriceService(dataExcels: PriceServiceDetailExcelViewModel): Observable<ResponseModel> {
    return super.postCustomApi("UploadExcelPriceService", dataExcels);
  }
}