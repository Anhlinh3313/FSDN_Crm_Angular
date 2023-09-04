import { GeneralModel } from "./general.model";
import { Province } from "./province.model";
import { District } from "./district.model";
import { Ward } from "./ward.model";
import { CustomerPriceList } from "./customerPriceList.model";
import { User } from "./user.model";
import { Hub } from "./hub.model";
import { PaymentType } from "./paymentType.model";

export class Customer extends GeneralModel {
    createdBy: number;
    userName: string;
    passWord: string;
    nameEn: string;
    address: string;
    addressNote: string;
    businessLicenseNumber: string;
    email: string;
    fax: string;
    legalRepresentative: string;
    notes: string;
    parentCustomerId: number;
    phoneNumber: string;
    salesOrganizationId: number;
    customerStatusId: number;
    stopServiceAlertDuration: number;
    supportOrganizationId: number;
    taxCode: string;
    addressCompany: string;
    tradingName: string;
    customerTypeId: number;
    provinceId: number;
    districtId: number;
    wardId: number;
    website: string;
    workTimeId: number;
    lat: number;
    lng: number;
    vat: number;
    discount: number;
    commission: number;
    companyName: string;
    priceListIds: number[];
    isShowPrice:boolean;
    isAccept: boolean =true;
        
    startDate: any;
    endDate: any;
    signName: any;
    signRole: any;
    companyPhone: any;
    companyEmail: any;
    commissionCus: any;
    professions: any;

    province: Province;
    district: District;
    ward: Ward;
    customerPriceList: CustomerPriceList[];

    hub: Hub;
    hubId: number;

    accountingUser: User;
    accountingUserId: number;

    salesUser: User;
    salesUserId: number;

    supportUser: User;
    supportUserId: number;

    paymentTypeId: number;
    paymentType: PaymentType;
    vseOracleCode: string;
    
    tokenC: string;
    userC: string;
    passC: string;
    statusIdsC: string;
    typePushC: string;
}