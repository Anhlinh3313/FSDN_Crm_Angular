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
export class ShipmentService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService) {
    super(httpClient, persistenceService, environment.apiPostUrl, "shipment");
  }

  getByType(type: string, arrCols: string[] = [], pageSize: number = undefined, pageNumber: number = undefined) {
    let params = new HttpParams();
    params = params.append("type", type);
    return super.getCustomApiPaging("getByType", arrCols, params, pageSize, pageNumber)
  }

  getByStatusCurrentEmp(statusId: any, arrCols: string[] = [], pageSize: number = undefined, pageNumber: number = undefined) {
    let params = new HttpParams();
    params = params.append("statusId", statusId);

    return super.getCustomApiPaging("getByStatusCurrentEmp", arrCols, params, pageSize, pageNumber)
  }


  trackingShort(shipmentNumber: string, arrCols: string[]) {
    let params = new HttpParams();
    params = params.append("shipmentNumber", shipmentNumber);
    return super.getCustomApiPaging("trackingShort", arrCols, params)
  }

  assignDeliveryList(model: ListUpdateStatusViewModel) {
    return super.postCustomApi("assignDeliveryList", model);
  }

  assignUpdateDeliveryList(model: ListUpdateStatusViewModel) {
    return super.postCustomApi("assignUpdateDeliveryList", model);
  }

  assignReturnList(model: ListUpdateStatusViewModel) {
    return super.postCustomApi("assignReturnList", model);
  }

  assignUpdateReturnList(model: ListUpdateStatusViewModel) {
    return super.postCustomApi("assignUpdateReturnList", model);
  }

  assignTransferList(model: ListUpdateStatusViewModel) {
    return super.postCustomApi("assignTransferList", model);
  }

  assignUpdateTransferList(model: ListUpdateStatusViewModel) {
    return super.postCustomApi("assignUpdateTransferList", model);
  }

  hubConfirmMoneyFromRider(model: ListUpdateStatusViewModel) {
    return super.postCustomApi("hubConfirmMoneyFromRider", model);
  }

  getDeliveryHistory(fromDate: any, toDate: any) {
    let params = new HttpParams();

    params = params.append("fromDate", moment(fromDate).format('YYYY/MM/DD 00:00:00'));
    params = params.append("toDate", moment(toDate).format('YYYY/MM/DD 23:59:59'));

    return super.getCustomApi("getDeliveryHistory", params)
  }

  getReturnHistory(fromDate: any, toDate: any) {
    let params = new HttpParams();

    params = params.append("fromDate", moment(fromDate).format('YYYY/MM/DD 00:00:00'));
    params = params.append("toDate", moment(toDate).format('YYYY/MM/DD 23:59:59'));

    return super.getCustomApi("getReturnHistory", params)
  }

  getTransferHistory(fromDate: any, toDate: any) {
    let params = new HttpParams();

    params = params.append("fromDate", moment(fromDate).format('YYYY/MM/DD 00:00:00'));
    params = params.append("toDate", moment(toDate).format('YYYY/MM/DD 23:59:59'));

    return super.getCustomApi("getTransferHistory", params)
  }

  getHubConfirmMoneyFromRiderHistory(fromDate: any, toDate: any) {
    let params = new HttpParams();

    params = params.append("fromDate", moment(fromDate).format('YYYY/MM/DD 00:00:00'));
    params = params.append("toDate", moment(toDate).format('YYYY/MM/DD 23:59:59'));

    return super.getCustomApi("getHubConfirmMoneyFromRiderHistory", params)
  }

  getAccountantConfirmMoneyFromHubHistory(fromDate: any, toDate: any) {
    let params = new HttpParams();

    params = params.append("fromDate", moment(fromDate).format('YYYY/MM/DD 00:00:00'));
    params = params.append("toDate", moment(toDate).format('YYYY/MM/DD 23:59:59'));

    return super.getCustomApi("getAccountantConfirmMoneyFromHubHistory", params)
  }

  getByStatusEmpId(empId: any, statusId: any, fromDate: Date, toDate: Date, arrCols: string[] = [], pageSize: number = undefined, pageNumber: number = undefined) {
    let params = new HttpParams();
    params = params.append("empId", empId);
    params = params.append("statusId", statusId);
    if (fromDate)
      params = params.append("fromDate", moment(fromDate).format('YYYY/MM/DD 00:00:00'));
    if (toDate)
      params = params.append("toDate", moment(toDate).format('YYYY/MM/DD 23:59:59'));

    return super.getCustomApiPaging("getByStatusEmpId", arrCols, params, pageSize, pageNumber)
  }

  getShipmentReportByEmpId(empId: any, fromDate: Date, toDate: Date, arrCols: string[] = [], pageSize: number = undefined, pageNumber: number = undefined) {
    let params = new HttpParams();
    params = params.append("empId", empId);
    if (fromDate)
    params = params.append("fromDate", moment(fromDate).format('YYYY/MM/DD 00:00:00'));
  if (toDate)
    params = params.append("toDate", moment(toDate).format('YYYY/MM/DD 23:59:59'));

    return super.getCustomApiPaging("getShipmentReportByEmpId", arrCols, params, pageSize, pageNumber)
  }
}
