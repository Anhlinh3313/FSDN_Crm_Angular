import { GeneralModel } from "./general.model";
import { Hub } from "./hub.model";


export class PriceList extends GeneralModel {

    hubId: number;
    hub: Hub;
    fuelSurcharge: number;
    remoteSurcharge: number;
    publicDateFrom: Date;
    PublicDateTo: Date;
    isPublic:boolean;

}