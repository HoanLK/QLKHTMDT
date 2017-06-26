admin.controller("chotDonHangController", ['$scope', '$http', '$cookies', '$window', '$location', function ($scope, $http, $cookies, $window, $location) {
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
    //create
    $scope.createChotDonHang = false;
    $scope.popupCreateChotDonHang = {
        width: "auto",
        height: "auto",
        contentTemplate: "templateCreateChotDonHang",
        showTitle: true,
        resizeEnabled: true,
        fullScreen: false,
        title: "Chốt đơn hàng",
        bindingOptions: {
            visible: "createChotDonHang",
        }
    };
    //modify
    $scope.postChotDonHang = false;
    $scope.modifyChotDonHang = false;
    $scope.titlePopupModifyChotDonHang = "Chốt đơn hàng";
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

    //---CONTROL CONFIG---

    //---LIST---
    //ChotDonHangs
    $scope.gridChotDonHangs = {
        bindingOptions: {
            dataSource: 'chotDonHangs',
            'columns[1].lookup.dataSource': 'trangthaiChotDons',
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
                caption: "Trạng thái chốt đơn",
                dataField: "TrangThaiChotDonHang",
                lookup: {
                    displayExpr: 'text',
                    valueExpr: 'value'
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
                {//Thêm
                    location: "after",
                    widget: "dxButton",
                    options: {
                        hint: "Thêm",
                        icon: "add",
                        type: "success",
                        onClick: function () {
                            $scope.AddChotDonHang();
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
                            $scope.EditChotDonHang();
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
                            $scope.DeleteChotDonHang();
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
                            GetChotDonHangByKhachHang();
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
    //Đơn hàng chưa chốt
    $scope.gridDonHangChuaChots = {
        bindingOptions: {
            dataSource: 'donhangChuaChots',
            'columns[4].lookup.dataSource': 'tinhthanhphos',
        },
        allowColumnResizing: true,
        columnAutoWidth: true,
        columnChooser: {
            emptyPanelText: "Kéo và thả cột muốn ẩn vào đây",
            enabled: false,
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
                caption: "Nội dung",
                dataField: "NoiDungHang",
                dataType: "string"
            },
            {//7
                alignment: "left",
                caption: "Trạng thái",
                dataField: "TrangThai",
                dataType: "string"
            },
            {//8
                alignment: "left",
                caption: "Thời gian tạo đơn",
                dataField: "ThoiGianTaoDonHang",
                dataType: "date",
                format: "dd/MM/yyyy hh:mm",
                customizeText: function (cellInfo) {
                    return cellInfo.valueText;
                }
            }
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
            enabled: false,
            excelFilterEnabled: true,
            excelWrapTextEnabled: true,
            fileName: "Đơn hàng chưa chốt",
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
        //METHOD
        //Toolbar
        onToolbarPreparing: function (e) {
            var dataGrid = e.component;
            e.toolbarOptions.items.unshift(
                {//Load lại
                    location: "after",
                    widget: "dxButton",
                    options: {
                        hint: "Chốt đơn",
                        icon: "arrowright",
                        onClick: function () {
                            $scope.ThemDonHangChots();
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
                    $scope.donhangChuaChot = angular.copy(e.data);
                    $scope.ThemDonHangChot();
                }

                // Reset your click info
                component.clickCount = 0;
                component.lastClickTime = 0;
            }
        },
        //Select Row
        onSelectionChanged: function (e) {
            $scope.selectedDonHangChuaChots = angular.copy(e.selectedRowsData);
        }
    };
    //Đơn hàng chốt
    $scope.gridDonHangChots = {
        bindingOptions: {
            dataSource: 'donhangChots',
            'columns[4].lookup.dataSource': 'tinhthanhphos',
        },
        allowColumnResizing: true,
        columnAutoWidth: true,
        columnChooser: {
            emptyPanelText: "Kéo và thả cột muốn ẩn vào đây",
            enabled: false,
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
                caption: "Nội dung",
                dataField: "NoiDungHang",
                dataType: "string"
            },
            {//7
                alignment: "left",
                caption: "Trạng thái",
                dataField: "TrangThai",
                dataType: "string"
            },
            {//8
                alignment: "left",
                caption: "Thời gian tạo đơn",
                dataField: "ThoiGianTaoDonHang",
                dataType: "date",
                format: "dd/MM/yyyy hh:mm",
                customizeText: function (cellInfo) {
                    return cellInfo.valueText;
                }
            }
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
            enabled: false,
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
        //METHOD
        //Toolbar
        onToolbarPreparing: function (e) {
            var dataGrid = e.component;
            e.toolbarOptions.items.unshift(
                {//Load lại
                    location: "before",
                    widget: "dxButton",
                    options: {
                        hint: "Bỏ chốt",
                        icon: "arrowleft",
                        onClick: function () {
                            XoaDonHangChots();
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
                    $scope.donhangChot = angular.copy(e.data);
                    $scope.XoaDonHangChot();
                }

                // Reset your click info
                component.clickCount = 0;
                component.lastClickTime = 0;
            }
        },
        //Select Row
        onSelectionChanged: function (e) {
            $scope.selectedDonHangChots = angular.copy(e.selectedRowsData);
        }
    };

    //---CONTEXTMENU---
    var itemContextMenus = [
        { value: 'add', text: ' Thêm', icon: 'fa fa-plus' },
        { value: 'edit', text: ' Sửa', icon: 'fa fa-pencil' },
        { value: 'delete', text: ' Xóa', icon: 'fa fa-times' }
    ];
    //ChotDonHang
    $scope.contextMenuChotDonHangs = {
        dataSource: itemContextMenus,
        width: 100,
        target: '#chotDonHang',
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
                        $scope.AddChotDonHang();
                        break;
                    case "edit":
                        $scope.EditChotDonHang();
                        break;
                    case "delete":
                        $scope.DeleteChotDonHang();
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
                            case 'nhanvienbuudien':
                                $window.location.href = "/DonHang/XacNhanDonHang";
                                break;
                            case 'nhanvien':
                                $window.location.href = "/DonHang/QuanLyDonHang";
                                break;
                            default:
                        }

                        //Get danh sách đơn hàng
                        GetChotDonHangByKhachHang();
                        //GetAll Tỉnh - Thành phố
                        GetAllTinhThanhPho();

                    }, function error(response) {
                        toastr.error("Không lấy được quyền ChotDonHang");
                    });
            }, function error(response) {
                toastr.error("Không lấy được thông tin ChotDonHang");
            });
    }

    //---ChotDonHang---
    //GetChotDonHangByKhachHang
    function GetChotDonHangByKhachHang() {
        $http.get('/API/ChotDonHangAPI?att=KhachHang&&value=' + $scope.currentUser.Id)
            .then(function success(response) {
                $scope.chotDonHangs = angular.copy(response.data);
            }, function error(response) {
                toastr.error("Không lấy được danh sách đơn hàng");
            });
    }
    //Add
    $scope.AddChotDonHang = function () {
        $scope.createChotDonHang = true;
    }
    $scope.CreateChotDonHang = function () {
        //Set default
        $scope.chotDonHang = {
            Ngay: new Date(),
            ThoiGianChotDonHang: new Date(),
            TrangThaiChotDonHang: "DACHOT",
            TrangThaiXacNhanDonHang: "CHUAXACNHAN",
            KhachHang_ID: $scope.currentUser.Id,
            DonVi_ID: $scope.currentUser.DonVi_ID
        };

        //Get Đơn hàng chưa chốt
        GetDonHangChuaChot();
        $scope.donhangChots = [];

        $scope.modifyChotDonHang = true;
        $scope.createChotDonHang = false;
        $scope.postChotDonHang = true;
    }
    $scope.CancelCreateChotDonHang = function () {
        $scope.createChotDonHang = false;
    }
    //Edit
    $scope.EditChotDonHang = function () {
        if ($scope.selectedChotDonHangs.length == 0) {
            toastr.error("Chọn 1 dòng để sửa");
        } else {
            //Lấy dòng đầu tiên trong số dòng được chọn
            $scope.chotDonHang = angular.copy($scope.selectedChotDonHangs[0]);

            //Kiểm tra trạng thái xác nhận chốt đơn
            if ($scope.chotDonHang.TrangThaiXacNhanDonHang == "DAXACNHAN") {
                toastr.error("Phiếu chốt ĐÃ XÁC NHẬN");
            } else {
                //Get Đơn hàng chưa chốt
                GetDonHangChuaChot();
                //Get đơn hàng trong phiếu chốt
                GetChiTietChot();

                $scope.titlePopupModifyChotDonHang = "Sửa phiếu chốt đơn hàng";
                $scope.modifyChotDonHang = true;
            }
        }
    }
    //Save
    $scope.SaveChotDonHang = function (e) {
        //Thêm
        if ($scope.postChotDonHang == true) {
            //Tăng 7 tiếng theo múi giờ
            $scope.chotDonHang.Ngay.setTime($scope.chotDonHang.Ngay.getTime() + 7 * 60 * 60 * 1000);
            $scope.chotDonHang.ThoiGianChotDonHang.setTime($scope.chotDonHang.ThoiGianChotDonHang.getTime() + 7 * 60 * 60 * 1000);

            $http.post(apiChotDonHang, $scope.chotDonHang)
                .then(function success(response) {
                    $http.get(apiChotDonHang + '/' + response.data.ChotDonHang_ID)
                        .then(function success(response) {
                            $scope.chotDonHang = angular.copy(response.data);
                            //Lấy list id đơn hàng chốt
                            var listId = "";
                            angular.forEach($scope.donhangChots, function (value, index) {
                                listId += value.SoHieu + ",";
                            });
                            //Cập nhật chi tiết chốt đơn và trạng thái đơn hàng
                            $http.get('/DonHang/CapNhatChiTietChotDon/?idChotDon=' + $scope.chotDonHang.ChotDonHang_ID + '&&idDonHangs=' + listId)
                                .then(function success(response) {
                                    if (response.data == 1) {
                                        //Thêm chốt đơn mới vào danh sách
                                        $scope.chotDonHangs.push($scope.chotDonHang);

                                        toastr.success("Chốt đơn thành công");
                                        $scope.modifyChotDonHang = false;
                                        $scope.postChotDonHang = false;
                                    } else {
                                        //Xóa chốt đơn
                                        $http.delete(apiChotDonHang + '/' + $scope.chotDonHang.ChotDonHang_ID)
                                            .then(function success(response) {
                                                $scope.modifyChotDonHang = false;
                                                $scope.postChotDonHang = false;
                                            }, function error(response) {

                                            });
                                        toastr.error("Không lưu được chi tiết");
                                    }
                                }, function error(response) {
                                    toastr.error("Không lưu được chi tiết");
                                });
                        }, function error(response) {
                            toastr.error("Không lưu được chi tiết");
                        });
                }, function error(response) {
                    toastr.error("Không lưu được");
                }
            );
        }
        //Sửa
        else {
            $http.put(apiChotDonHang + "/" + $scope.chotDonHang.ChotDonHang_ID, $scope.chotDonHang)
                .then(function success(response) {
                    //Lấy list id đơn hàng chốt
                    var listId = "";
                    angular.forEach($scope.donhangChots, function (value, index) {
                        listId += value.SoHieu + ",";
                    });
                    //Cập nhật chi tiết chốt đơn và trạng thái đơn hàng
                    $http.get('/DonHang/CapNhatChiTietChotDon/?idChotDon=' + $scope.chotDonHang.ChotDonHang_ID + '&&idDonHangs=' + listId)
                        .then(function success(response) {
                            if (response.data == 1) {
                                //Thay đổi thông tin trong bảng danh sách phiếu chốt
                                angular.forEach($scope.chotDonHangs, function (value, index) {
                                    if (value.ChotDonHang_ID == $scope.chotDonHang.ChotDonHang_ID) {
                                        $scope.chotDonHangs[index] = angular.copy($scope.chotDonHang);
                                        toastr.success("Lưu thành công");
                                        $scope.modifyChotDonHang = false;
                                    }
                                });
                            } else {
                                toastr.error("Không lưu được chi tiết");
                            }
                        }, function error(response) {
                            toastr.error("Không lưu được chi tiết");
                        });

                }, function error(response) {
                    toastr.error("Không lưu được thay đổi");
                });
        }
    };
    $scope.CancelSaveChotDonHang = function () {
        $scope.modifyChotDonHang = false;
    }
    //Delete
    $scope.DeleteChotDonHang = function () {
        if ($scope.selectedChotDonHangs.length == 0) {
            toastr.error("Chọn dòng để xóa");
        } else {
            var deleteable = true;
            angular.forEach($scope.selectedChotDonHangs, function (value, index) {
                if (value.TrangThaiXacNhanDonHang == "DAXACNHAN") {
                    deleteable = false;
                }
            });
            if (deleteable == true) {
                $scope.deleteChotDonHang = true;
            } else {
                toastr.error("Chốt đơn ĐÃ XÁC NHẬN");
            }
        }
    }
    $scope.ConfirmDeleteChotDonHang = function () {
        var listId = "";
        angular.forEach($scope.selectedChotDonHangs, function (value, index) {
            listId += value.ChotDonHang_ID + ",";
        });

        $http.get('/DonHang/XoaChotDonHang/' + listId)
            .then(function success(response) {
                if (response.data == 1) {
                    toastr.success("Xóa thành công");
                    GetChotDonHangByKhachHang();
                } else {
                    toastr.error("Xóa không thành công");
                }
            }, function error(response) {
                toastr.error("Xóa không thành công");
            });

        $scope.deleteChotDonHang = false;
    };
    $scope.CancelDeleteChotDonHang = function () {
        $scope.deleteChotDonHang = false;
    };
    //Chốt đơn
    $scope.ThemDonHangChot = function () {
        //Thêm vào danh sách đơn hàng chốt
        $scope.donhangChuaChot.TrangThai = "DACHOT";
        $scope.donhangChots.push($scope.donhangChuaChot);
        //Xóa trong danh sách đơn hàng chưa chốt
        angular.forEach($scope.donhangChuaChots, function (value, index) {
            if (value.SoHieu == $scope.donhangChuaChot.SoHieu) {
                $scope.donhangChuaChots.splice(index, 1);
                //Giải phóng biến trung gian
                $scope.donhangChuaChot = {};
            }
        });
    }
    $scope.ThemDonHangChots = function () {
        //Thêm lần lượt đơn hàng vào danh sách chốt
        angular.forEach($scope.selectedDonHangChuaChots, function (valueDonHangChuaChot, indexDonHangChuaChot) {
            $scope.donhangChuaChot = angular.copy(valueDonHangChuaChot);
            $scope.ThemDonHangChot();
        });
        //Giải phóng biến trung gian
        $scope.selectedDonHangChuaChots = [];
    }
    $scope.XoaDonHangChot = function () {
        //Xóa đơn hàng khỏi danh sách hóa đơn chốt
        $scope.donhangChot.TrangThai = "CHUACHOT";
        $scope.donhangChuaChots.push($scope.donhangChot);
        //Xóa trong danh sách đơn hàng chốt
        angular.forEach($scope.donhangChots, function (value, index) {
            if (value.SoHieu == $scope.donhangChot.SoHieu) {
                $scope.donhangChots.splice(index, 1);
                //Giải phóng biến trung gian
                $scope.donhangChot = {};
            }
        });
    }
    $scope.XoaDonHangChots = function () {
        //Thêm lần lượt đơn hàng vào danh sách chốt
        angular.forEach($scope.selectedDonHangChots, function (valueDonHangChot, indexDonHangChot) {
            $scope.donhangChot = angular.copy(valueDonHangChot);
            $scope.XoaDonHangChot();
        });
        //Giải phóng biến trung gian
        $scope.selectedDonHangChots = [];
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

    //Get Đơn hàng chưa có trong chi tiết chốt
    function GetDonHangChuaChot() {
        $http.get('/APi/DonHangAPI?att=KhachHangChuaCoTrongChiTietChot&&value=' + $scope.chotDonHang.KhachHang_ID)
            .then(function success(response) {
                $scope.donhangChuaChots = angular.copy(response.data);
            }, function error(response) {
                toastr.error("Không lấy được đơn chưa chốt");
            });
    }
    //Get hóa đơn của phiếu chốt
    function GetChiTietChot() {
        $http.get('/API/DonHangAPI?att=ChotDonHang&&value=' + $scope.chotDonHang.ChotDonHang_ID)
            .then(function success(response) {
                $scope.donhangChots = angular.copy(response.data);
            }, function error(response) {
                toastr.error("Không lấy được chi tiết phiếu chốt");
            });
    }


}]);