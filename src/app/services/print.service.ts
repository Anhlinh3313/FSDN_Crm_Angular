import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Province } from "../models/province.model";
import { ResponseModel } from "../models/response.model";
import { BaseModel } from "../models/base.model";
import { GeneralService } from "./general.service";
import { environment } from "../../environments/environment";
import { PersistenceService } from "angular-persistence";
import { HttpParams } from "@angular/common/http";
import { mock_print } from "../models/mock_print";
import { PrintModel } from "../models/print.model";

@Injectable()
export class PrintService extends GeneralService {
  constructor(
    protected httpClient: HttpClient,
    protected persistenceService: PersistenceService
  ) {
    super(
      httpClient,
      persistenceService,
      environment.apiGeneralUrl,
      "province"
    );
  }

  getAllPrint(): Promise<PrintModel[]> {
    console.log(mock_print);
    return Promise.resolve(mock_print);
  }
}
