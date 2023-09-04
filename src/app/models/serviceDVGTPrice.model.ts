import { GeneralModel } from "./general.model";
import { Formula } from "./formula.model";
import { ServiceDVGT } from "./serviceDVGT.model";


export class ServiceDVGTPrice extends GeneralModel {
    serviceDVGTId: number;
    serviceDVGT: ServiceDVGT;
    formulaId: number;
    formula:Formula;
    valueFrom: number;
    valueTo: number;
    price: number;

}