import { GeneralModel } from "./general.model";
export class CusDepartment extends GeneralModel{
    customerID: number;
    code: string;
    name: string;
    id: number;
    createdWhen: string;
    createdBy: string;
    modifiedBy: string;
    concurrencyStamp: string;
    isEnabled: boolean;
    //===========//
    address: string;
    addressNote: string;
    phoneNumber: string;
    representativeName: string;
    provinceId: number;
    districtId: number;
    wardId: number;
    lat:number; 
    lng:number;
}