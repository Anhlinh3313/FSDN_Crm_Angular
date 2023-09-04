import { Component, OnInit, TemplateRef } from '@angular/core';
import { BaseComponent } from '../../../shared/components/baseComponent';
import { Router } from '@angular/router';
import { PermissionService } from '../../../services/permission.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { Constant } from '../../../infrastructure/constant';
import { Customer, District, Ward } from '../../../models';
import { CustomerInfoLogService } from '../../../services/customerInfoLog.service';
import { CustomerService, ProvinceService, DistrictService, WardService } from '../../../services';
import { LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { FilterUtil } from '../../../infrastructure/filter.util';
import { CustomerInfoLog } from '../../../models/customerInfoLog.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-list-receiver',
  templateUrl: './list-receiver.component.html',
})
export class ListReceiverComponent extends BaseComponent implements OnInit {
  bsModalRef: BsModalRef;
  event: LazyLoadEvent;
  filterRows: any[];
  totalRecords: number = 0;
  rowPerPage: number = 20;
  pageNum = 1;
  listCusInfoLog: CustomerInfoLog[];
  data: CustomerInfoLog;
  searchText: string = "";
  customers: any[];
  selectedCustomer: number = null;
  customer: any;
  filteredCustomers: any;
  //
  provinces: SelectItem[] = [];
  districts: SelectItem[] = [];
  wards: SelectItem[] = [];
  modalTitleAddOrUpate: string = "";

  columns: any[] = [
    { field: "code", header: "Mã KH nhận" },
    { field: "name", header: "Tên khách hàng nhận" },
    { field: "phoneNumber", header: "Số đt" },
    { field: "address", header: "Địa chỉ" },
    { field: "addressNote", header: "Địa chỉ chi tiết" },
    { field: "senderCode", header: "Mã KH gửi" },
    { field: "senderName", header: "Tên KH gửi" },
    { field: "provinceName", header: "Tỉnh/Thành" },
    { field: "districtName", header: "Quận/Huyện" },
    { field: "wardName", header: "Phường/Xã" }
  ];

  parentPage: string = Constant.pages.receiver.name;
  currentPage: string = Constant.pages.receiver.children.listReceiver.name;

  constructor(
    private customerInfoLogService: CustomerInfoLogService,
    private customerService: CustomerService,
    private provinceService: ProvinceService,
    private districtService: DistrictService,
    private wardService: WardService,
    private modalService: BsModalService,
    protected messageService: MessageService,
    protected permissionService: PermissionService,
    protected router: Router
  ) {
    super(messageService, permissionService, router);
  }

  ngOnInit() {
    this.loadProvince();
  }

  async loadProvince() {
    const provinces = await this.provinceService.getAllSelectModelAsync();
    if (provinces) {
      this.provinces = provinces;
    }
  }

  async changeProvince(selectedDistrict: number = null) {
    this.districts = [];
    this.wards = [];

    if (!this.data.provinceId) return;
    await this.districtService.getDistrictByProvinceId(this.data.provinceId).toPromise().then(
      x => {
        if (!super.isValidResponse(x)) return;
        let objs = x.data as District[];
        this.districts.push({ label: `-- Chọn quận/huyện --`, value: null });
        objs.forEach(element => {
          this.districts.push({ label: `${element.code} - ${element.name}`, value: element.id });
        });
        if (selectedDistrict) this.data.districtId = selectedDistrict;
        else this.data.districtId = null;
      }
    );
  }

  async changeDistrict(selectedWard: number = null) {
    this.wards = [];
    if (!this.data.districtId) return;
    await this.wardService.getWardByDistrictId(this.data.districtId).toPromise().then(
      x => {
        if (!super.isValidResponse(x)) return;
        let objs = x.data as Ward[];
        this.wards.push({ label: `-- Chọn phường/xã --`, value: null });
        objs.forEach(element => {
          this.wards.push({ label: `${element.code} - ${element.name}`, value: element.id });
        });
        if (selectedWard) this.data.wardId = selectedWard;
        else this.data.wardId = null;
      }
    );
  }

  async loadCustomerInfoLog() {
    const res = await this.customerInfoLogService.getListCustomerInfologAsync(this.selectedCustomer, this.searchText, this.rowPerPage, this.pageNum);
    if (res) {
      if (res.isSuccess) {
        const data = res.data as CustomerInfoLog[] || [];
        this.listCusInfoLog = data;
        this.totalRecords = data.length > 0 ? data[0].totalCount : 0;
      }
    }
  }

  loadLazy(event: LazyLoadEvent) {
    this.event = event;
    setTimeout(() => {
      if (this.listCusInfoLog) {
        this.filterRows = this.listCusInfoLog;
        // sort data
        this.filterRows.sort(
          (a, b) =>
            FilterUtil.compareField(a, b, event.sortField) * event.sortOrder
        );
        this.listCusInfoLog = this.filterRows;
      }
    }, 250);
  }

