export const Constant = {
    messageStatus: {
        success: "success",
        info: "info",
        warn: "warn",
        error: "error",
    },
    response: {
        isSuccess: "isSuccess",
        message: "message",
        data: "data",
        exception: "exception",
    },
    auths: {
        isLoginIn: 'crm-loggedIn',
        token: 'crm-token',
        userId: 'crm-userId',
        userName: 'crm-userName',
        currentUser: 'crm-currentUser',
        fullName: 'crm-fullName'
    },
    classes: {
        includes: {
            province: {
                country: "Country",
            },
            district: {
                province: "Province",
            },
            ward: {
                district: "District",
            },
            hub: {
                district: "District",
                ward: "Ward",
                centerHub: "CenterHub",
                poHub: "PoHub",
            },
            user: {
                department: "Department",
                role: "Role",
                hub: "Hub",
            },
            shipment: {
                sender: "Sender",
                service: "Service",
                fromHub: "FromHub",
                toHub: "ToHub",
                fromHubRouting: "FromHubRouting",
                toHubRouting: "ToHubRouting",
                fromWard: "FromWard",
                fromDistrict: "FromWard.District",
                fromProvince: "FromWard.District.Province",
                toWard: "ToWard",
                toDistrict: "ToWard.District",
                toProvince: "ToWard.District.Province",
                shipmentStatus: "ShipmentStatus",
                package: "Package",
                pickUser: "PickUser",
                deliverUser: "DeliverUser",
                transferUser: "TransferUser",
                returnUser: "ReturnUser",
                transferReturnUser: "TransferReturnUser",
                receiveHub: "ReceiveHub",
                currentHub: "CurrentHub",
                currentEmp: "CurrentEmp",
                paymentType: "PaymentType",
                serviceDVGT: "ServiceDVGT",
                weight: "Weight",
            },
            customer: {
                province: "Province",
                district: "District",
                ward: "Ward",
                customerPriceList: "CustomerPriceList",
                hub: "Hub",
                accountingUser: "AccountingUser",
                salesUser: "SalesUser",
                supportUser: "SupportUser",
                paymentType: "PaymentType",
                paymentToCustomer: "PaymentToCustomer"
            },
            serviceDVGTPrice: {
                formula: "Formula",
                serviceDVGT: "ServiceDVGT",
            },
            priceServiceDetail: {
                priceService: "PriceService",
                area: "Area",
                weight: "Weight",
            },
            priceService: {
                priceList: "PriceList",
                service: "Service",
                areaGroup: "AreaGroup",
                weightGroup: "WeightGroup",
            },
            priceList: {
                hub: "Hub"
            },
            weight: {
                formula: "Formula",
                weightGroup: "WeightGroup",
            },
            areaGroup: {
                hub: "Hub",
            },
            area: {
                areaGroup: "AreaGroup",
                province: "Province",
                district: "District",
            },
            customerPriceList: {
                priceList: "PriceList",
            }
        },
    },
    pages: {
        login: {
            name: 'Đăng nhập',
            alias: 'dang-nhap',
            hidden: true,
        },
        page404: {
            name: 'Không tìm thấy trang',
            alias: '404',
        },
        page403: {
            name: 'Không có quyền truy cập',
            alias: '403',
        },
        changePassWord: {
            name: 'Thay đổi mật khẩu',
            alias: 'thay-doi-mat-khau',
        },
        customer: {
            name: 'Quản lý khách hàng',
            alias: 'quan-ly-khach-hang',
            loadChildren: './customer-management/customer-management.module#CustomerManagementModule',
            children: {
                customer: {
                    name: 'Khách hàng',
                    alias: 'khach-hang',
                },
                customerSetting: {
                    name: 'Cài đặt',
                    alias: 'cai-dat',
                },
            }
        },
        receiver: {
            name: "Quản lý người nhận",
            alias: "quan-ly-nguoi-nhan",
            loadChildren: './customer-info-log-management/customer-info-log-management.module#CustomerInfoLogManagementModule',
            children: {
                createReceiver: {
                    name: "Tạo người nhận excel",
                    alias: "tao-nguoi-nhan-excel",
                },
                updateReceiver: {
                    name: "Sửa người nhận excel",
                    alias: "sua-nguoi-nhan-excel",
                },
                listReceiver: {
                    name: "Danh sách người nhận",
                    alias: "danh-sach-nguoi-nhan",
                },
            }
        },
    }
};
