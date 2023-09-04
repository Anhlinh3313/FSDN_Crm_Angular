import { GeneralModel } from "./general.model";
import { Customer } from "./customer.model";

export class CustomerPaymentTo extends GeneralModel {
    customerId: number;
    paymentToCustomerId: number;

    customer: Customer;
    paymentToCustomer: Customer;
}