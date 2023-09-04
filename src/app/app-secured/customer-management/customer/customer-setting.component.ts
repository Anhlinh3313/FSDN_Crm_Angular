import { BaseComponent } from "../../../shared/components/baseComponent";
import { OnInit, AfterContentInit, Component, TemplateRef } from "@angular/core";
import { MessageService } from "primeng/components/common/messageservice";
import { Router } from "@angular/router";
import { PermissionService } from "../../../services/permission.service";
import { Constant } from "../../../infrastructure/constant";
import { SelectItem, LazyLoadEvent } from "primeng/primeng";
import { CustomerService, FormPrintService, CustomerPaymentToService } from "../../../services";
import { Customer, GeneralModel, CustomerPaymentTo } from "../../../models";
import { CustomerSetting } from "../../../models/customerSettng.model";
import { CustomerSettingService } from "../../../services/customerSetting.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormPrintTypeHelper } from "../../../infrastructure/formPrintType.helper";

@Component({
    selector: 'app-customer',
    templateUrl: 'customer-setting.component.html',
    styles: []
})
export class CustomerSettingComponent extends BaseComponent implements OnInit, AfterContentInit {
    constructor(
        private modalService: BsModalService,
        protected messageService: MessageService,
        public permissionService: PermissionService,
        public router: Router,
        private customerService: CustomerService,
        private customerPaymentToService: CustomerPaymentToService,
        private customerSettingService: CustomerSettingService,
        private formPrintService: FormPrintService
    ) {
        super(messageService, permissionService, router);
    }
    bsModalRef: BsModalRef;
    parentPage: string = Constant.pages.customer.name;
    currentPage: string = Constant.pages.customer.children.customerSetting.name;
    //
    listCustomers: SelectItem[] = [];
    filteredCustomers: string[] = [];
    selectedCustomer: any;
    //    
    listPaymentTos: any[] = [];
    filteredPaymentTos: string[] = [];
    selectedPaymentTo: any;
    //
    formPrints: SelectItem[] = [];
    selctedFormPrint: any;
    //
    data: CustomerSetting = new CustomerSetting();

    datasource: CustomerPaymentTo[] = [];
    totalRecords: number = 0;
    pageSize: number = 20;
    pageNumber: number = 1;
    searchValue: string = "";
    dataPaymentTo: CustomerPaymentTo = new CustomerPaymentTo();

    ngOnInit(): void {
        this.loadFormPrint();
    }
    ngAfterContentInit(): void {
    }
    loadFormPrint() {
        this.formPrintService.getFormPrintByTypeAsync(FormPrintTypeHelper.printBill).then(
            x => {
                if (!this.isValidResponse(x)) return;
                this.formPrints = [];
                this.formPrints.push({ value: null, label: `--- Chọn mẩu in ---` });
                (x.data as GeneralModel[]).map(m => this.formPrints.push({ value: m.id, label: `${m.code}` + ` - ` + `${m.name}` }));
            }
        )
    }

