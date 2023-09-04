import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpParams } from "@angular/common/http";

import { Country } from '../models/country.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { PersistenceService } from 'angular-persistence';
import { environment } from '../../environments/environment';

@Injectable()
export class ReasonService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService) {
    super(httpClient, persistenceService, environment.apiPostUrl, "reason");
  }

  getByType(type: string) : Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("type", type);
    return super.getCustomApi("getByType", params);
  }
}