import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { GeneralService } from './general.service';
import { PersistenceService } from 'angular-persistence';
import { environment } from '../../environments/environment';
import { MessageService } from 'primeng/components/common/messageservice';
import { ResponseModel } from '../models';

@Injectable()
export class FormPrintService extends GeneralService {
  constructor(protected messageService: MessageService, protected httpClient: HttpClient, protected persistenceService: PersistenceService) {
    super(httpClient, persistenceService, environment.apiPostUrl, "FormPrint");
  }
  
  getFormPrintByTypeAsync(typeId: any): Promise<ResponseModel> {
    let params = new HttpParams;
    params = params.append("typeId", typeId);
    return super.getCustomUrlApiPaging(environment.apiPostUrl, "GetFormPrintByType", [], params).toPromise();
  }
}
