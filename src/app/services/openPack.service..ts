import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { OpenPackage } from '../models/openPack.model.';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { PersistenceService } from 'angular-persistence';
import { environment } from '../../environments/environment';

@Injectable()
export class OpenPackService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService) {
    super(httpClient, persistenceService, environment.apiPostUrl, "openPack");
  }
}