  onPageChange(event: LazyLoadEvent) {
    this.pageNum = event.first / event.rows + 1;
    this.rowPerPage = event.rows;
    this.loadCustomerInfoLog();
  }

  filterCustomers(event) {
    let value = event.query;
    if (value.length >= 1) {
      this.customerService.getByCustomerCodeAsync(value, null, 10, 1, null).then(
        x => {
          if (x.isSuccess == true) {
            this.customers = [];
            this.filteredCustomers = [];
            let data = (x.data as Customer[]);
            data.map(m => {
              this.customers.push({ value: m.id, label: `${m.code} ${m.name}`, data: m });
              this.filteredCustomers.push(`${m.code} ${m.name}`);
            });
          }
        }
      );
    }
  }

  onSelectedCustomer() {
    let cloneSelectedCustomer = this.customer;
    this.customers.forEach(x => {
      let obj = x.data as Customer;
      if (obj) {
        if (cloneSelectedCustomer === x.label) {
          this.selectedCustomer = obj.id;
          this.changeCustomer();
        }
      }
    });
  }

  changeCustomer() {
    this.pageNum = 1;
    this.loadCustomerInfoLog();
  }

  onSearchText() {
    this.pageNum = 1;
    this.loadCustomerInfoLog();
  }

  refresh() {
    this.searchText = null;
    this.selectedCustomer = null;
    this.pageNum = 1;
    this.rowPerPage = 20;
    this.totalRecords = 0;
    this.loadCustomerInfoLog();
  }

  clone(model: CustomerInfoLog): CustomerInfoLog {
    let data = new CustomerInfoLog();
    for (let prop in model) {
      data[prop] = model[prop];
    }
    return data;
  }

  async openModelCreateOrUpdate(template: TemplateRef<any>, model?: CustomerInfoLog) {
    if (!model) model = new CustomerInfoLog();
    if (!this.selectedCustomer) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Vui lòng chọn khách hàng` });
      return;
    }
    const cus = this.customers.find(f => f.value == this.selectedCustomer);
    if (!cus) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Không tìm thấy thông tin khách hàng vui lòng kiểm tra lại` });
      return;
    }
    if (model.id) {
      this.modalTitleAddOrUpate = `Cập nhật thông tin người nhận của khách hàng: ${cus.data.code}-${cus.data.name}`;
      await this.customerInfoLogService.get(model.id).toPromise().then(
        async x => {
          if (!this.isValidResponse(x)) return;
          this.data = this.clone(x.data);
          await this.changeProvince(this.data.districtId);
          await this.changeDistrict(this.data.wardId);
        }
      )
    }
    else {
      this.modalTitleAddOrUpate = `Thêm mới thông tin người nhận của khách hàng: ${cus.data.code}-${cus.data.name}`;
      this.data = new CustomerInfoLog();
    }
    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-lg' });
  }

  async createOrUpdate() {
    if (!this.data) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Thông tin trống, vui lòng kiểm tra lại!` });
      return;
    }
    if (!this.selectedCustomer) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Vui lòng chọn khách hàng` });
      return;
    }
    const cus = this.customers.find(f => f.value == this.selectedCustomer);
    if (!cus) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Không tìm thấy thông tin khách hàng vui lòng kiểm tra lại` });
      return;
    } else {
      this.data.senderId = this.selectedCustomer;
    }
    if (!this.data.code) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Vui lòng nhập mã người nhận!` });
      return;
    }
    if (!this.data.name) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Vui lòng nhập tên người nhận!` });
      return;
    }
    if (!this.data.address) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Vui lòng nhập địa chỉ nhận hàng!` });
      return;
    }
    if (!this.data.provinceId) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Vui lòng nhập tỉnh/thành nhận!` });
      return;
    }
    if (!this.data.districtId) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Vui lòng nhập quận/huyện nhận!` });
      return;
    }
    if (!this.data.phoneNumber) {
      this.data.phoneNumber = "0";
    }
    if (!this.data.id) {
      const res = await this.customerInfoLogService.createImportExcelAsync([this.data]);
      if (!this.isValidResponse(res)) return;
      this.messageService.add({ severity: Constant.messageStatus.success, detail: `Thêm mới người nhận thành công!` });
    } else {
      const res = await this.customerInfoLogService.updateImportExcelAsync([this.data]);
      if (!this.isValidResponse(res)) return;
      this.messageService.add({ severity: Constant.messageStatus.success, detail: `Cập nhật người nhận thành công!` });
    }
    this.loadCustomerInfoLog();
    this.data = new CustomerInfoLog();
    this.bsModalRef.hide();
  }
}
