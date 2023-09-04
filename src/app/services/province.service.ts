import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Province } from '../models/province.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { environment } from '../../environments/environment';
import { PersistenceService } from 'angular-persistence';
import { HttpParams } from '@angular/common/http';
import { SelectItem } from 'primeng/primeng';

@Injectable()
export class ProvinceService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService) {
    super(httpClient, persistenceService, environment.apiGeneralUrl, "province");
  }

  getProvinceByName(name: string, countryId: number = null) {
    let params = new HttpParams();
    params = params.append("name", name);

    if(countryId) {
      params = params.append("countryId", countryId.toString());
    }

    return super.getCustomApi("getProvinceByName", params);
  }
  
  async getAllSelectModelAsync(): Promise<SelectItem[]> {
    const res = await this.getAll().toPromise();
    if (res.isSuccess) {
      const data = res.data as Province[];
      if (data) {
        const province: SelectItem[] = [];
        province.push({ label: `-- Chọn tỉnh/thành --`, value: null });
        data.forEach(element => {
          province.push({
            label: `${element.code} - ${element.name}`,
            value: element.id
          });
        });
        return province;
      }
    }
    return null;
  }
}
