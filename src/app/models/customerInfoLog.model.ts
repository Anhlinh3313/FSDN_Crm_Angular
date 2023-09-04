import { GeneralModel } from "./general.model";
import { Province } from "./province.model";
import { District } from "./district.model";
import { Ward } from "./ward.model";
import { Customer } from "./customer.model";

export class CustomerInfoLog extends GeneralModel {
    key?: any;
    sender?: Customer;
    senderId?: number;
    senderCode?: string;
    senderName?: string;
    createdBy?: number;
    phoneNumber?: string;
    companyName?: string;
    address?: string;
    province?: Province;
    provinceId?: number;
    provinceName?: string;
    district?: District;
    districtId?: number;
    districtName?: string;
    ward: Ward;
    wardId?: number;
    wardName?: string;
    isValid?: boolean;
    message?: string;
    totalCount?: number;
}