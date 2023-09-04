import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from './layout/layout.module';
import { AppSecuredRoutingModule } from './app-secured-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SimpleTimer } from 'ng2-simple-timer';
import { SharedModule } from '../shared/shared.module';
import { AutoCompleteModule, DataTableModule, RadioButtonModule } from 'primeng/primeng';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
//
import { AppSecuredComponent } from './app-secured.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ChangePassWordComponent } from './change-password/change-password.component';
import { UserService, AuthService, ShipmentService, RequestShipmentService } from '../services/index';
import { AgmCoreModule } from '@agm/core';
import { ShipmentDetailComponent } from './shipment-detail/shipment-detail.component';
import { FocusModule } from 'angular2-focus';
import { GeocodingApiService } from '../services/geocodingApiService.service';
import { HttpModule } from '@angular/http';

@NgModule({
  imports: [
    AgmCoreModule.forRoot({
      //flashship
      //apiKey: "AIzaSyDvWH7xuK-S8BhTKBYd61E2RsCvyyxHkSs",
      //vietstart
      //apiKey: "AIzaSyCVfrBxAaDm3MWP69i4tfAjbvWBRlSh0gY",
      //tasetco
      apiKey: "AIzaSyBwjHPz6q5c0lNukX_9q_UXD3SiviB8cOU",
      libraries: ["places"],
      language: 'vi',
      region: 'VN',
    }),
    HttpModule,
    CommonModule,
    AppSecuredRoutingModule,
    LayoutModule,
    ModalModule.forRoot(),
    FormsModule,
    TabsModule.forRoot(),
    SharedModule,
    AutoCompleteModule,
    NgxDatatableModule,
    DataTableModule,
    RadioButtonModule,
    FocusModule.forRoot(),
    HttpModule,
  ],
  declarations: [
    AppSecuredComponent, 
    WelcomeComponent,
    ChangePassWordComponent,
    ShipmentDetailComponent,
  ],
  providers: [
    SimpleTimer,
    UserService,
    AuthService,
    ShipmentService,
    RequestShipmentService,
    GeocodingApiService
  ],
  entryComponents: [
    ShipmentDetailComponent,
  ],
  exports: [
  ],
})
export class AppSecuredModule { }
