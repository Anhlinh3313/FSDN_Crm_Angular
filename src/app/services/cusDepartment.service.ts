import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpParams } from "@angular/common/http";

import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { PersistenceService } from 'angular-persistence';
import { environment } from '../../environments/environment';
import { CusDepartment } from '../models/cusDepartment.model';

@Injectable()
export class CusDepartmentService extends GeneralService {
    constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService) {
        super(httpClient, persistenceService, environment.apiCRMUrl, "CusDepartment");
    }

    public getCusDepartmentByID(customerId: any): Observable<ResponseModel> {
        let params = new HttpParams();
        params = params.append("customerId", customerId);
        return super.getCustomApi("getByCustomerId", params);
    }

    public async getCusDepartmentByIDAsync(customerId: any): Promise<CusDepartment[]> {
        const res = await this.getCusDepartmentByID(customerId).toPromise();
        if (res.isSuccess) {
            const data = res.data as CusDepartment[];
            return data;
        }
    }

    public createCusDepartment(model): Observable<ResponseModel> {
        return super.postCustomApi("Create", model);
    }

    public async createCusDepartmentAsync(model): Promise<CusDepartment> {
        const res = await this.createCusDepartment(model).toPromise();
        if (res.isSuccess) {
            return res.data as CusDepartment;
        }
        return null;
    }

    public updateCusDepartment(model): Observable<ResponseModel> {
        return super.postCustomApi("Update", model);
    }

    public async updateCusDepartmentAsync(model): Promise<CusDepartment> {
        const res = await this.updateCusDepartment(model).toPromise();
        if (res.isSuccess) {
            return res.data as CusDepartment;
        }
        return null;
    }

    public deleteCusDepartment(model): Observable<ResponseModel> {
        return super.postCustomApi("Delete", model);
    }

    public async deleteCusDepartmentAsync(model): Promise<CusDepartment> {
        const res = await this.deleteCusDepartment(model).toPromise();
        console.log(res);
        if (res.isSuccess) {
            return res.data as CusDepartment;
        }
        return null;
    }
}