import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { Constant } from "../../infrastructure/constant";
import { CreateReceiverExcelComponent } from "./create-receiver-excel/create-receiver-excel.component";
import { UpdateReceiverExcelComponent } from "./update-receiver-excel/update-receiver-excel.component";
import { ListReceiverComponent } from "./list-receiver/list-receiver.component";

const routes: Routes =  [
    { path: Constant.pages.receiver.children.createReceiver.alias, component: CreateReceiverExcelComponent },
    { path: Constant.pages.receiver.children.updateReceiver.alias, component: UpdateReceiverExcelComponent },
    { path: Constant.pages.receiver.children.listReceiver.alias, component: ListReceiverComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports:[RouterModule],
  declarations: []
})
export class CustomerInfoLogManagementRoutingModule { }
