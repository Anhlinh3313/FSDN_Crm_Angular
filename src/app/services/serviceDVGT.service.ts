import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { ServiceDVGT } from '../models/serviceDVGT.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { PersistenceService } from 'angular-persistence';
import { environment } from '../../environments/environment';
import { GeneralService } from './general.service';

@Injectable()
export class ServiceDVGTService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService) {
    super(httpClient, persistenceService, environment.apiPostUrl, "serviceDVGT");
  }
}