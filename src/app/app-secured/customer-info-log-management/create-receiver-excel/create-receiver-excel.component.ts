import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../shared/components/baseComponent';
import { Router } from '@angular/router';
import { PermissionService } from '../../../services/permission.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { Constant } from '../../../infrastructure/constant';
import { Message } from 'primeng/components/common/message';
import * as XLSX from 'xlsx';
import { CustomerInfoLog } from '../../../models/customerInfoLog.model';
import { StringHelper } from '../../../infrastructure/string.helper';
import { CustomerService, HubService } from '../../../services';
import { InputValue } from '../../../infrastructure/inputValue.helper';
import { CustomerInfoLogService } from '../../../services/customerInfoLog.service';

type AOA = Array<Array<any>>;
@Component({
  selector: 'app-create-receiver-excel',
  templateUrl: './create-receiver-excel.component.html',
})
export class CreateReceiverExcelComponent extends BaseComponent implements OnInit {
  listCustomerImport: string[] = [];
  customerInfoLogs: CustomerInfoLog[] = [];
  columns: ColumnExcel[] = [];
  columnNameExcel: ColumnNameExcel = new ColumnNameExcel();
  columnsName: string[] = [];
  datas: AOA = [];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'binary' };
  fileName: string = 'SimpleExcel.xlsx';
  @ViewChild("myInputFiles") myInputFilesVariable: any;
  isUpload: boolean = false;
  targetDataTransfer: DataTransfer;
  value: number = 0;
  //

  parentPage: string = Constant.pages.receiver.name;
  currentPage: string = Constant.pages.receiver.children.createReceiver.name;
  msgWarn: string;

  constructor(
    private customerInfoLogService: CustomerInfoLogService,
    private hubService: HubService,
    private customerService: CustomerService,
    protected messageService: MessageService,
    protected permissionService: PermissionService,
    protected router: Router
  ) {
    super(messageService, permissionService, router);
  }

  ngOnInit() {
    this.declareColumn();
    this.loadData();
  }

  declareColumn() {
    this.columnsName = [
      this.columnNameExcel.senderCode,
      this.columnNameExcel.code,
      this.columnNameExcel.companyName,
      this.columnNameExcel.name,
      this.columnNameExcel.phoneNumber,
      this.columnNameExcel.address,
      this.columnNameExcel.provinceName,
      this.columnNameExcel.districtName,
      this.columnNameExcel.wardName
    ];

    this.columns = [];
    this.columnsName.forEach(element => {
      let columnExcel: ColumnExcel = new ColumnExcel();
      columnExcel.Name = element; columnExcel.Index = -1;
      this.columns.push(columnExcel);
    });
  }

  loadData() { }

  onFileChange(evt: any) {

    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.targetDataTransfer = target;

    if (!this.isValidChangeFile()) return;

    //
    this.isUpload = true;
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      /* save data */
      this.datas = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      this.value += 10;
      this.setDataNew();
    };
    reader.readAsBinaryString(target.files[0]);
  }

  async setDataNew() {
    let check: boolean = true;
    this.customerInfoLogs = [];

    if (!this.datas || (this.datas && this.datas.length == 0)) {
      check = false;
      this.messageService.add({
        severity: Constant.messageStatus.warn,
        detail: "Không tìm thấy dữ liệu upload, vui lòng kiểm tra lại!"
      });
      return;
    }

    if (!this.isValidChangeFile()) return;
    const firstRows = this.datas[0] as string[];
    for (let i = 1; i < firstRows.length; i++) {
      const check = this.columns.find(f => f.Name == firstRows[i]);
      if (check) {
        check.Index = i;
      }
    }
    if (this.columns.find(f => f.Index == -1)) {
      const notFoudColumns = this.columns.find(f => f.Index == -1);
      check = false;
      this.messageService.add({
        severity: Constant.messageStatus.error, detail: "File thiếu colum: " + notFoudColumns.Name + ", vui lòng kiểm tra lại: "
      });
      this.isUpload = false;
      return;
    }

    // lấy ra mã khách hàng gửi
    this.datas.map((x, i) => {
      if (i >= 1) {
        const rows = this.datas[i] as string[];
        rows.map(async (cell, j) => {
          const column: any = this.columns.find(f => f.Index === j);
          if (column) {
            if (column.Name === this.columnNameExcel.senderCode) {
              if (!StringHelper.isNullOrEmpty(cell)) {
                this.listCustomerImport = this.listCustomerImport.concat(cell.trim());
              }
            }
          }
        });
      }
    });

    // customer
    let cloneCustomers = [];
    cloneCustomers = [...this.listCustomerImport];
    let customers = [];
    cloneCustomers = Array.from(new Set(cloneCustomers));
    cloneCustomers = cloneCustomers.sort().filter((x, i, arr) => arr[i] != arr[i + 1]);
    customers = await this.customerService.getByListCodeAsync(cloneCustomers);
    this.value = 15;

    await Promise.all(await this.datas.map(async (rows: string[], i) => {
      if (i >= 1) {
        let cusInfoLog = new CustomerInfoLog();
        this.customerInfoLogs = this.customerInfoLogs.concat(cusInfoLog);
        cusInfoLog.key = i - 1;

        await Promise.all(await rows.map(async (cell, j) => {
          const column = this.columns.find(f => f.Index == j);
          if (column) {
            if (column.Name == this.columnNameExcel.senderCode) {
              cusInfoLog.senderCode = !StringHelper.isNullOrEmpty(cell) ? cell.trim() : null;
              const customer = customers.find(f => f.code.toLowerCase() === this.toLowerCase(cusInfoLog.senderCode));
              if (customer) {
                cusInfoLog.senderId = customer.id;
              }
            } else if (column.Name == this.columnNameExcel.code) {
              cusInfoLog.code = !StringHelper.isNullOrEmpty(cell) ? cell.trim() : null;
            } else if (column.Name == this.columnNameExcel.code) {
              cusInfoLog.code = !StringHelper.isNullOrEmpty(cell) ? cell.trim() : null;
            } else if (column.Name == this.columnNameExcel.name) {
              cusInfoLog.name = !StringHelper.isNullOrEmpty(cell) ? cell.trim() : null;
            } else if (column.Name == this.columnNameExcel.companyName) {
              cusInfoLog.companyName = !StringHelper.isNullOrEmpty(cell) ? cell.trim() : null;
            } else if (column.Name == this.columnNameExcel.phoneNumber) {
              cusInfoLog.phoneNumber = !StringHelper.isNullOrEmpty(cell) ? cell.trim() : null;
            } else if (column.Name == this.columnNameExcel.address) {
              cusInfoLog.address = !StringHelper.isNullOrEmpty(cell) ? cell.trim() : null;
            } else if (column.Name == this.columnNameExcel.provinceName) {
              cusInfoLog.provinceName = !StringHelper.isNullOrEmpty(cell) ? cell.trim() : null;
            } else if (column.Name == this.columnNameExcel.districtName) {
              cusInfoLog.districtName = !StringHelper.isNullOrEmpty(cell) ? cell.trim() : null;
            } else if (column.Name == this.columnNameExcel.wardName) {
              cusInfoLog.wardName = !StringHelper.isNullOrEmpty(cell) ? cell.trim() : null;
            }
          }
        }));
        // lấy ra mã tỉnh thành, quận huyện, phường xã
        cusInfoLog = await this.setToAddress(cusInfoLog.key, cusInfoLog);
        this.value = 60 + (Math.round(((i + 1) / this.datas.length) * 20));
      }
    }));

    // kiểm tra lỗi
    setTimeout(() => {
      this.isValidToCreate(this.customerInfoLogs);
      this.value = 100;
      this.isUpload = false;
    }, this.datas.length * 300);
  }

  async uploadExcelNew() {
    this.msgWarn = null;
    this.messageService.clear();
    this.value = 0;
    this.isUpload = true;

    if (this.customerInfoLogs.length == 0) {
      this.messageService.add({
        severity: Constant.messageStatus.warn,
        detail: ("Danh sách trống."),
      });
      this.isUpload = false;
      return;
    }

    if (this.customerInfoLogs.find(f => f.isValid == false)) {
      this.msgWarn = "Nhập excel sai, vui lòng kiểu tra lại các dòng có bao viền đỏ!";
      this.orderBy();
      this.messageService.add({
        severity: Constant.messageStatus.warn,
        detail: ("Danh sách có khách hàng nhận lỗi."),
      });
      this.isUpload = false;
      return false;
    }

    this.msgWarn = null;
    this.customerInfoLogs = (this.customerInfoLogs || []).sort((a: CustomerInfoLog, b: CustomerInfoLog) => a.key < b.key ? -1 : 1);

    // tạo
    let rs = await this.customerInfoLogService.createImportExcelAsync(this.customerInfoLogs);
    this.value = 100;
    if (!this.isValidResponse(rs)) {
      this.msgWarn = rs.message;
      this.isUpload = false;
      return;
    }

    if (rs.isSuccess) {
      this.messageService.add({
        severity: Constant.messageStatus.success,
        detail: `Tạo thành công ${this.customerInfoLogs.length} KH nhận`,
      });
      this.clearData();
    }
  }

  async setToAddress(key: Number, cus: CustomerInfoLog) {
    if (cus) {
      await this.hubService.getInfoLocation(cus.provinceName, cus.districtName, cus.wardName, null, null, null, null).subscribe(
        res => {
          if (!this.isValidResponse(res)) return;
          const data = res.data;
          if (data) {
            if (data.provinceId) cus.provinceId = data.provinceId;
            if (data.districtId) cus.districtId = data.districtId;
            if (data.wardId) cus.wardId = data.wardId;
          }
        }
      );
    }

    return cus;
  }

  isValidChangeFile(): boolean {
    let result: boolean = true;
    let messages: Message[] = [];

    if (!this.targetDataTransfer || this.myInputFilesVariable.nativeElement.value === "") {
      this.messageService.add({
        severity: Constant.messageStatus.warn, detail: "Vui lòng chọn file upload."
      });
      result = false;
    }
    if (this.targetDataTransfer && this.targetDataTransfer.files.length > 1) {
      this.messageService.add({
        severity: Constant.messageStatus.warn, detail: "Không thể upload nhiều file cùng lúc"
      });
      this.myInputFilesVariable.nativeElement.value = "";
      result = false;
    }

    if (messages.length > 0) {
      this.messageService.addAll(messages);
    }
    return result;
  }

  isValidToCreate(cusInfos: CustomerInfoLog[]) {
    let row = 0;
    cusInfos.map(async cusInfo => {
      row++;
      this.isValidCusInfoLog(cusInfo, row);
    });
  }

  isValidCusInfoLog(cusInfoLog: CustomerInfoLog, row: Number) {
    let result: boolean = true;
    let messages: Message[] = [];
    let errors: string = "";
    // check up trùng mã khách nhận trong ds của excel
    if (!StringHelper.isNullOrEmpty(cusInfoLog.code)) {
      const arrCodes: string[] = this.customerInfoLogs.map(x => x.code);
      const countDuplicates: number = InputValue.getCountDuplicates(arrCodes, cusInfoLog.code);
      if (countDuplicates > 1) {
        let message = "Trùng mã KH nhận " + cusInfoLog.code;
        messages.push({
          severity: Constant.messageStatus.warn,
          detail: row + ": " + message
        });
        result = false;
        errors += message + ", ";
      }
    }

    if (!cusInfoLog.senderId) {
      let message = "Không tìm thấy mã KH gửi";
      messages.push({
        severity: Constant.messageStatus.warn,
        detail: row + ": " + message
      });
      result = false;
      errors += message + ", ";
    }

    if (StringHelper.isNullOrEmpty(cusInfoLog.code)) {
      let message = "Chưa nhập mã KH nhận";
      messages.push({
        severity: Constant.messageStatus.warn,
        detail: row + ": " + message
      });
      result = false;
      errors += message + ", ";
    }

    if (StringHelper.isNullOrEmpty(cusInfoLog.name)) {
      let message = "Chưa nhập tên KH nhận";
      messages.push({
        severity: Constant.messageStatus.warn,
        detail: row + ": " + message
      });
      result = false;
      errors += message + ", ";
    }

    // if (StringHelper.isNullOrEmpty(cusInfoLog.companyName)) {
    //   let message = "Chưa nhập tên công ty KH nhận";
    //   messages.push({
    //     severity: Constant.messageStatus.warn,
    //     detail: row + ": " + message
    //   });
    //   result = false;
    //   errors += message + ", ";
    // }

    if (StringHelper.isNullOrEmpty(cusInfoLog.phoneNumber)) {
      let message = "Chưa nhập số đt KH nhận";
      messages.push({
        severity: Constant.messageStatus.warn,
        detail: row + ": " + message
      });
      result = false;
      errors += message + ", ";
    }

    if (StringHelper.isNullOrEmpty(cusInfoLog.address)) {
      let message = "Chưa nhập địa chỉ KH nhận";
      messages.push({
        severity: Constant.messageStatus.warn,
        detail: row + ": " + message
      });
      result = false;
      errors += message + ", ";
    }

    if (!cusInfoLog.provinceId) {
      let message = "Không tìm thấy tỉnh thành";
      messages.push({
        severity: Constant.messageStatus.warn,
        detail: row + ": " + message
      });
      result = false;
      errors += message + ", ";
    }

    if (!cusInfoLog.districtId) {
      let message = "Không tìm thấy quận huyện";
      messages.push({
        severity: Constant.messageStatus.warn,
        detail: row + ": " + message
      });
      result = false;
      errors += message + ", ";
    }

    cusInfoLog.message = errors;
    if (messages.length > 0 || result !== true) {
      cusInfoLog.isValid = false;
    } else {
      cusInfoLog.isValid = true;
    }
  }

  toLowerCase(str: string = "") {
    return str.toLowerCase().trim();
  }

  orderBy() {
    let cusInfoError: CustomerInfoLog[] = [];
    let cusInfoSuccess: CustomerInfoLog[] = [];
    this.customerInfoLogs.forEach(element => {
      if (element.isValid === true) {
        cusInfoSuccess.push(element);
      } else {
        cusInfoError.push(element);
      }
    });
    this.customerInfoLogs = [];
    this.customerInfoLogs = cusInfoError.concat(cusInfoSuccess);
  }

  clearData() {
    this.value = 0;
    this.datas = [];
    this.customerInfoLogs = [];
    this.myInputFilesVariable.nativeElement.value = "";

    this.isUpload = false;
    this.listCustomerImport = [];
    this.msgWarn = null;
    this.isUpload = false;
    this.declareColumn();
  }

}

export class ColumnExcel {
  Name: string;
  Index: number;
}

export class ColumnNameExcel {
  stt?: string = "STT";
  senderCode: string = "SenderCode";
  code: string = "Code";
  companyName: string = "CompanyName";
  name: string = "Name";
  phoneNumber: string = "PhoneNumber";
  address: string = "Address";
  provinceName: string = "ProvinceName";
  districtName: string = "DistrictName";
  wardName?: string = "WardName";
}