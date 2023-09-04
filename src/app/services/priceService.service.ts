import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { PriceList, AreaGroup, WeightGroup } from '../models';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { PersistenceService } from 'angular-persistence';
import { environment } from '../../environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class PriceServiceService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService) {
    super(httpClient, persistenceService, environment.apiPostUrl, "priceService");
  }

  public GetByPriceList(priceListId: any): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("priceListId", priceListId);
    return super.getCustomApi("GetByPriceList", params);
  }
}