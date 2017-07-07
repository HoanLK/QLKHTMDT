admin.controller("quanlyDonHangController", ['$scope', '$http', '$cookies', '$window', '$location', function ($scope, $http, $cookies, $window, $location) {
    //---VAR---
    $scope.currentUser = {};
    //DonHang
    $scope.donhangs = [];
    $scope.donhang = {};
    $scope.selectedDonHangs = [];
    $scope.filterDonHang = {
        TrangThai: "CHUACHOT"
    };
    var apiDonHang = "/API/DonHangAPI";
    //Tỉnh - Thành phố
    $scope.tinhthanhphos = [];
    var apiTinhThanhPho = "/API/TinhThanhPhoAPI";
    //Loại hàng
    $scope.loaihangs = [];
    //Dịch vụ
    $scope.dichvus = [];
    $scope.dichvu = {};
    var apiDichVu = "/API/DichVuAPI"
    //Trạng thái chốt đơn
    $scope.trangthaiChotDons = [
        {
            value: "CHUACHOT",
            text: "Chưa chốt"
        },
        {
            value: "DACHOT",
            text: "Đã chốt"
        }
    ];
    //---POPUP---
    //DonHang
    //modify
    $scope.postDonHang = false;
    $scope.modifyDonHang = false;
    $scope.titlePopupModifyDonHang = "Thêm đơn hàng";
    $scope.popupModifyDonHang = {
        width: "auto",
        height: "auto",
        contentTemplate: "templateModifyDonHang",
        showTitle: true,
        resizeEnabled: true,
        bindingOptions: {
            title: "titlePopupModifyDonHang",
            visible: "modifyDonHang",
        }
    };
    $scope.controlModifyDonHang = {
        //TextBox
        soHieu: {
            showClearButton: true,
            valueChangeEvent: "keyup",
            bindingOptions: {
                value: "donhang.SoHieu"
            },
            readOnly: true
        },
        nguoiNhan: {
            showClearButton: true,
            valueChangeEvent: "keyup",
            bindingOptions: {
                value: "donhang.NguoiNhan"
            }
        },
        diachiNguoiNhan: {
            showClearButton: true,
            valueChangeEvent: "keyup",
            bindingOptions: {
                value: "donhang.DiaChiNguoiNhan"
            }
        },
        sdtNguoiNhan: {
            showClearButton: true,
            valueChangeEvent: "keyup",
            bindingOptions: {
                value: "donhang.SoDienThoaiNguoiNhan"
            }
        },
        noidungHang: {
            showClearButton: true,
            valueChangeEvent: "keyup",
            bindingOptions: {
                value: "donhang.NoiDungHang"
            }
        },
        //NumberBox
        soluong: {
            showSpinButtons: true,
            showClearButton: true,
            min: 0,
            invalidValueMesseage: "Vui lòng nhập số",
            bindingOptions: {
                value: "donhang.SoLuong"
            }
        },
        //TextArea
        //DateBox
        thoigianTaoDonHang: {
            type: "datetime",
            applyButtonText: "Xong",
            cancelButtonText: "Hủy",
            displayFormat: "dd/MM/yyyy HH:mm",
            readOnly: true,
            bindingOptions: {
                value: "donhang.ThoiGianTaoDonHang"
            }
        },
        ngay: {
            type: "date",
            displayFormat: "dd/MM/yyyy",
            bindingOptions: {
                value: "donhang.Ngay"
            }
        },
        //SelectBox
        tinhthanhpho: {
            displayExpr: "TinhThanhPho_Name",
            valueExpr: "TinhThanhPho_ID",
            searchEnabled: true,
            noDataText: "Không có dữ liệu",
            placeholder: "Chọn ...",
            bindingOptions: {
                items: "tinhthanhphos",
                value: "donhang.TinhThanhPho_ID"
            }
        },
        dichvu: {
            displayExpr: "DichVu_Name",
            valueExpr: "DichVu_ID",
            searchEnabled: true,
            noDataText: "Không có dữ liệu",
            placeholder: "Chọn ...",
            bindingOptions: {
                items: "dichvus",
                value: "donhang.DichVu_ID",
                disabled: "!postDonHang"
            },
            onSelectionChanged: function (e) {
                if ($scope.postDonHang == true) {
                    $scope.donhang.DichVu_ID = e.selectedItem.DichVu_ID;
                    GetSoHieuChuaCapByDichVu($scope.donhang.DichVu_ID);
                }
            }
        },
        //AutoComplete
        loaiHang: {
            placeholder: "Loại hàng ...",
            //onValueChanged: function (data) {
            //    $scope.donhang.LoaiHang_Name = data.value;
            //},
            bindingOptions: {
                dataSource: "loaihangs",
                value: "donhang.LoaiHang_Name"
            }
        }
        //Button
    }
    //delete
    $scope.deleteDonHang = false;
    $scope.titleDeleteDonHang = "Bạn có chắc chắn muốn xóa?";
    $scope.popupDeleteDonHang = {
        width: "auto",
        height: "auto",
        contentTemplate: "templateDeleteDonHang",
        showTitle: false,
        bindingOptions: {
            visible: "deleteDonHang",
        }
    };

    //---CONTROL CONFIG---

    //---LIST---
    //DonHangs
    $scope.gridDonHangs = {
        bindingOptions: {
            dataSource: 'donhangs',
            'columns[4].lookup.dataSource': 'tinhthanhphos',
            'columns[9].lookup.dataSource': 'trangthaiChotDons',
            'columns[10].lookup.dataSource': 'dichvus',
        },
        allowColumnResizing: true,
        columnAutoWidth: true,
        columnChooser: {
            emptyPanelText: "Kéo và thả cột muốn ẩn vào đây",
            enabled: true,
            mode: "select",
            title: "Lựa chọn cột"
        },
        columnFixing: {
            enabled: true,
            texts: {
                fix: "Cố định cột",
                leftPosition: "Bên trái",
                rightPosition: "Bên phải",
                unfix: "Hủy cố định"
            }
        },
        columns: [
            {//0
                alignment: "left",
                allowEditing: false,
                caption: "Số hiệu",
                dataField: "SoHieu",
                dataType: "string"
            },
            {//1
                alignment: "left",
                caption: "Người nhận",
                dataField: "NguoiNhan",
                dataType: "string"
            },
            {//2
                alignment: "left",
                caption: "SĐT người nhận",
                dataField: "SoDienThoaiNguoiNhan",
                dataType: "string"
            },
            {//3
                alignment: "left",
                caption: "Địa chỉ người nhận",
                dataField: "DiaChiNguoiNhan",
                dataType: "string"
            },
            {//4
                caption: "Tỉnh - Thành phố",
                dataField: "TinhThanhPho_ID",
                lookup: {
                    displayExpr: 'TinhThanhPho_Name',
                    valueExpr: 'TinhThanhPho_ID'
                }
            },
            {//5
                alignment: "right",
                caption: "Số tiền thu hộ",
                dataField: "SoTienThuHo",
                format: {
                    type: "fixedPoint",
                    precision: 0
                }
            },
            {//6
                alignment: "left",
                caption: "Nội dung hàng",
                dataField: "LoaiHang_Name",
                dataType: "string"
            },
            {//7
                alignment: "right",
                caption: "Số lượng",
                dataField: "SoLuong",
                format: {
                    type: "fixedPoint",
                    precision: 0
                }
            },
            {//8
                alignment: "left",
                caption: "Thời gian tạo đơn",
                dataField: "ThoiGianTaoDonHang",
                dataType: "date",
                format: "dd/MM/yyyy HH:mm",
                customizeText: function (cellInfo) {
                    return cellInfo.valueText;
                }
            },
            {//9
                caption: "Trạng thái",
                dataField: "TrangThai",
                lookup: {
                    displayExpr: 'text',
                    valueExpr: 'value'
                },
                allowFiltering: false
            },
            {//10
                caption: "Dịch vụ",
                dataField: "DichVu_ID",
                lookup: {
                    displayExpr: 'DichVu_Name',
                    valueExpr: 'DichVu_ID'
                }
            },
        ],
        columnResizingMode: "widget",
        editing: {
            mode: "cell",
            allowAdding: false,
            allowDeleting: false,
            allowUpdating: false,
            texts: {
                addRow: "Thêm",
                cancelAllChanges: "Không thay đổi",
                cancelRowChanges: "Hủy",
                confirmDeleteMessage: "Bạn có chắc chắn muốn xóa?",
                deleteRow: "Xóa",
                editRow: "Sửa",
                saveAllChanges: "Lưu thay đổi",
                saveRowChanges: "Lưu",
                undeleteRow: "Không xóa",
                validationCancelChanges: "Hủy thay đổi"
            }
        },
        export: {
            allowExportSelectedData: true,
            enabled: true,
            excelFilterEnabled: true,
            excelWrapTextEnabled: true,
            fileName: "Danh sách Đơn hàng",
            texts: {
                exportAll: "Xuất toàn bộ Dữ liệu",
                exportSelectedRows: "Xuất dữ liệu đang chọn",
                exportTo: "Trích xuất"
            }
        },
        filterRow: {
            applyFilterText: "Áp dụng bộ lọc",
            betweenEndText: "Kết thúc",
            betweenStartText: "Bắt đầu",
            resetOperationText: "Thiết lập lại",
            showAllText: "(Tất cả)",
            visible: true
        },
        grouping: {
            contextMenuEnabled: true,
            expandMode: "rowClick",
            texts: {
                groupByThisColumn: "Nhóm theo Cột này",
                groupContinuedMessage: "Tiếp tục từ trang trước",
                groupContinuesMessage: "Tiếp tục trên các trang tiếp theo",
                ungroup: "Bỏ nhóm",
                ungroupAll: "Bỏ tất cả nhóm"
            }
        },
        groupPanel: {
            emptyPanelText: "Kéo một cột vào đây để nhóm theo cột đó",
            visible: false
        },
        headerFilter: {
            texts: {
                cancel: "Hủy",
                emptyValue: "(Trống)",
                ok: "Đồng ý"
            },
            visible: true
        },
        hoverStateEnabled: true,
        loadPanel: {
            enabled: true,
            text: "Đang tải ..."
        },
        noDataText: "Không có dữ liệu",
        pager: {
            infoText: "Trang {0} của {1}",
            showInfo: true,
            showNavigationButtons: true,
            showPageSizeSelector: true,
            visible: true
        },
        paging: {
            enabled: true,
            pageIndex: 0,
            pageSize: 50
        },
        remoteOperations: {
            grouping: false,
            summary: false
        },
        rowAlternationEnabled: false,
        scrolling: {
            preloadEnabled: true
        },
        searchPanel: {
            placeholder: "Tìm kiếm ..."
        },
        selection: {
            mode: "multiple",
            showCheckBoxesMode: "onClick"
        },
        showBorders: true,
        showRowLines: true,
        sorting: {
            ascendingText: "Sắp xếp Tăng dần",
            clearText: "Xóa Sắp xếp",
            descendingText: "Sắp xếp Giảm dần"
        },
        summary: {
            texts: {
                count: "{0}",
                sum: "{0}"
            },
            groupItems: [
                {
                    column: "SoHieu",
                    summaryType: "count"
                }
            ],
            totalItems: [
                {
                    column: "SoHieu",
                    summaryType: "count"
                }
            ]
        },
        wordWrapEnabled: false,
        /*onCellPrepared: function (e) {
            if (e.rowType === "data" & e.column.command === 'select' && e.data.TrangThai == "DACHOT") {
                e.cellElement.find('.dx-select-checkbox').hide();
                e.cellElement.off();
            }
        },*/
        //METHOD
        //Toolbar
        onToolbarPreparing: function (e) {
            var dataGrid = e.component;

            e.toolbarOptions.items.unshift(
                {//Lọc trạng thái
                    location: "before",
                    widget: "dxSelectBox",
                    options: {
                        width: 200,
                        items: [
                            {
                                value: "ALL",
                                text: "Tất cả"
                            },
                            {
                                value: "CHUACHOT",
                                text: "Chưa chốt"
                            },
                            {
                                value: "DACHOT",
                                text: "Đã chốt"
                            }
                        ],
                        displayExpr: "text",
                        valueExpr: "value",
                        bindingOptions: {
                            value: "filterDonHang.TrangThai",
                        },
                        onValueChanged: function (e) {
                            GetDonHangByNhanVien();
                        }
                    }
                },
                {//Thêm
                    location: "after",
                    widget: "dxButton",
                    options: {
                        hint: "Thêm",
                        icon: "add",
                        type: "success",
                        onClick: function () {
                            $scope.AddDonHang();
                        }
                    }
                },
                {//Sửa
                    location: "after",
                    widget: "dxButton",
                    options: {
                        hint: "Sửa",
                        icon: "edit",
                        type: "default",
                        onClick: function () {
                            $scope.EditDonHang();
                        }
                    }
                },
                {//Xóa
                    location: "after",
                    widget: "dxButton",
                    options: {
                        hint: "Xóa",
                        icon: "trash",
                        type: "danger",
                        onClick: function () {
                            $scope.DeleteDonHang();
                        }
                    }
                },
                {//Load lại
                    location: "after",
                    widget: "dxButton",
                    options: {
                        hint: "Load lại Dữ liệu",
                        icon: "refresh",
                        onClick: function () {
                            GetDonHangByNhanVien();
                        }
                    }
                }
            )
        },
        //DoubleClick Row
        onRowClick: function (e) {
            var component = e.component;
            if (!component.clickCount)
                component.clickCount = 1;
            else
                component.clickCount = component.clickCount + 1;
            if (component.clickCount == 1) {
                component.lastClickTime = new Date();
                setTimeout(function () { component.lastClickTime = 0; component.clickCount = 0; }, 350);
            }
            else if (component.clickCount == 2) {
                if (((new Date()) - component.lastClickTime) < 300) {
                    $scope.donhang = angular.copy(e.data);
                    $scope.EditDonHang();
                }

                // Reset your click info
                component.clickCount = 0;
                component.lastClickTime = 0;
            }
        },
        //Select Row
        onSelectionChanged: function (e) {
            $scope.selectedDonHangs = angular.copy(e.selectedRowsData);
        }
    };

    //---CONTEXTMENU---
    var itemContextMenus = [
        { value: 'add', text: ' Thêm', icon: 'fa fa-plus' },
        { value: 'edit', text: ' Sửa', icon: 'fa fa-pencil' },
        { value: 'delete', text: ' Xóa', icon: 'fa fa-times' }
    ];
    //DonHang
    $scope.contextMenuDonHangs = {
        dataSource: itemContextMenus,
        width: 100,
        target: '#donhang',
        itemTemplate: function (itemData, itemIndex, itemElement) {
            var template = $('<div></div>');
            if (itemData.icon) {
                template.append('<span class="' + itemData.icon + '"><span>');
            }
            template.append(itemData.text);
            return template;
        },
        onItemClick: function (e) {
            if (!e.itemData.items) {
                switch (e.itemData.value) {
                    case "add":
                        $scope.AddDonHang();
                        break;
                    case "edit":
                        $scope.EditDonHang();
                        break;
                    case "delete":
                        $scope.DeleteDonHang();
                        break;
                }
            }
        }
    };

    Init();

    //---FUNCTION---
    function Init() {
        //Get Current User
        //Get idUser from view Layout
        var idUser = angular.element("#idUser").val();
        //Get info user
        $http.get('/API/AccountAPI/' + idUser)
            .then(function success(response) {
                $scope.currentUser = {
                    Id: response.data.Id,
                    UserName: response.data.UserName,
                    Email: response.data.Email,
                    TenNguoiDung: response.data.TenNguoiDung,
                    PhoneNumber: response.data.PhoneNumber,
                    DonVi_ID: response.data.DonVi_ID,
                    Fax: response.data.Fax,
                    KhachHang_ID: response.data.KhachHang_ID,
                    PhoneNumber: response.data.PhoneNumber,
                };
                //Get role user
                $http.get('/Account/GetRoleByAccount/' + $scope.currentUser.Id)
                    .then(function success(response) {
                        $scope.currentUser.Role = response.data;

                        //Chuyển hướng người dùng
                        switch ($scope.currentUser.Role) {
                            case 'khachhang':
                                $window.location.href = "/DonHang/ChotDonHang";
                                break;
                            case 'nhanvienbuudien':
                                $window.location.href = "/DonHang/XacNhanDonHang";
                                break;
                            default:
                        }

                        //Get danh sách đơn hàng
                        GetDonHangByNhanVien();
                        //GetAll Tỉnh - Thành phố
                        GetAllTinhThanhPho();
                        //GetAll Loại hàng
                        GetAllLoaiHang();
                        //GetAll Dịch vụ
                        GetAllDichVu();


                    }, function error(response) {
                        toastr.error("Không lấy được quyền Người dùng");
                    });
            }, function error(response) {
                toastr.error("Không lấy được thông tin Người dùng");
            });
    }

    //---DonHang---
    /**
     * GetDonHangByNhanVien
     * Trả lại danh sách đơn hàng theo Khách hàng và Trạng thái
     */
    function GetDonHangByNhanVien() {
        $http.get('/API/DonHangAPI?att=NhanVien&&value=' + $scope.currentUser.Id + '&&status=' + $scope.filterDonHang.TrangThai)
            .then(function success(response) {
                $scope.donhangs = angular.copy(response.data);
            }, function error(response) {
                toastr.error("Không lấy được danh sách đơn hàng");
            });
    }

    //AddDonHang
    $scope.AddDonHang = function () {
        //Thiết lập giá trị Default cho đơn hàng
        $scope.donhang = {
            DichVu_ID: "E",
            Ngay: new Date(),
            ThoiGianTaoDonHang: new Date(),
            TrangThai: 'CHUACHOT',
            KhachHang_ID: $scope.currentUser.KhachHang_ID,
            NhanVien_ID: $scope.currentUser.Id,
            SoLuong: 1,
            SoTienThuHo: 0
        };

        GetSoHieuChuaCapByDichVu($scope.donhang.DichVu_ID);

        //GetAllLoaiHang
        GetAllLoaiHang();

        $scope.modifyDonHang = true;
        $scope.postDonHang = true;
    }

    //Edit
    $scope.EditDonHang = function () {
        //Kiểm tra đã chọn dòng để sửa chưa
        if ($scope.selectedDonHangs.length == 0) {
            toastr.error("Chọn 1 dòng để sửa");
        }
        else {
            //Lấy dòng đầu tiên trong số dòng được chọn
            $scope.donhang = angular.copy($scope.selectedDonHangs[0]);

            //Kiểm tra trạng thái của đơn hàng
            if ($scope.donhang.TrangThai == "DACHOT") {
                toastr.error("Đơn hàng ĐÃ CHỐT");
            } else {

                $scope.controlModifyDonHang.dichvu.disabled = true;

                $scope.titlePopupModifyDonHang = "Sửa đơn hàng";
                $scope.modifyDonHang = true;
            }
        }
    }

    //Save
    $scope.SaveDonHang = function (e) {
        //Thêm
        if ($scope.postDonHang == true) {
            //Tăng 7 tiếng theo múi giờ
            $scope.donhang.Ngay.setTime($scope.donhang.Ngay.getTime() + 7 * 60 * 60 * 1000);
            $scope.donhang.ThoiGianTaoDonHang.setTime($scope.donhang.ThoiGianTaoDonHang.getTime() + 7 * 60 * 60 * 1000);

            //Lưu đơn hàng
            $http.post(apiDonHang, $scope.donhang)
                .then(function success(response) {
                    $http.get(apiDonHang + '/' + response.data.SoHieu)
                        .then(function success(response) {
                            //Thêm đơn hàng vào danh sách
                            $scope.donhangs.unshift(response.data);

                            toastr.success("Thành công", "Thêm");
                            $scope.modifyDonHang = false;
                            $scope.postDonHang = false;
                        }, function error(response) {
                            toastr.error("Thất bại", "Thêm");
                        });
                }, function error(response) {
                    toastr.error("Thất bại", "Thêm");
                }
            );
        }
        //Sửa
        else {
            $http.put(apiDonHang + "/" + $scope.donhang.SoHieu, $scope.donhang)
                .then(function success(response) {
                    angular.forEach($scope.donhangs, function (value, index) {
                        if (value.SoHieu == $scope.donhang.SoHieu) {
                            $scope.donhangs[index] = angular.copy($scope.donhang);
                            toastr.success("Thành công", "Sửa");
                            $scope.modifyDonHang = false;
                        }
                    });
                }, function error(response) {
                    toastr.error("Thất bại", "Sửa");
                });
        }
    };
    $scope.CancelSaveDonHang = function () {
        $scope.modifyDonHang = false;
    }

    //Delete
    $scope.DeleteDonHang = function() {
        if ($scope.selectedDonHangs.length == 0) {
            toastr.error("Chọn dòng để xóa");
        } else {
            var deleteable = true;
            angular.forEach($scope.selectedDonHangs, function (value, index) {
                if (value.TrangThai == "DACHOT") {
                    deleteable = false;
                }
            });
            if (deleteable == true) {
                $scope.deleteDonHang = true;
            } else {
                toastr.error("Có đơn hàng ĐÃ CHỐT");
            }
        }
    }
    $scope.ConfirmDeleteDonHang = function () {
        var listId = "";
        angular.forEach($scope.selectedDonHangs, function (value, index) {
            listId += value.SoHieu + ",";
        });

        $http.get('/DonHang/XoaDonHang/' + listId)
            .then(function success(response) {
                if (response.data == 1) {
                    toastr.success("Xóa thành công");
                    GetDonHangByNhanVien();
                } else {
                    toastr.error("Xóa không thành công");
                }
            }, function error(response) {
                toastr.error("Xóa không thành công");
            });
        
        $scope.deleteDonHang = false;
    };
    $scope.CancelDeleteDonHang = function () {
        $scope.deleteDonHang = false;
    };

    //Kho số
    //GetSoHieuChuaCapByDichVu
    function GetSoHieuChuaCapByDichVu(id) {
        $http.get('/KhoSo/GetSoHieuChuaCapByDichVu/' + id)
            .then(function success(response) {
                if (response.data != null && response.data != "") {
                    //Thiết lập giá trị Default cho đơn hàng
                    $scope.donhang.SoHieu = response.data.SoHieu;
                } else {
                    $scope.donhang.SoHieu = "";
                    alert("Kho số đã hết vui lòng liên hệ với quản lý Bưu điện");
                }

            }, function error(response) {
                $scope.donhang.SoHieu = "";
                toastr.error("Không lấy được Số hiệu");
            });
    }

    //Loại hàng
    //GetAllLoaiHang
    function GetAllLoaiHang() {
        $http.get('/LoaiHang/GetListName')
            .then(function success(response) {
                $scope.loaihangs = angular.copy(response.data);
            }, function error(response) {
                toastr.error("Không lấy được danh sách Loại hàng");
            });
    }

    //---Tỉnh - Thành phố---
    //GetAllTinhThanhPho
    function GetAllTinhThanhPho() {
        $http.get(apiTinhThanhPho)
            .then(function success(response) {
                $scope.tinhthanhphos = angular.copy(response.data);
            }, function error(response) {
                toastr.error("Không lấy được danh sách Tỉnh - Thành phố");
            });
    }

    //GetAllDichVu
    function GetAllDichVu() {
        $http.get(apiDichVu)
            .then(function success(response) {
                $scope.dichvus = angular.copy(response.data);
            }, function error(response) {
                toastr.error("Không lấy được danh sách dịch vụ");
            });
    }

}]);