import { Component, OnInit, TemplateRef, ViewChild, ElementRef, NgZone, AfterContentInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
//
import { Constant } from '../../../infrastructure/constant';
import { LazyLoadEvent, SelectItem, InputText, InputTextModule } from 'primeng/primeng';
import { BaseModel } from '../../../models/base.model';
import { MessageService } from 'primeng/components/common/messageservice';
import { CustomerService, ProvinceService, DistrictService, WardService, HubService, AuthService, UserService, PaymentTypeService } from '../../../services/index';
import { Customer, Province, District, Ward, User, Hub } from '../../../models/index';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { BaseComponent } from '../../../shared/components/baseComponent';
import { GMapHelper } from '../../../infrastructure/gmap.helper';
import { CustomerTypeService } from '../../../services/customerType.service';
import { CustomerType } from '../../../models/customerType.model';
import { KeyCodeUtil } from '../../../infrastructure/keyCode.util';
import { CusDepartment } from '../../../models/cusDepartment.model';
import { CusDepartmentService } from '../../../services/cusDepartment.service';
import { PermissionService } from '../../../services/permission.service';
import { Router } from '@angular/router';
import { GeocodingApiService } from '../../../services/geocodingApiService.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CustomerTypeHelper } from '../../../infrastructure/customerType.helper';
import { SearchDate } from '../../../infrastructure/searchDate.helper';

declare var jQuery: any;

@Component({
  selector: 'app-customer',
  templateUrl: 'customer.component.html',
  styles: []
})
export class CustomerComponent extends BaseComponent implements OnInit, AfterContentInit {

  wopts: XLSX.WritingOptions = { bookType: "xlsx", type: "binary" };
  fileName: string = "Customer.xlsx";
  departmentAddressId: string = "departmentAddressId";
  cusAddressId: string = "cusAddressId";
  filterSelectedProvince: number;
  filterProvinces: SelectItem[];
  constructor(private modalService: BsModalService,
    private customerService: CustomerService,
    protected geocodingApiService: GeocodingApiService,
    protected messageService: MessageService,
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader,
    private provinceService: ProvinceService,
    private districtService: DistrictService,
    private wardService: WardService,
    private customerTypeService: CustomerTypeService,
    private cusDepartmentService: CusDepartmentService,
    public permissionService: PermissionService,
    public router: Router,
    private hubService: HubService,
    private authService: AuthService,
    private userService: UserService,
    private paymentTypeService: PaymentTypeService
  ) {
    super(messageService, permissionService, router);
  }

  @ViewChild("txtSearch") txtSearch: ElementRef;

  columns = ["code", "name", "phoneNumber", "address", "paymentType.name", "hub.name", "salesUser.fullName", "supportUser.fullName", "accountingUser.fullName", "vseOracleCode"];

  columnsExport = [
    { field: "code", header: "Mã" },
    { field: "name", header: "Tên" },
    { field: "phoneNumber", header: "Điện thoại" },
    { field: "address", header: "Địa chỉ" },
    { field: "paymentType.name", header: "Hình thức thanh toán" },
    { field: "hub.name", header: "TT/CN/Trạm nhận" },
    { field: "salesUser.fullName", header: "Nhân viên kinh doanh" },
    { field: "supportUser.fullName", header: "Nhân viên cskh" },
    { field: "accountingUser.fullName", header: "Nhân viên công nợ" },
    { field: "vseOracleCode", header: "Mã kết nối" }
  ];
  isInputCustomerCode: boolean = false;
  customerCodeText: string = 'Mã khách hàng (*)';
  currentUserId: number;
  sortOrder: number;
  sortField: string;
  parentPage: string = Constant.pages.customer.name;
  currentPage: string = Constant.pages.customer.children.customer.name;
  modalTitle: string;
  bsModalRef: BsModalRef;
  displayDialog: boolean;
  data: Customer;
  selectedData: Customer;
  isNew: boolean;
  listData: Customer[] = [];
  //
  currentUser: User;
  //
  datasource: Customer[] = [];
  totalRecords: number;
  pageSize: number = 20;
  pageNumber: number = 1;
  //
  curentHub: Hub;
  fromHub: string;
  //
  provinces: SelectItem[];
  selectedProvince: number;
  districts: SelectItem[];
  selectedDistrict: number;
  wards: SelectItem[];
  selectedWard: number;
  //
  paymentTypes: SelectItem[];
  selectedPaymentType: number;
  //
  test: any[] = [];
  receiverHubs: SelectItem[];
  selectedReceiverHub: any;
  //
  customerTypes: SelectItem[];
  selectedCustomerType: number;
  //
  users: User[];
  selectedUserBusiness: number;
  selectedUserDebt: number;
  selectedUserCare: number;
  //
  txtEmailAddress: any;
  txtPhoneNumber: any;
  //
  listParentCustomers: SelectItem[] = [];
  filteredParentCustomers: string[] = [];
  selectedParentCustomer: any;
  //
  public searchControl: FormControl;
  public searchElementRef: ElementRef;
  public latitude: number;
  public longitude: number;
  public zoom: number;
  // CusDepartment
  textButtonSave: string = "Tạo mới"
  lstCusDepartment: CusDepartment[];
  totalCusDepartment: number = 0;
  customerID: number;
  departmentID: number;
  editDepartmentID: number = 0;
  departmendCode_Old: string = "";
  departmentCode: string = "";
  departmentName: string = "";
  //================
  departmentRepresentativeName: string = "";
  departmentPhoneNumber: string = "";
  departmentAddress: string = "";
  dataDepartment: CusDepartment = new CusDepartment();
  //================
  errorDepartmentCode: boolean = false;
  errorDepartmentName: boolean = false;
  isEditCusDepartment: boolean = false;
  bsModalRefDeleteCusDepartment: BsModalRef;

  isAccept = [
    { value: null, label: 'Chọn tất cả' },
    { value: true, label: 'Đã kích hoạt' },
    { value: false, label: 'Chưa kích hoạt' },
  ];
  selectedIsAccept: any;
  event: LazyLoadEvent;
  userSs: SelectItem[] = [];
  salesUserSelected: any;
  userSPs: SelectItem[] = [];
  supportUserSelected: any;
  userAccountings: SelectItem[] = [];
  accountingUserSelected: any;
  //
  userSFilters: string[] = [];
  userSPFilters: string[] = [];
  userAccFilters: string[] = [];
  //
  async ngOnInit() {
    await this.loadProvince();
    this.initData();
    this.loadPaymentType();
    this.customerCodeChange();
  }

  async loadPaymentType() {
    this.paymentTypeService.getAll().subscribe(
      x => {
        if (!super.isValidResponse(x)) return;
        this.paymentTypes = [];
        let data = x.data as CustomerType[];

        this.paymentTypes.push({ label: `-- Chọn HTTT --`, value: null });
        data.forEach(element => {
          this.paymentTypes.push({ label: element.name, value: element.id });
        });
      }
    );
  }

  async initData() {
    this.customerTypeService.getAll().subscribe(
      x => {
        if (!super.isValidResponse(x)) return;
        this.customerTypes = [];
        let customerTypes = x.data as CustomerType[];

        this.customerTypes.push({ label: `--Chọn loại khách hàng--`, value: null });
        customerTypes.forEach(element => {
          this.customerTypes.push({ label: element.name, value: element.id });
        });
      }
    );
    this.loadDataSource();
    this.loadGroupReceiverHubs();
    this.data = null;
    this.selectedData = null;
    this.isNew = true;
  }

  eventEnterSearch() {
    this.pageNumber = 1;
    this.loadDataSource();
  }

  loadDataSource() {
    this.sortOrder = 1;
    this.sortField = "code";
    let includes = [
      Constant.classes.includes.customer.customerPriceList,
      Constant.classes.includes.customer.hub,
      Constant.classes.includes.customer.accountingUser,
      Constant.classes.includes.customer.salesUser,
      Constant.classes.includes.customer.supportUser,
      Constant.classes.includes.customer.paymentType
    ];
    this.customerService.getCreatedByAsync(this.txtSearch.nativeElement.value, this.selectedIsAccept, this.filterSelectedProvince, includes, this.pageSize, this.pageNumber).then(
      x => {
        if (!super.isValidResponse(x)) return;
        this.datasource = x.data as Customer[];
        this.totalRecords = x.dataCount;
      }
    );
  }

  eventFilterParentCustomer(event) {
    let value = event.query;
    if (value.length >= 3) {
      this.searchParentCustomer(value, this.data.parentCustomerId);
    }
  }

  searchParentCustomer(value: string, currentId: any) {
    this.customerService.getSearchByValueAsync(value, currentId).then(
      x => {
        if (x.isSuccess == true) {
          this.listParentCustomers = [];
          this.filteredParentCustomers = [];
          (x.data as Customer[]).map(m => this.listParentCustomers.push({ value: m.id, label: `${m.code}` + ` - ` + `${m.name}` }));
          this.listParentCustomers.map(m => this.filteredParentCustomers.push(m.label));
          if (this.data.parentCustomerId) {
            let findParentCustomer = this.listParentCustomers.find(f => f.value == this.data.parentCustomerId);
            if (findParentCustomer) this.selectedParentCustomer = findParentCustomer.label;
            else this.selectedParentCustomer = null;
          } else this.selectedParentCustomer = null;
        }
      }
    )
  }

  eventOnSelectedParentCustomer() {
    let findU = this.listParentCustomers.find(f => f.label == this.selectedParentCustomer)
    if (findU) this.data.parentCustomerId = findU.value;
    else this.data.parentCustomerId = null;
  }

  onPageChange(event: LazyLoadEvent) {
    this.pageNumber = event.first / event.rows + 1;
    this.pageSize = event.rows;
    this.loadDataSource();
  }

  initMapCusAddress() {
    this.zoom = 4;
    this.mapsAPILoader.load().then(() => {
      let cusAddressAutocomplete = new google.maps.places.Autocomplete(
        <HTMLInputElement>document.getElementById("cusAddressId"),
        {
          // types: ["address"]
        }
      );
      cusAddressAutocomplete.addListener("place_changed", () => {
        this.ngZone.run(async () => {
          //get the place result
          let place: google.maps.places.PlaceResult = cusAddressAutocomplete.getPlace();

          //verify result
          if (!place.geometry) {
            place = await this.geocodingApiService.findFromAddressAsync(place.name);
            if (!place) {
              this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Không tìm thấy địa chỉ" });
              return;
            }
          }
          this.loadLocationPlace(place);
          this.data.address = place.formatted_address;
          this.data.lat = place.geometry.location.lat();
          this.data.lng = place.geometry.location.lng();
          this.zoom = 16;
        });
      });
    });
  }

  initMapCusDepartmentAddress() {
    this.zoom = 4;
    this.mapsAPILoader.load().then(() => {
      let departmentAddressAutocomplete = new google.maps.places.Autocomplete(
        <HTMLInputElement>document.getElementById("departmentAddressId"),
        {
          // types: ["address"]
        }
      );
      departmentAddressAutocomplete.addListener("place_changed", () => {
        this.ngZone.run(async () => {
          //get the place result
          let place: google.maps.places.PlaceResult = departmentAddressAutocomplete.getPlace();

          //verify result
          if (!place.geometry) {
            place = await this.geocodingApiService.findFromAddressAsync(place.name);

            if (!place) {
              this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Không tìm thấy địa chỉ" });
              return;
            }
          }
          this.loadLocationPlaceDepartment(place);
          this.dataDepartment.address = place.formatted_address;
          this.dataDepartment.lat = place.geometry.location.lat();
          this.dataDepartment.lng = place.geometry.location.lng();
          this.zoom = 16;
        });
      });
    });
  }

  async loadCurrentUser() {
    const id = this.authService.getUserId();
    this.currentUser = await this.userService.getAsync(id);
    if (this.currentUser.hub) {
      this.curentHub = this.currentUser.hub;
      this.fromHub = this.currentUser.hub.name;
    }
  }

  async loadGroupReceiverHubs() {
    let receiverHubs = [];
    let receiverHub = [];
    const hubs = await this.hubService.getAllAsync();

    if (hubs) {
      let senderHubsLAT = [];
      senderHubsLAT.push({ label: `-- Chọn trạm --`, value: null });
      hubs.forEach(element => {
        if (element.centerHubId) {
          // get SelectItemHubs with tag Title
          receiverHub.push({
            label: element.name, value: element.id, title: element.centerHubId.toString(), data: element
          });
        }
        // get senderHubLAT
        senderHubsLAT.push({
          label: `${element.code} - ${element.name}`,
          value: element.id
        });
      });
    }

    let groupOfCenterHubs = receiverHub.reduce((outData, item) =>
      // group all Hubs by title
      Object.assign(outData, { [item.title]: (outData[item.title] || []).concat(item) })
      , []);
    let centerHubs = [];
    hubs.map(x => {
      if (!x.centerHubId) {
        centerHubs.push(x);
        return x;
      }
    });
    centerHubs.forEach(x => {
      groupOfCenterHubs.forEach((y, index) => {
        if (x.id == y[0].title) {
          let hubs = y;
          hubs.push({
            label: x.name,
            value: x.id,
            title: null
            // data: x
          })
          // }
          receiverHubs.push({
            label: `-- ${x.name} --`,
            items: hubs,
          });
          this.receiverHubs = receiverHubs;
        }
      });
    });

    let data = [];

    this.receiverHubs.map((center: any) => {
      center["items"].map(item => {
        data.push({ group: center.label, label: item.label, value: item.value, data: item.data });
      });
    });

    this.receiverHubs = data;
  }

  async loadProvince() {
    this.provinces = [];
    this.selectedProvince = null;
    this.districts = [];
    this.selectedDistrict = null;
    this.wards = [];
    this.selectedWard = null;

    const provinces = await this.provinceService.getAllSelectModelAsync();
    if (provinces) {
      this.provinces = provinces;
    }
  }

  loadDistrict(selectedDistrict: number = null) {
    this.selectedDistrict = null;
    this.districts = [];
    this.wards = [];
    this.selectedWard = null;

    if (!this.selectedProvince) return;

    this.districtService.getDistrictByProvinceId(this.selectedProvince).subscribe(
      x => {
        if (!super.isValidResponse(x)) return;
        let objs = x.data as District[];

        this.districts.push({ label: `-- Chọn quận/huyện --`, value: null });
        objs.forEach(element => {
          this.districts.push({ label: `${element.code} - ${element.name}`, value: element.id });
        });

        if (selectedDistrict)
          this.selectedDistrict = selectedDistrict;
      }
    );
  }

  loadWard(selectedDistrict: number = null, selectedWard: number = null) {
    this.wards = [];

    if (!this.selectedDistrict && !selectedDistrict) return;
    if (!selectedDistrict) {
      selectedDistrict = this.selectedDistrict;
    }

    this.wardService.getWardByDistrictId(selectedDistrict).subscribe(
      x => {
        if (!super.isValidResponse(x)) return;
        let objs = x.data as Ward[];

        this.wards.push({ label: `-- Chọn phường/xã --`, value: null });
        objs.forEach(element => {
          this.wards.push({ label: `${element.code} - ${element.name}`, value: element.id });
        });

        if (selectedWard)
          this.selectedWard = selectedWard;
        this.changeWard();
      }
    );
  }

  changeWard() {
    let find = this.receiverHubs.find((item: any) => item.data && item.data.wardId == this.selectedWard && item.data.provinceId == this.selectedProvince);
    this.selectedReceiverHub = find ? find.value : this.data ? this.data.hubId : null

    this.changeReceiverHub();
  }

  async changeReceiverHub() {
    this.users = await this.userService.getModelEmpByHubIdAsync(this.selectedReceiverHub);

    if (this.data) {
      if (this.data.accountingUserId)
        // this.selectedUserDebt = this.data.accountingUserId;
        this.accountingUserSelected = this.data.accountingUser ? this.data.accountingUser.fullName : "";

      if (this.data.supportUserId)
        // this.selectedUserCare = this.data.supportUserId;
        this.supportUserSelected = this.data.supportUser ? this.data.supportUser.fullName : "";

      if (this.data.accountingUserId)
        // this.selectedUserBusiness = this.data.salesUserId;
        this.salesUserSelected = this.data.salesUser ? this.data.salesUser.fullName : "";
    }
  }

  async loadLocationPlace(place: google.maps.places.PlaceResult) {
    let provinceName = "";
    let districtName = "";
    let wardName = "";

    // place = await this.geocodingApiService.findFirstFromLatLngAsync(
    //   place.geometry.location.lat(),
    //   place.geometry.location.lng()
    // ) as google.maps.places.PlaceResult;

    place.address_components.forEach(element => {
      if (element.types.indexOf(GMapHelper.ADMINISTRATIVE_AREA_LEVEL_1) !== -1) {
        provinceName = element.long_name;
      } else if (element.types.indexOf(GMapHelper.ADMINISTRATIVE_AREA_LEVEL_2) !== -1) {
        districtName = element.long_name;
      } else if (element.types.indexOf(GMapHelper.ADMINISTRATIVE_AREA_LEVEL_3) !== -1 || element.types.indexOf(GMapHelper.SUBLOCALITY_LEVEL_1) !== -1) {
        wardName = element.long_name;
      } else if (element.types.indexOf(GMapHelper.SUBLOCALITY_LEVEL_1) !== -1) {
        wardName = element.long_name;
      }
    });

    this.provinceService.getProvinceByName(provinceName).subscribe(
      async x => {
        if (!super.isValidResponse(x)) return;
        let province = x.data as Province;
        if (!province) {
          this.selectedProvince = null;
          return;
        }
        this.selectedProvince = province.id;
        this.selectedDistrict = null;
        await this.loadDistrict();
        this.districtService.getDistrictByName(districtName, this.selectedProvince).subscribe(
          x => {
            if (!super.isValidResponse(x)) return;
            let district = x.data as District;
            if (!district) {
              this.selectedDistrict = null;
              return;
            }
            this.selectedDistrict = district.id;
            this.selectedWard = null;

            this.loadWard();
            this.wardService.getWardByName(wardName, this.selectedDistrict).subscribe(
              x => {
                if (!super.isValidResponse(x)) return;
                let ward = x.data as Ward;

                if (!ward) {
                  this.selectedWard = null;
                  return;
                }
                this.selectedWard = ward.id;

                this.changeWard();

              } //End wardService
            );
          } //End districtService
        );
      } //End provinceService
    );
  }

  ngAfterContentInit() {
    // jQuery(document).ready(function () {
    //   jQuery('.i-checks').iCheck({
    //     checkboxClass: 'icheckbox_square-green',
    //     radioClass: 'iradio_square-green',
    //   });
    //   jQuery('.footable').footable();
    // });
  }

  public setAddress(place: google.maps.places.PlaceResult) {
    if (!place.geometry || !place.geometry) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Không tìm thấy địa chỉ" });
      return;
    }

    this.loadLocationPlace(place);
    this.data.address = place.formatted_address;
    this.data.lat = place.geometry.location.lat();
    this.data.lng = place.geometry.location.lng();
  }

  // Department
  async loadCusDepartment() {
    const rs = await this.cusDepartmentService.getCusDepartmentByIDAsync(this.customerID);
    if (rs) {
      this.lstCusDepartment = rs;
      this.totalCusDepartment = this.lstCusDepartment.length;
    }
  }

  async refreshCusDepartment() {
    this.textButtonSave = "Tạo mới";
    this.departmentCode = "";
    this.departmentName = "";
    this.departmentRepresentativeName = "";
    this.departmentPhoneNumber = "";
    this.departmentAddress = "";
    this.departmendCode_Old = ""
    this.editDepartmentID = 0;
  }

  async openModelDepartment(template: TemplateRef<any>, data: Customer = null) {
    this.refreshCusDepartment();
    this.customerID = data.id;
    await this.loadCusDepartment();
    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-lg' });
    setTimeout(() => {
      this.initMapCusDepartmentAddress();
    }, 1000);
  }

  editCusDepartment(data: CusDepartment) {
    this.editDepartmentID = data.id;
    this.departmendCode_Old = data.code;
    this.departmentCode = data.code;
    this.departmentName = data.name;
    this.departmentRepresentativeName = data.representativeName;
    this.departmentPhoneNumber = data.phoneNumber;
    this.departmentAddress = data.address;
    this.textButtonSave = "Cập nhật"
  }

  async saveCusDepartment() {
    // Check code null
    if (this.departmentCode.trim()) {
      this.errorDepartmentCode = false;
      // Check name null
      if (this.departmentName.trim()) {
        this.errorDepartmentName = false;
        // Check code đã tồn tại
        let codeExist = false;
        let idExist: number;
        let index: number;
        for (let i = 0; i < this.lstCusDepartment.length; i++) {
          const element = this.lstCusDepartment[i];
          if (element.code == this.departmentCode.trim()) {
            idExist = element.id;
            index = i;
            codeExist = true;
            break;
          }
        }

        if (!this.departmentAddress) {
          this.dataDepartment.address = null;
          this.dataDepartment.lat = null;
          this.dataDepartment.lng = null;
          this.dataDepartment.provinceId = null;
          this.dataDepartment.districtId = null;
          this.dataDepartment.wardId = null;
        }

        // Nếu chưa tồn tại
        if (this.editDepartmentID == 0) {
          if (codeExist) {
            this.messageService.add({ severity: Constant.messageStatus.error, detail: "Mã phòng ban đã tồn tại" });
          }
          else {
            // Model
            let cusDepartment: CusDepartment = new CusDepartment()
            cusDepartment.code = this.departmentCode;
            cusDepartment.name = this.departmentName;
            //=========
            cusDepartment.representativeName = this.departmentRepresentativeName;
            cusDepartment.phoneNumber = this.departmentPhoneNumber;
            cusDepartment.address = this.dataDepartment.address;
            cusDepartment.lat = this.dataDepartment.lat;
            cusDepartment.lng = this.dataDepartment.lng;
            cusDepartment.provinceId = this.dataDepartment.provinceId;
            cusDepartment.districtId = this.dataDepartment.districtId;
            cusDepartment.wardId = this.dataDepartment.wardId;
            //=========
            cusDepartment.customerID = this.customerID;

            // Add
            let rs = await this.cusDepartmentService.createCusDepartmentAsync(cusDepartment);

            // Success
            if (rs) {
              // await this.refreshCusDepartment();
              this.lstCusDepartment.push(rs);
              this.messageService.add({ severity: Constant.messageStatus.success, detail: "Thêm phòng ban thành công" });
              this.refreshCusDepartment();
            }
            // False
            else {
              this.messageService.add({ severity: Constant.messageStatus.error, detail: "Thêm phòng ban lỗi" });
            }
          }
        }
        //Nếu đã tồn tại
        else {
          if (this.departmentCode != this.departmendCode_Old && codeExist) {
            this.messageService.add({ severity: Constant.messageStatus.error, detail: "Mã phòng ban đã tồn tại" });
          }
          else {
            // Model
            let cusDepartment: CusDepartment = new CusDepartment();

            cusDepartment.id = this.editDepartmentID;
            cusDepartment.code = this.departmentCode;
            cusDepartment.name = this.departmentName;
            //=========
            cusDepartment.representativeName = this.departmentRepresentativeName;
            cusDepartment.phoneNumber = this.departmentPhoneNumber;
            cusDepartment.address = this.dataDepartment.address;
            cusDepartment.lat = this.dataDepartment.lat;
            cusDepartment.lng = this.dataDepartment.lng;
            cusDepartment.provinceId = this.dataDepartment.provinceId;
            cusDepartment.districtId = this.dataDepartment.districtId;
            cusDepartment.wardId = this.dataDepartment.wardId;
            //=========
            cusDepartment.customerID = this.customerID;

            // Update
            let rs = await this.cusDepartmentService.updateCusDepartmentAsync(cusDepartment);

            // Success
            if (rs) {
              // await this.refreshCusDepartment();
              for (let i = 0; i < this.lstCusDepartment.length; i++) {
                const item = this.lstCusDepartment[i];
                if (item.id == this.editDepartmentID) {
                  item.code = this.departmentCode;
                  item.name = this.departmentName;
                  item.representativeName = this.departmentRepresentativeName;
                  item.phoneNumber = this.departmentPhoneNumber;
                  item.address = this.departmentAddress;
                  break;
                }
              }
              this.editDepartmentID = 0;
              this.messageService.add({ severity: Constant.messageStatus.success, detail: "Cập nhật phòng ban thành công" });
              this.refreshCusDepartment();
              this.loadCusDepartment();
              return;
            }
            // False
            else {
              this.messageService.add({ severity: Constant.messageStatus.error, detail: "Cập nhật phòng ban lỗi" });
              return;
            }
          }
        }
      }
      else {
        this.errorDepartmentName = true;
      }
    }
    else {
      this.errorDepartmentCode = true;
    }
  }

  openDeleteModalCusDepartment(template: TemplateRef<any>, data: CusDepartment = null) {
    this.departmentID = data.id;
    this.bsModalRefDeleteCusDepartment = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-sm' });
  }

  async deleteCusDepartment() {
    let cusDepartment: CusDepartment = new CusDepartment();
    cusDepartment.id = this.departmentID;
    const rs = await this.cusDepartmentService.deleteCusDepartmentAsync(cusDepartment);

    if (rs) {
      // await this.refreshCusDepartment();
      for (let i = 0; i < this.lstCusDepartment.length; i++) {
        const item = this.lstCusDepartment[i];
        if (item.id == this.departmentID) {
          this.lstCusDepartment.splice(i, 1);
          break;
        }
      }
      this.messageService.add({ severity: Constant.messageStatus.success, detail: "Xóa phòng ban thành công" });
    }
    else {
      this.messageService.add({ severity: Constant.messageStatus.error, detail: "Phòng ban đang được sử dụng. Không thể xóa" });
    }
    this.bsModalRefDeleteCusDepartment.hide();
  }
  // End

  openModel(template: TemplateRef<any>, data: Customer = null) {
    if (data) {
      this.modalTitle = "Xem chi tiết";
      this.isNew = false;
      this.data = this.clone(data);
      if (this.data.startDate) this.data.startDate = new Date(this.data.startDate);
      if (this.data.endDate) this.data.endDate = new Date(this.data.endDate);
      this.selectedData = data;
      this.selectedPaymentType = data.paymentTypeId;
      this.selectedProvince = data.provinceId;
      this.selectedCustomerType = data.customerTypeId;
      this.selectedReceiverHub = this.data.hubId;
      this.txtEmailAddress = this.data.email;
      this.txtPhoneNumber = this.data.phoneNumber;
      this.customerCodeChange();
      this.loadDistrict(data.districtId);
      this.loadWard(data.districtId, data.wardId);
      this.searchParentCustomer(`XXX0000XXX`, this.data.parentCustomerId);
    } else {
      this.modalTitle = "Tạo mới";
      this.isNew = true;
      this.selectedPaymentType = null;
      this.selectedProvince = null;
      this.selectedDistrict = null;
      this.selectedWard = null;
      this.selectedCustomerType = null;
      this.selectedReceiverHub = null;
      this.salesUserSelected = null;
      this.supportUserSelected = null;
      this.accountingUserSelected = null;
      this.districts = [];
      this.wards = [];
      this.data = new Customer();
      this.data.vat = 0;
      this.data.commission = 0;
      this.data.discount = 0;
      this.selectedParentCustomer = null;
    }
    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-lg' });
    setTimeout(() => {
      this.initMapCusAddress();
    }, 1000);
  }

  openDeleteModel(template: TemplateRef<any>, data: Customer) {
    this.selectedData = data;
    this.data = this.clone(data);
    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-s' });
  }
  openAcceptModel(template: TemplateRef<any>, data: Customer) {
    this.selectedData = data;
    this.data = this.clone(data);
    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-s' });
  }

  refresh() {
    this.selectedIsAccept = null;
    this.txtSearch.nativeElement.value = "";
    this.initData();
  }

  save() {
    let list = [...this.listData];
    if (this.checkInfEmployee() == false) return;
    if (!this.selectedCustomerType) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Chưa chọn loại khách hàng" });
      return;
    }

    if (!this.data.code && this.isInputCustomerCode) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Chưa nhập mã khách hàng" });
      return;
    }

    if (!this.data.userName && this.isInputCustomerCode) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Chưa nhập tên đăng nhập" });
      return;
    }

    // if (!this.data.passWord) {
    //   this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Chưa nhập mật khẩu" });
    //   return;
    // }

    if (!this.data.companyName) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Chưa nhập tên cty" });
      return;
    }

    if (!this.data.addressCompany) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Chưa nhập địa chỉ công ty" });
      return;
    }

    if (!this.data.name) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Chưa nhập họ & tên - xử lý hàng" });
      return;
    }

    if (!this.txtEmailAddress) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Địa chỉ Email không được để trống" });
      return;
    }

    if (!this.txtPhoneNumber) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Số điện thoại không được để trống" });
      return;
    }

    if (!this.data.address) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Địa chỉ lấy hàng không được để trống" });
      return;
    }

    if (!this.selectedPaymentType) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Hình thức thanh toán không được để trống" });
      return;
    }

    if (!this.selectedProvince) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Chưa chọn tỉnh thành" });
      return;
    }

    if (!this.selectedDistrict) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Chưa chọn quận huyện" });
      return;
    }

    if (!this.selectedWard) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Chưa chọn phường xã" });
      return;
    }

    if (!this.selectedReceiverHub) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "TT/CN/T nhận không được để trống" });
      return;
    }

    if (!this.data.vseOracleCode) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Mã kết nối không được để trống" });
      return;
    }

    if (this.data.startDate) this.data.startDate = SearchDate.formatToISODate(this.data.startDate);
    if (this.data.endDate) this.data.endDate = SearchDate.formatToISODate(this.data.endDate);
    this.data.phoneNumber = this.txtPhoneNumber;
    this.data.email = this.txtEmailAddress;
    this.data.paymentTypeId = this.selectedPaymentType;
    this.data.provinceId = this.selectedProvince;
    this.data.districtId = this.selectedDistrict;
    this.data.wardId = this.selectedWard;
    this.data.customerTypeId = this.selectedCustomerType;
    this.data.hubId = this.selectedReceiverHub;
    this.data.priceListIds = [];
    this.data.isAccept = true;
    if (this.isNew) {
      this.customerService.create(this.data).subscribe(x => {
        if (!this.isValidResponse(x)) return;

        var obj = (x.data as Customer);
        this.mapSaveData(obj);
        list.push(this.data);
        this.datasource.push(this.data);
        this.saveClient(list);
      });
    }
    else {
      this.customerService.update(this.data).subscribe(x => {
        if (!this.isValidResponse(x)) return;

        var obj = (x.data as Customer);
        this.data.code = obj.code;
        this.mapSaveData(obj);
        list[this.findSelectedDataIndex()] = this.data;
        this.datasource[this.datasource.indexOf(this.selectedData)] = this.data;
        this.saveClient(list);
      });
    }
  }

  customerCodeChange() {
    if (this.isInputCustomerCode) {
      if (this.selectedCustomerType == CustomerTypeHelper.NV) this.customerCodeText = 'Mã nhân viên (*)';
      else this.customerCodeText = 'Mã khách hàng (*)';
    } else {
      if (this.selectedCustomerType == CustomerTypeHelper.NV) this.customerCodeText = 'Mã nhân viên ';
      else this.customerCodeText = 'Mã khách hàng';
      if (!this.data.id) {
        this.data.code = null;
        this.data.userName = null;
      }
    }
  }

  checkInfEmployee() {
    if (this.selectedCustomerType == CustomerTypeHelper.NV) {
      var customerCodeTxt = document.getElementById("customer_code") as HTMLInputElement;
      if (!this.data.code) {
        this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Vui lòng nhập mã nhân viên!` });
        customerCodeTxt.focus();
        customerCodeTxt.select();
        return false;
      }
      this.userService.getEmpByCodeAsync(this.data.code).then(
        x => {
          if (!this.isValidResponse(x)) {
            customerCodeTxt.focus();
            customerCodeTxt.select();
            return false;
          } else {
            if (x.data) return true;
            else {
              this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Thông tin nhân viên không hợp lệ!` });
              return false;
            }
          }
        }
      )
    }
  }

  mapSaveData(obj: Customer) {
    if (obj) {
      this.data.id = obj.id;
      this.data.code = obj.code;
      this.data.provinceId = obj.provinceId;
      this.data.districtId = obj.districtId;
      this.data.wardId = obj.wardId;
      this.data.customerTypeId = obj.customerTypeId;
      this.data.customerPriceList = obj.customerPriceList;
      this.data.concurrencyStamp = obj.concurrencyStamp;
      this.data.isShowPrice = obj.isShowPrice;
    }
  }

  delete() {
    this.customerService.delete(new BaseModel(this.data.id)).subscribe(x => {
      if (!this.isValidResponse(x)) return;
      let index = this.findSelectedDataIndex();
      this.datasource.splice(this.datasource.indexOf(this.selectedData), 1);
      this.saveClient(this.listData.filter((val, i) => i != index));
    });
  }

  saveClient(list: Customer[]) {
    this.messageService.add({ severity: Constant.messageStatus.success, detail: 'Cập nhật thành công' });
    this.listData = list;
    this.data = new Customer();
    this.selectedData = null;
    this.selectedProvince = null;
    this.selectedDistrict = null;
    this.selectedWard = null;
    //this.selectedPriceList = [];
    this.bsModalRef.hide();
  }

  clone(model: Customer): Customer {
    let data = new Customer();
    for (let prop in model) {
      data[prop] = model[prop];
    }
    return data;
  }

  findSelectedDataIndex(): number {
    return this.listData.indexOf(this.selectedData);
  }

  changeProvince() {
    this.loadDistrict();
  }

  changeFilter() {
    this.loadDataSource();
  }

  changeDistrict() {
    this.loadWard();
  }
  keyDownFunction(event) {
    if ((event.ctrlKey || event.metaKey) && event.which === KeyCodeUtil.charS) {
      this.save();
      event.preventDefault();
      return false;
    }
  }
  clickAccept(isAccept: boolean, data: Customer) {
    data.isAccept = isAccept;
    this.customerService.update(data).subscribe(x => {
      if (!this.isValidResponse(x)) return;
      let find = this.datasource.find(x => x.id == data.id);
      if (find) {
        find.isAccept = true;
        this.messageService.add({ severity: Constant.messageStatus.success, detail: "Đã xác nhận thành công." });
      } else {
        this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Xảy ra lỗi." });
      }
    });
    this.bsModalRef.hide();
    // this.initData();
  }
  changeIsAccept() {
    this.loadDataSource();
  }
  //========================================//
  public setAddressDepartment(place: google.maps.places.PlaceResult) {
    if (!place.geometry || !place.geometry) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Không tìm thấy địa chỉ" });
      return;
    }

    this.loadLocationPlaceDepartment(place);
    this.dataDepartment.address = place.formatted_address;
    this.dataDepartment.lat = place.geometry.location.lat();
    this.dataDepartment.lng = place.geometry.location.lng();
  }

  async loadLocationPlaceDepartment(place: google.maps.places.PlaceResult) {
    let provinceName = "";
    let districtName = "";
    let wardName = "";

    place.address_components.forEach(element => {
      if (element.types.indexOf(GMapHelper.ADMINISTRATIVE_AREA_LEVEL_1) !== -1) {
        provinceName = element.long_name;
      } else if (element.types.indexOf(GMapHelper.ADMINISTRATIVE_AREA_LEVEL_2) !== -1) {
        districtName = element.long_name;
      } else if (element.types.indexOf(GMapHelper.ADMINISTRATIVE_AREA_LEVEL_3) !== -1) {
        wardName = element.long_name;
      } else if (element.types.indexOf(GMapHelper.SUBLOCALITY_LEVEL_1) !== -1) {
        wardName = element.long_name;
      }
    });

    this.provinceService.getProvinceByName(provinceName).subscribe(
      pro => {
        if (!super.isValidResponse(pro)) return;
        let province = pro.data as Province;
        this.dataDepartment.provinceId = province.id

        this.districtService.getDistrictByName(districtName, province.id).subscribe(
          dist => {
            if (!super.isValidResponse(dist)) return;
            let district = dist.data as District;
            this.dataDepartment.districtId = district.id

            this.wardService.getWardByName(wardName, district.id).subscribe(
              war => {
                if (!super.isValidResponse(war)) return;
                let ward = war.data as Ward;
                this.dataDepartment.wardId = ward.id;

              } //End wardService
            );
          } //End districtService
        );
      } //End provinceService
    );
  }

  exportCSV() {
    this.mapDataExport();
  }


  mapDataExport() {
    let data: any[] = [];
    data.push([
      "Mã",
      "Tên",
      "Điện thoại",
      "Địa chỉ",
      "Hình thức thanh toán",
      "TT/CN/Trạm nhận",
      "Nhân viên kinh doanh",
      "Nhân viên cskh",
      "Nhân viên công nợ",
      "Mã kết nối"
    ]);

    this.datasource.map((cus) => {
      let ship = Object.assign({}, cus);
      data.push([
        cus.code,
        cus.name,
        cus.phoneNumber,
        cus.address,
        cus.paymentType ? cus.paymentType.name : "",
        cus.hub ? cus.hub.name : "",
        cus.salesUser ? cus.salesUser.fullName : "",
        cus.supportUser ? cus.supportUser.fullName : "",
        cus.accountingUser ? cus.accountingUser.fullName : "",
        cus.vseOracleCode
      ]);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    /* save to file */
    const wbout: string = XLSX.write(wb, this.wopts);
    saveAs(new Blob([this.s2ab(wbout)]), this.fileName);
  }

  s2ab(s: string): ArrayBuffer {
    const buf: ArrayBuffer = new ArrayBuffer(s.length);
    const view: Uint8Array = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  //======================================================================
  eventFilterSalesUsers(event) {
    let value = event.query;
    if (value.length >= 3) {
      this.userService.getSearchByValueAsync(value, this.data.salesUserId).then(
        x => {
          this.userSs = [];
          this.userSFilters = [];
          x.map(m => this.userSs.push({ value: m.id, label: `${m.code} ` + ` - ` + ` ${m.name}` }));
          this.userSs.map(m => this.userSFilters.push(m.label));
        }
      )
    }
  }
  eventOnSelectedSalesUser() {
    let findU = this.userSs.find(f => f.label == this.salesUserSelected)
    if (findU) {
      this.data.salesUserId = findU.value;
    } else {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Không tìm thấy nhân viên.` });
    }
  }

  eventFilterSupportUsers(event) {
    let value = event.query;
    if (value.length >= 3) {
      this.userService.getSearchByValueAsync(value, this.data.supportUserId).then(
        x => {
          this.userSPs = [];
          this.userSPFilters = [];
          x.map(m => this.userSPs.push({ value: m.id, label: `${m.code}` + ` - ` + `${m.name}` }));
          this.userSPs.map(m => this.userSPFilters.push(m.label));
        }
      )
    }
  }
  eventOnSelectedSupportUser() {
    let findU = this.userSPs.find(f => f.label == this.supportUserSelected)
    if (findU) {
      this.data.supportUserId = findU.value;
    } else {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Không tìm thấy nhân viên.` });
    }
  }

  eventFilterAccountingUsers(event) {
    let value = event.query;
    if (value.length >= 3) {
      this.userService.getSearchByValueAsync(value, this.data.accountingUserId).then(
        x => {
          this.userAccountings = [];
          this.userAccFilters = [];
          x.map(m => this.userAccountings.push({ value: m.id, label: `${m.code}` + ` - ` + `${m.name}` }));
          this.userAccountings.map(m => this.userAccFilters.push(m.label));
        }
      )
    }
  }
  eventOnSelectedAccountingUser() {
    let findU = this.userAccountings.find(f => f.label == this.accountingUserSelected)
    if (findU) {
      this.data.accountingUserId = findU.value;
    } else {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: `Không tìm thấy nhân viên.` });
    }
  }
}
