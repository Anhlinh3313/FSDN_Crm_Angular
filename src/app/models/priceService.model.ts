import { GeneralModel } from "./general.model";
import { PriceList } from "./priceList.model";
import { Service } from "./service.model";
import { AreaGroup } from "./areaGroup.model";
import { WeightGroup } from "./weightGroup.model";


export class PriceService extends GeneralModel {

    priceListId: number;
    priceList: PriceList;
    areaGroupId: number;
    areaGroup: AreaGroup;
    weightGroupId: number;
    weightGroup: WeightGroup;
    serviceId: number;
    service: Service;

}