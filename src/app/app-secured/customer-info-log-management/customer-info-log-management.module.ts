import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TreeTableModule, DropdownModule, MultiSelectModule, CheckboxModule, AutoCompleteModule, CalendarModule, ProgressBarModule } from 'primeng/primeng';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomerService, UserService, HubService, ProvinceService, DistrictService, WardService } from '../../services';
import { SharedModule } from '../../shared/shared.module';
import { FocusModule } from 'angular2-focus';
import { TableModule } from 'primeng/table';
import { CustomerInfoLogManagementRoutingModule } from './customer-info-log-management.routing';
import { CreateReceiverExcelComponent } from './create-receiver-excel/create-receiver-excel.component';
import { UpdateReceiverExcelComponent } from './update-receiver-excel/update-receiver-excel.component';
import { ListReceiverComponent } from './list-receiver/list-receiver.component';
import { CustomerInfoLogService } from '../../services/customerInfoLog.service';

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CustomerInfoLogManagementRoutingModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    TreeTableModule,
    SharedModule,
    DropdownModule,
    MultiSelectModule,
    CheckboxModule,
    FocusModule.forRoot(),
    TableModule,
    AutoCompleteModule,
    ProgressBarModule,
    CalendarModule
  ],
  declarations: [CreateReceiverExcelComponent, UpdateReceiverExcelComponent, ListReceiverComponent],
  providers: [
    UserService,
    HubService,
    ProvinceService,
    DistrictService,
    WardService,
    CustomerService,
    CustomerInfoLogService
  ]
})
export class CustomerInfoLogManagementModule { }
