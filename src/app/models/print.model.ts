import { IBaseModel } from "./abstract/ibaseModel.interface";
import { Hub } from "./hub.model";
import { Customer } from "./customer.model";
import { Service } from "./index";
import { Shipment } from "./shipment.model";


export class PrintModel implements IBaseModel {
    id: number;
    type: string;
    fromAirport: string;
    createdBy: string;
    createdPhone: string;
    receiverBy: string;
    receiverPhone: string;
    listShipment: {
        shipmentNumber: string,
        senderName: string,
        receiverName: string,
        fromHub: string,
        toHub: string,
        fromWard: string,
        toWard: string,
        service: string,
        shippingAddress: string,
        weight: number,
        deliverUserId: number
    };
}