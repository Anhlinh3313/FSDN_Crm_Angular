import { IBaseModel } from "./abstract/ibaseModel.interface";


export class CustomerPriceList implements IBaseModel {
    id: number;
    customerId: number;
    priceListId: number;
}