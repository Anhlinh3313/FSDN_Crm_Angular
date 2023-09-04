import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Country } from '../models/country.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { HttpParams } from '@angular/common/http';
import { PersistenceService } from 'angular-persistence';
import { environment } from '../../environments/environment';

@Injectable()
export class PageService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService) {
    super(httpClient, persistenceService, environment.apiGeneralUrl, "page");
  }

  public getMenuByModuleId(id: any): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("id", id);

    return super.getCustomApi("getMenuByModuleId", params);
  }

  public getAllByModuleId(id: any): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("id", id);

    return super.getCustomApi("getAllByModuleId", params);
  }
}