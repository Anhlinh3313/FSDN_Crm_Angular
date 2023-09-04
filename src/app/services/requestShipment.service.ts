import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Role } from '../models/role.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { HttpParams } from '@angular/common/http';
import { PersistenceService } from 'angular-persistence';
import { environment } from '../../environments/environment';
import { ListUpdateStatusViewModel } from '../view-model/index';

import * as moment from 'moment';


@Injectable()
export class RequestShipmentService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService) {
    super(httpClient, persistenceService, environment.apiPostUrl, "requestShipment");
  }

  getByType(type: string, arrCols: string[] = [], pageSize: number = undefined, pageNumber: number = undefined) {
    let params = new HttpParams();
    params = params.append("type", type);
    return super.getCustomApiPaging("getByType", arrCols, params, pageSize, pageNumber)
  }

  trackingShort(shipmentNumber: string, arrCols: string[]) {
    let params = new HttpParams();
    params = params.append("shipmentNumber", shipmentNumber);
    return super.getCustomApiPaging("trackingShort", arrCols, params)
  }

  assignPickupList(model: ListUpdateStatusViewModel) {
    return super.postCustomApi("assignPickupList", model);
  }

  assignUpdatePickupList(model: ListUpdateStatusViewModel) {
    return super.postCustomApi("assignUpdatePickupList", model);
  }

  getPickupHistory(fromDate: any, toDate: any) {
    let params = new HttpParams();

    params = params.append("fromDate", moment(fromDate).format('YYYY/MM/DD 00:00:00'));
    params = params.append("toDate", moment(toDate).format('YYYY/MM/DD 23:59:59'));

    return super.getCustomApi("getPickupHistory", params)
  }
}
