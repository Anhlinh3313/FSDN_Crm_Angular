import { GeneralModel } from "./general.model";

export class Reason extends GeneralModel {
    pickFail: boolean;
    pickCancel: boolean;
    deliverFail: boolean;
    deliverCancel: boolean;
    returnFail: boolean;
    returnCancel: boolean;
    itemOrder: number;
}