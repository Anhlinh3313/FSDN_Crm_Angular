import { GeneralModel } from "./general.model";

export class Package extends GeneralModel {
    content: string;
    weight: number;
    calWeight: number;
    length: number;
    width: number;
    height: number;
    isOpen: boolean;
    shipmentIds: number[];
}