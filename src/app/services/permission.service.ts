import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Hub } from '../models/hub.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { HttpParams } from '@angular/common/http';
import { BaseService } from './base.service';
import { RolePage } from '../models/index';
import { environment } from '../../environments/environment';
import { PersistenceService } from 'angular-persistence';

@Injectable()
export class PermissionService extends BaseService {
  constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService) {
    super(httpClient, persistenceService, environment.apiGeneralUrl, "permission");
  }

  public checkPermissionDetail(aliasPath: string, moduleId: any): Observable<ResponseModel> {
    var params = new HttpParams();
    params = params.append("aliasPath", aliasPath);
    params = params.append("moduleId", moduleId);

    return super.getCustomApi("CheckPermissionDetail", params);
  }
}
