admin.controller("xacnhanDonHangController", ['$scope', '$http', '$cookies', '$window', '$location', function ($scope, $http, $cookies, $window, $location) {
    //---VAR---
    $scope.currentUser = {};
    //ChotDonHang
    $scope.chotDonHangs = [];
    $scope.chotDonHang = {};
    $scope.selectedChotDonHangs = [];
    var apiChotDonHang = "/API/ChotDonHangAPI";
    //Đơn hàng chưa chốt
    $scope.donhangChuaChots = [];
    $scope.donhangChuaChot = {};
    $scope.selectedDonHangChuaChots = [];
    //Đơn hàng chốt
    $scope.donhangChots = [];
    $scope.donhangChot = {};
    $scope.selectedDonHangChots = [];
    //Tỉnh - Thành phố
    $scope.tinhthanhphos = [];
    var apiTinhThanhPho = "/API/TinhThanhPhoAPI";
    //Khách hàng
    $scope.khachhangs = [];
    var apiKhachHang = "/API/KhachHangAPI";
    //Nhân viên
    $scope.nhanviens = [];
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
    //Trạng thái xác nhận
    $scope.trangthaiXacNhanDons = [
        {
            value: "CHUAXACNHAN",
            text: "Chưa xác nhận"
        },
        {
            value: "DAXACNHAN",
            text: "Đã xác nhận"
        }
    ];

    //---POPUP---
    //ChotDonHang
    //modify
    $scope.postChotDonHang = false;
    $scope.modifyChotDonHang = false;
    $scope.titlePopupModifyChotDonHang = "Chi tiết chốt đơn hàng";
    $scope.popupModifyChotDonHang = {
        width: "auto",
        height: "auto",
        contentTemplate: "templateModifyChotDonHang",
        showTitle: true,
        resizeEnabled: true,
        fullScreen: true,
        bindingOptions: {
            title: "titlePopupModifyChotDonHang",
            visible: "modifyChotDonHang",
        }
    };
    $scope.controlModifyChotDonHang = {
        //TextBox
        //TextArea
        //DateBox
        thoigianChotDonHang: {
            type: "datetime",
            applyButtonText: "Xong",
            cancelButtonText: "Hủy",
            displayFormat: "dd/MM/yyyy HH:mm",
            bindingOptions: {
                value: "chotDonHang.ThoiGianChotDonHang"
            }
        },
        thoigianXacNhanDonHang: {
            type: "datetime",
            applyButtonText: "Xong",
            cancelButtonText: "Hủy",
            displayFormat: "dd/MM/yyyy HH:mm",
            bindingOptions: {
                value: "chotDonHang.ThoiGianXacNhanDonHang"
            }
        },
        ngay: {
            type: "date",
            displayFormat: "dd/MM/yyyy",
            bindingOptions: {
                value: "chotDonHang.Ngay"
            }
        },
        //SelectBox
        trangthaiChotDon: {
            displayExpr: "text",
            valueExpr: "value",
            searchEnabled: true,
            noDataText: "Không có dữ liệu",
            placeholder: "Chọn ...",
            bindingOptions: {
                items: "trangthaiChotDons",
                value: "chotDonHang.TrangThaiChotDonHang"
            }
        },
        trangthaiXacNhanDon: {
            displayExpr: "text",
            valueExpr: "value",
            searchEnabled: true,
            noDataText: "Không có dữ liệu",
            placeholder: "Chọn ...",
            bindingOptions: {
                items: "trangthaiXacNhanDons",
                value: "chotDonHang.TrangThaiXacNhanDonHang"
            }
        }
    }
    //delete
    $scope.deleteChotDonHang = false;
    $scope.titleDeleteChotDonHang = "Bạn có chắc chắn muốn xóa?";
    $scope.popupDeleteChotDonHang = {
        width: "auto",
        height: "auto",
        contentTemplate: "templateDeleteChotDonHang",
        showTitle: false,
        bindingOptions: {
            visible: "deleteChotDonHang",
        }
    };
    //xác nhận đơn hàng
    $scope.xacnhanDonHang = false;
    $scope.titleXacNhanDonHang = "Bạn có chắc chắn muốn XÁC NHẬN?";
    $scope.popupXacNhanDonHang = {
        width: "auto",
        height: "auto",
        contentTemplate: "templateXacNhanDonHang",
        showTitle: false,
        bindingOptions: {
            visible: "xacnhanDonHang",
        }
    };
    //hủy xác nhận đơn hàng
    $scope.huyXacNhanDonHang = false;
    $scope.titleHuyXacNhanDonHang = "Bạn có chắc chắn muốn HỦY XÁC NHẬN?";
    $scope.popupHuyXacNhanDonHang = {
        width: "auto",
        height: "auto",
        contentTemplate: "templateHuyXacNhanDonHang",
        showTitle: false,
        bindingOptions: {
            visible: "huyXacNhanDonHang",
        }
    };

    //---CONTROL CONFIG---

    //---LIST---
    //ChotDonHangs
    $scope.gridChotDonHangs = {
        bindingOptions: {
            dataSource: 'chotDonHangs',
            'columns[1].lookup.dataSource': 'khachhangs',
            'columns[3].lookup.dataSource': 'trangthaiXacNhanDons',
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
                caption: "ID",
                dataField: "ChotDonHang_ID",
                dataType: "string"
            },
            {//1
                caption: "Khách hàng",
                dataField: "KhachHang_ID",
                lookup: {
                    displayExpr: 'KhachHang_Name',
                    valueExpr: 'KhachHang_ID'
                },
                allowFiltering: false
            },
            {//2
                alignment: "left",
                caption: "Thời gian chốt đơn",
                dataField: "ThoiGianChotDonHang",
                dataType: "date",
                format: "dd/MM/yyyy HH:mm",
                customizeText: function (cellInfo) {
                    return cellInfo.valueText;
                }
            },
            {//3
                caption: "Trạng thái xác nhận",
                dataField: "TrangThaiXacNhanDonHang",
                lookup: {
                    displayExpr: 'text',
                    valueExpr: 'value'
                },
                allowFiltering: false
            },
            {//4
                alignment: "left",
                caption: "Thời gian xác nhận",
                dataField: "ThoiGianXacNhanDonHang",
                dataType: "date",
                format: "dd/MM/yyyy HH:mm",
                customizeText: function (cellInfo) {
                    return cellInfo.valueText;
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
            fileName: "Danh sách Chốt đơn",
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
                    column: "ChotDonHang_ID",
                    summaryType: "count"
                }
            ],
            totalItems: [
                {
                    column: "ChotDonHang_ID",
                    summaryType: "count"
                }
            ]
        },
        wordWrapEnabled: false,
        //METHOD
        //Toolbar
        onToolbarPreparing: function (e) {
            var dataGrid = e.component;

            e.toolbarOptions.items.unshift(
                {//Xác nhận
                    location: "after",
                    widget: "dxButton",
                    options: {
                        hint: "Xác nhận",
                        icon: "check",
                        type: "success",
                        onClick: function () {
                            $scope.XacNhanDonHang();
                        }
                    }
                },
                {//Hủy xác nhận
                    location: "after",
                    widget: "dxButton",
                    options: {
                        hint: "Hủy xác nhận",
                        icon: "clear",
                        type: "danger",
                        onClick: function () {
                            $scope.HuyXacNhanDonHang();
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
                            GetChotDonHangDaChotByDonVi();
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
                    $scope.chotDonHang = angular.copy(e.data);
                    $scope.EditChotDonHang();
                }

                // Reset your click info
                component.clickCount = 0;
                component.lastClickTime = 0;
            }
        },
        //Select Row
        onSelectionChanged: function (e) {
            $scope.selectedChotDonHangs = angular.copy(e.selectedRowsData);
        }
    };
    //Đơn hàng chốt
    $scope.gridDonHangChots = {
        bindingOptions: {
            dataSource: 'donhangChots',
            //'columns[1].lookup.dataSource': 'trangthaiChotDons',
            //'columns[5].lookup.dataSource': 'tinhthanhphos',
            //'columns[10].lookup.dataSource': 'nhanviens',
            //'columns[11].lookup.dataSource': 'nhanviens',
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
        //columns: [
        //    {//0
        //        alignment: "left",
        //        allowEditing: false,
        //        caption: "Số hiệu",
        //        dataField: "SoHieu",
        //        dataType: "string"
        //    },
        //    {//1
        //        caption: "Trạng thái",
        //        dataField: "TrangThai",
        //        lookup: {
        //            displayExpr: 'text',
        //            valueExpr: 'value'
        //        },
        //        allowFiltering: false,
        //        visible: false
        //    },
        //    {//2
        //        alignment: "left",
        //        caption: "Người nhận",
        //        dataField: "NguoiNhan",
        //        dataType: "string"
        //    },
        //    {//3
        //        alignment: "left",
        //        caption: "SĐT người nhận",
        //        dataField: "SoDienThoaiNguoiNhan",
        //        dataType: "string"
        //    },
        //    {//4
        //        alignment: "left",
        //        caption: "Địa chỉ người nhận",
        //        dataField: "DiaChiNguoiNhan",
        //        dataType: "string"
        //    },
        //    {//5
        //        caption: "Tỉnh - Thành phố",
        //        dataField: "TinhThanhPho_ID",
        //        lookup: {
        //            displayExpr: 'TinhThanhPho_Name',
        //            valueExpr: 'TinhThanhPho_ID'
        //        }
        //    },
        //    {//6
        //        alignment: "right",
        //        caption: "Số tiền thu hộ",
        //        dataField: "SoTienThuHo",
        //        format: {
        //            type: "fixedPoint",
        //            precision: 0
        //        }
        //    },
        //    {//7
        //        alignment: "left",
        //        caption: "Loại hàng",
        //        dataField: "LoaiHang_Name",
        //        dataType: "string"
        //    },
        //    {//8
        //        alignment: "right",
        //        caption: "Số lượng",
        //        dataField: "SoLuong",
        //        format: {
        //            type: "fixedPoint",
        //            precision: 0
        //        }
        //    },
        //    {//9
        //        alignment: "left",
        //        caption: "Thời gian tạo đơn",
        //        dataField: "ThoiGianTaoDonHang",
        //        dataType: "date",
        //        format: "dd/MM/yyyy HH:mm",
        //        customizeText: function (cellInfo) {
        //            return cellInfo.valueText;
        //        }
        //    },
        //    {//10
        //        caption: "Nhân viên tạo",
        //        dataField: "NhanVien_ID",
        //        lookup: {
        //            displayExpr: 'TenNguoiDung',
        //            valueExpr: 'Id'
        //        }
        //    },
        //    {//11
        //        caption: "SĐT nhân viên",
        //        dataField: "NhanVien_ID",
        //        lookup: {
        //            displayExpr: 'PhoneNumber',
        //            valueExpr: 'Id'
        //        }
        //    },
        //],
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
            fileName: "Đơn hàng đã chốt",
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
            emptyPanelText: "Đơn hàng chưa chốt",
            visible: true
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
            //texts: {
            //    count: "{0}",
            //    sum: "{0}"
            //},
            //groupItems: [
            //    {
            //        column: "SoHieu",
            //        summaryType: "count"
            //    }
            //],
            //totalItems: [
            //    {
            //        column: "SoHieu",
            //        summaryType: "count"
            //    }
            //]
        },
        wordWrapEnabled: false,
    };

    //---CONTEXTMENU---


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
                            case 'nhanvien':
                                $window.location.href = "/DonHang/QuanLyDonHang";
                                break;
                            default:
                        }

                        //Get đơn hàng đã chốt theo đơn vị
                        GetChotDonHangDaChotByDonVi();
                        //GetAll Tỉnh - Thành phố
                        GetAllTinhThanhPho();
                        //GetAll khách hàng theo đơn vị
                        GetKhachHangByDonVi();

                    }, function error(response) {
                        toastr.error("Không lấy được quyền ChotDonHang");
                    });
            }, function error(response) {
                toastr.error("Không lấy được thông tin ChotDonHang");
            });
    }

    //---ChotDonHang---
    //GetChotDonHangDaChotByDonVi
    function GetChotDonHangDaChotByDonVi() {
        $http.get('/API/ChotDonHangAPI?att=DaChotTheoDonVi&&value=' + $scope.currentUser.DonVi_ID)
            .then(function success(response) {
                $scope.chotDonHangs = angular.copy(response.data);
            }, function error(response) {
                toastr.error("Không lấy được danh sách đơn hàng");
            });
    }

    //Show chốt đơn hàng
    $scope.EditChotDonHang = function () {
        if ($scope.selectedChotDonHangs.length == 0) {
            toastr.error("Chọn 1 dòng để xem");
        } else {
            //Lấy dòng đầu tiên trong số dòng được chọn
            $scope.chotDonHang = angular.copy($scope.selectedChotDonHangs[0]);

            //Get Đơn hàng chưa chốt
            GetDonHangChuaChot();
            //Get đơn hàng trong phiếu chốt
            GetChiTietChot();

            $scope.titlePopupModifyChotDonHang = "Thông tin phiếu chốt đơn hàng";
            $scope.modifyChotDonHang = true;
        }
    }

    //Xác nhận đơn hàng
    $scope.XacNhanDonHang = function () {
        //Kiểm tra số lượng dòng chọn
        if ($scope.selectedChotDonHangs.length == 0) {
            toastr.error("Chọn dòng để XÁC NHẬN");
        } else {
            $scope.xacnhanDonHang = true;
        }
    }
    $scope.ConfirmXacNhanDonHang = function () {
        var listId = "";
        angular.forEach($scope.selectedChotDonHangs, function (value, index) {
            listId += value.ChotDonHang_ID + ",";
        });

        $http.get('/DonHang/XacNhanChotDonHang/' + listId)
            .then(function success(response) {
                if (response.data == 1) {
                    toastr.success("XÁC NHẬN thành công");
                    GetChotDonHangDaChotByDonVi();
                    $scope.modifyChotDonHang = false;
                } else {
                    toastr.error("XÁC NHẬN không thành công");
                }
            }, function error(response) {
                toastr.error("XÁC NHẬN không thành công");
            });

        $scope.xacnhanDonHang = false;
    };
    $scope.CancelXacNhanDonHang = function () {
        $scope.xacnhanDonHang = false;
    };

    //Hủy nhận đơn hàng
    $scope.HuyXacNhanDonHang = function () {
        //Kiểm tra số lượng dòng chọn
        if ($scope.selectedChotDonHangs.length == 0) {
            toastr.error("Chọn dòng để HỦY XÁC NHẬN");
        } else {
            $scope.huyXacNhanDonHang = true;
        }
    }
    $scope.ConfirmHuyXacNhanDonHang = function () {
        var listId = "";
        angular.forEach($scope.selectedChotDonHangs, function (value, index) {
            listId += value.ChotDonHang_ID + ",";
        });

        $http.get('/DonHang/HuyXacNhanChotDonHang/' + listId)
            .then(function success(response) {
                if (response.data == 1) {
                    toastr.success("HỦY XÁC NHẬN thành công");
                    GetChotDonHangDaChotByDonVi();
                    $scope.modifyChotDonHang = false;
                } else {
                    toastr.error("HỦY XÁC NHẬN không thành công");
                }
            }, function error(response) {
                toastr.error("HỦY XÁC NHẬN không thành công");
            });

        $scope.huyXacNhanDonHang = false;
    };
    $scope.CancelHuyXacNhanDonHang = function () {
        $scope.huyXacNhanDonHang = false;
    };

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

    //Khách hàng
    //GetKhachHangByDonVi
    function GetKhachHangByDonVi() {
        $http.get(apiKhachHang + "?att=DonVi&&value=" + $scope.currentUser.DonVi_ID)
            .then(function success(response) {
                $scope.khachhangs = angular.copy(response.data);
            }, function error(response) {
                toastr.error("Không lấy được danh sách Khách hàng");
            });
    }

    //Get Đơn hàng chưa chốt
    function GetDonHangChuaChot() {
        $http.get('/APi/DonHangAPI?att=KhachHang&&value=' + $scope.chotDonHang.KhachHang_ID + "&&status=ChuaChot")
            .then(function success(response) {
                $scope.donhangChuaChots = angular.copy(response.data);
            }, function error(response) {
                toastr.error("Không lấy được đơn chưa chốt");
            });
    }
    //Get hóa đơn của phiếu chốt
    function GetChiTietChot() {
        $http.get('/DonHang/GetChiTietByPhieuChotForExport/' + $scope.chotDonHang.ChotDonHang_ID)
            .then(function success(response) {
                $scope.donhangChots = angular.copy(response.data);
                GetAccountNhanVienByKhachHang();
            }, function error(response) {
                toastr.error("Không lấy được chi tiết phiếu chốt");
            });
    }
    //Get nhân viên theo khách hàng
    function GetAccountNhanVienByKhachHang() {
        $http.get('/Account/GetNhanVienChotDonByKhachHang/' + $scope.chotDonHang.KhachHang_ID)
            .then(
            function success(response) {
                $scope.nhanviens = angular.copy(response.data);
            },
            function error(response) {
                toastr.error("Không lấy được danh sách Nhân viên");
            }
            );
    }


}]);