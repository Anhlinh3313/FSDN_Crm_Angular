import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { SelectItem } from 'primeng/primeng';
import { ShipmentDetailComponent } from '../../shipment-detail/shipment-detail.component';
import { BaseComponent } from '../../../shared/components/baseComponent';
import { MessageService } from 'primeng/components/common/messageservice';
import { ShipmentService, RequestShipmentService } from '../../../services/index';
import { Shipment } from '../../../models/shipment.model';
import { Constant } from '../../../infrastructure/constant';
import { PermissionService } from '../../../services/permission.service';
import { Router } from '@angular/router';
// import { ShipmentDetailComponent } from '../../shipment-detail/shipment-detail.component';


@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styles: []
})

export class HeaderComponent extends BaseComponent implements OnInit {

  phoneModal: BsModalRef;
  gbModelRef: BsModalRef;
  searchShipmentNumberGB: string;
  userFullName: string = "";

  constructor(private authService: AuthService, private modalService: BsModalService, protected messageService: MessageService,
    private shipmentService: ShipmentService,
    private requestShipmentService: RequestShipmentService,
    public permissionService: PermissionService,
    public router: Router
  ) {
    super(messageService, permissionService, router);
  }

  ngOnInit() {
    this.userFullName = this.authService.getFullName();
  }

  public phoneNumber: string;

  public logOut() {
    this.authService.logout();
  }

  onEnterSearchGB(template) {
    this.gbModelRef = this.modalService.show(ShipmentDetailComponent, { class: 'inmodal animated bounceInRight modal-lg' });
    let includes = [
      Constant.classes.includes.shipment.fromHub,
      Constant.classes.includes.shipment.toHub,
      Constant.classes.includes.shipment.fromWard,
      Constant.classes.includes.shipment.fromDistrict,
      Constant.classes.includes.shipment.fromProvince,
      Constant.classes.includes.shipment.fromHub,
      Constant.classes.includes.shipment.toWard,
      Constant.classes.includes.shipment.toDistrict,
      Constant.classes.includes.shipment.toProvince,
      Constant.classes.includes.shipment.shipmentStatus,
      Constant.classes.includes.shipment.paymentType,
      Constant.classes.includes.shipment.service,
      Constant.classes.includes.shipment.serviceDVGT,
    ];

    this.shipmentService.trackingShort(this.searchShipmentNumberGB.trim(), includes).subscribe(
      x => {
        if (!super.isValidResponse(x)) return;
        this.gbModelRef.content.loadData(x.data as Shipment);
        this.searchShipmentNumberGB = null;
      }
    );
  }
}
