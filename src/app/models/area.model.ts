import { GeneralModel } from "./general.model";
import { AreaGroup } from "./areaGroup.model";
import { District } from "./district.model";
import { Province } from "./province.model";

export class Area extends GeneralModel {
    areaGroupId: number;
    areaGroup: AreaGroup;
    districtIds: number[];
    district: District;
    province: Province;
    
}