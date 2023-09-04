import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../shared/guard/auth.guard';
import { Constant } from '../infrastructure/constant';

//Component
import { AppSecuredComponent } from './app-secured.component'
import { WelcomeComponent } from './welcome/welcome.component'
import { ChangePassWordComponent } from './change-password/change-password.component';

const appRoutes: Routes = [
  { path: '', component: AppSecuredComponent, canActivate: [AuthGuard],  canActivateChild: [AuthGuard], children: [
      { path: '', component: WelcomeComponent },
      { path: Constant.pages.changePassWord.alias, component: ChangePassWordComponent },
      {
        path: Constant.pages.customer.alias, loadChildren: Constant.pages.customer.loadChildren
      },
      {
        path: Constant.pages.receiver.alias, loadChildren: Constant.pages.receiver.loadChildren
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [ RouterModule ],
  declarations: [],
})
export class AppSecuredRoutingModule { }
