import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { CustomerManagementRoutingModule } from './customer-management.routing';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { TreeTableModule, DataTableModule, DropdownModule, MultiSelectModule, CheckboxModule, AutoCompleteModule, CalendarModule } from 'primeng/primeng';
import { NgSelectModule } from '@ng-select/ng-select';
//
import { CountryService, ProvinceService, DistrictService, WardService, DepartmentService, UserService, HubService, RequestShipmentService, ShipmentStatusService, ReasonService, ServiceService, PaymentTypeService, StructureService, PackTypeService, ServiceDVGTService, SizeService, CustomerService, PriceListService, FormPrintService, CustomerPaymentToService } from '../../services';
import { CustomerComponent } from './customer/customer.component';
import { SharedModule } from '../../shared/shared.module';
import { CustomerTypeService } from '../../services/customerType.service';
import { FocusModule } from 'angular2-focus';
import { TableModule } from 'primeng/table';
import { CusDepartmentService } from '../../services/cusDepartment.service';
import { GeocodingApiService } from '../../services/geocodingApiService.service';
import { CustomerSettingComponent } from './customer/customer-setting.component';
import { CustomerSettingService } from '../../services/customerSetting.service';

const DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: '',
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};
@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CustomerManagementRoutingModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    DropzoneModule.forRoot(DROPZONE_CONFIG),
    TreeTableModule,
    SharedModule,
    DataTableModule,
    DropdownModule,
    MultiSelectModule,
    CheckboxModule,
    FocusModule.forRoot(),
    TableModule,
    AutoCompleteModule,
    CalendarModule
  ],
  declarations: [
    CustomerComponent,
    CustomerSettingComponent
  ],
  entryComponents: [
  ],
  providers: [
    CountryService,
    ProvinceService,
    DistrictService,
    WardService,
    DepartmentService,
    UserService,
    HubService,
    RequestShipmentService,
    ReasonService,
    ShipmentStatusService,
    ServiceService,
    PaymentTypeService,
    StructureService,
    PackTypeService,
    ServiceDVGTService,
    ReasonService,
    SizeService,
    CustomerService,
    PriceListService,
    CustomerTypeService,
    CusDepartmentService,
    GeocodingApiService,
    FormPrintService,
    CustomerSettingService,
    CustomerPaymentToService,
  ]

})
export class CustomerManagementModule { }
