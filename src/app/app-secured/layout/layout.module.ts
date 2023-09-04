import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HeaderComponent } from './header/header.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { SharedSecuredModule } from '../shared/shared-secured.module';

import { PopoverModule } from 'ngx-bootstrap/popover';
import { DropdownModule } from 'primeng/primeng';
import { PageService, CustomerService } from '../../services/index';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedSecuredModule,
    PopoverModule.forRoot(),
    DropdownModule
  ],
  declarations: [
    FooterComponent,
    NavigationComponent,
    HeaderComponent,
    RightSidebarComponent,
    ChatBoxComponent,
  ],
  providers: [
    PageService,
    CustomerService
  ],
  exports:  [
    FooterComponent,
    NavigationComponent,
    HeaderComponent,
    RightSidebarComponent,
    ChatBoxComponent
  ]
})

export class LayoutModule { }
