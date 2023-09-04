import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { Constant } from '../../infrastructure/constant';
import { CustomerComponent } from './customer/customer.component';
import { CustomerSettingComponent } from './customer/customer-setting.component';
//

const routes: Routes =  [
    { path: Constant.pages.customer.children.customer.alias, component: CustomerComponent },
    { path: Constant.pages.customer.children.customerSetting.alias, component: CustomerSettingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports:[RouterModule],
  declarations: []
})
export class CustomerManagementRoutingModule { }