    loadDataSource() {
        if (!this.data.customerId) {
            this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Vui lòng chọn khách hàng cần cài đặt` });
            return;
        }
        this.datasource = [];
        let includes = [
            Constant.classes.includes.customer.paymentToCustomer
        ];
        this.customerPaymentToService.GetCustomerPaymentToAsync(this.data.customerId, this.searchValue, this.pageSize, this.pageNumber, includes).then(
            x => {
                if (!super.isValidResponse(x)) return;
                this.datasource = x.data as CustomerPaymentTo[];
                this.totalRecords = x.dataCount;
            }
        );
    }

    onPageChange(event: LazyLoadEvent) {
        this.pageNumber = event.first / event.rows + 1;
        this.pageSize = event.rows;
        this.loadDataSource();
    }

    openDeletePaymentToModel(template: TemplateRef<any>, data: CustomerPaymentTo) {
        if (!data) {
            this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Dữ liệu xóa trống` });
            return;
        }
        this.dataPaymentTo = this.cloneCustomerPaymentTo(data);
        this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-s' });
    }

    cloneCustomerPaymentTo(model: CustomerPaymentTo): CustomerPaymentTo {
        let data = new CustomerPaymentTo();
        for (let prop in model) {
            data[prop] = model[prop];
        }
        return data;
    }

    deletePaymentTo() {
        this.messageService.clear();
        if (!this.dataPaymentTo) {
            this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Không tìm thấy thông tin để xóa` });
            return;
        }
        this.customerPaymentToService.delete(this.dataPaymentTo).subscribe(x => {
            if (!this.isValidResponse(x)) return;
            let data = x.data as CustomerPaymentTo;
            let index = this.datasource.findIndex(f => f.id == data.id);
            if (index >= 0) {
                this.datasource.splice(index, 1);
                this.dataPaymentTo = new CustomerPaymentTo();
                this.totalRecords--;
                this.selectedPaymentTo = null;
                this.messageService.add({ severity: Constant.messageStatus.success, detail: `Đã xóa dữ liệu` });
                this.bsModalRef.hide();
            }
        });
    }

    eventFilterCustomer(event) {
        let value = event.query;
        if (value.length >= 3) {
            this.customerService.getSearchByValueAsync(value, null).then(
                x => {
                    if (x.isSuccess == true) {
                        this.listCustomers = [];
                        this.filteredCustomers = [];
                        (x.data as Customer[]).map(m => this.listCustomers.push({ value: m.id, label: `${m.code}` + ` - ` + `${m.name}` }));
                        this.listCustomers.map(m => this.filteredCustomers.push(m.label));
                    }
                }
            )
        }
    }


    eventFilterPaymentTo(event) {
        let value = event.query;
        if (value.length >= 3) {
            this.customerService.getSearchByValueAsync(value, null).then(
                x => {
                    if (x.isSuccess == true) {
                        this.listPaymentTos = [];
                        this.filteredPaymentTos = [];
                        (x.data as Customer[]).map(m => this.listPaymentTos.push({ value: m.id, label: `${m.code}` + ` - ` + `${m.name}`, data: m }));
                        this.listPaymentTos.map(m => this.filteredPaymentTos.push(m.label));
                    }
                }
            )
        }
    }

    eventOnSelectedCustomer() {
        let findU = this.listCustomers.find(f => f.label == this.selectedCustomer)
        if (findU) {
            this.data.customerId = findU.value;
            this.dataPaymentTo.customerId = findU.value;
            this.loadSettingCustomer();
            this.loadDataSource();
        } else {
            this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Không tìm thấy thông tin khách hàng.` });
        }
    }

    eventOnSelectedPaymentTo() {
        let findC = this.listPaymentTos.find(f => f.label == this.selectedPaymentTo)
        if (findC) {
            this.dataPaymentTo.paymentToCustomerId = findC.value;
        } else {
            this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Không tìm thấy thông tin khách hàng.` });
        }
    }

    loadSettingCustomer() {
        if (this.data.customerId) {
            this.customerSettingService.getSettingByCustomerAsync(this.data.customerId).then(
                x => {
                    if (this.isValidResponse(x))
                        this.data = x.data as CustomerSetting;
                }
            )
        } else {
            this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Vui lòng nhập mã khách khách hàng cần cài đặt.` });
        }
    }

    save() {
        this.messageService.clear();
        if (!this.data.customerId) {
            this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Vui lòng chọn khách hàng.` });
            return;
        }
        this.customerSettingService.createAndUpdateSettingCustomerAsync(this.data).then(
            x => {
                if (!this.isValidResponse(x)) return;
                this.messageService.add({ severity: Constant.messageStatus.success, detail: `Lưu cài đặt thành công.` });
            }
        )
    }

    savePaymentTo() {
        this.messageService.clear();
        if (!this.data.customerId) {
            this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Vui lòng chọn khách hàng.` });
            return;
        }
        this.dataPaymentTo.customerId = this.data.customerId;
        if (!this.dataPaymentTo.paymentToCustomerId) {
            this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Vui lòng chọn khách hàng được thanh toán.` });
            return;
        }
        this.customerPaymentToService.create(this.dataPaymentTo).subscribe(
            x => {
                if (!this.isValidResponse(x)) return;
                let data = x.data as CustomerPaymentTo;
                let fintC = this.listPaymentTos.find(f => f.value == data.paymentToCustomerId);
                if (fintC) data.paymentToCustomer = fintC.data;
                this.datasource.unshift(data);
                this.messageService.add({ severity: Constant.messageStatus.success, detail: `Lưu mã thanh toán thành công.` });
                this.dataPaymentTo = new CustomerPaymentTo();
                this.selectedPaymentTo = null;
            }
        )
    }

}