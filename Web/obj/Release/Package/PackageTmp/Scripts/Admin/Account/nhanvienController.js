admin.controller("nhanvienController", ['$scope', '$http', '$cookies', '$window', '$location', function ($scope, $http, $cookies, $window, $location) {
    //---VAR---
    $scope.currentUser = {};
    var roleManage = 'nhanvien';
    //Account
    $scope.accounts = [];
    $scope.account = {};
    $scope.selectedAccounts = [];
    var apiAccount = "/API/AccountAPI";

    //---POPUP---
    //Account
    //modify
    $scope.modifyAccount = false;
    $scope.titlePopupModifyAccount = "Sửa thông tin Nhân viên";
    $scope.popupModifyAccount = {
        width: "auto",
        height: "auto",
        contentTemplate: "templateModifyAccount",
        showTitle: true,
        resizeEnabled: true,
        bindingOptions: {
            title: "titlePopupModifyAccount",
            visible: "modifyAccount",
        }
    };
    $scope.controlModifyAccount = {
        //TextBox
        tenNguoiDung: {
            showClearButton: true,
            valueChangeEvent: "keyup",
            bindingOptions: {
                value: "account.TenNguoiDung"
            }
        },
        dienthoai: {
            showClearButton: true,
            valueChangeEvent: "keyup",
            bindingOptions: {
                value: "account.PhoneNumber"
            }
        },
        diachi: {
            showClearButton: true,
            valueChangeEvent: "keyup",
            bindingOptions: {
                value: "account.DiaChi"
            }
        },
        //SelectBox
        //Button
    }
    //delete
    $scope.deleteAccount = false;
    $scope.titleDeleteAccount = "Bạn có chắc chắn muốn xóa?";
    $scope.popupDeleteAccount = {
        width: "auto",
        height: "auto",
        contentTemplate: "templateDeleteAccount",
        showTitle: false,
        bindingOptions: {
            visible: "deleteAccount",
        }
    };

    //---LIST---
    //Accounts
    $scope.gridAccounts = {
        bindingOptions: {
            dataSource: 'accounts',
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
                dataField: "Id",
                dataType: "string",
                visible: false
            },
            {//1
                alignment: "left",
                caption: "Tên nhân viên",
                dataField: "TenNguoiDung",
                dataType: "string"
            },
            {//2
                alignment: "left",
                caption: "Email",
                dataField: "Email",
                dataType: "string"
            },
            {//3
                alignment: "left",
                caption: "Điện thoại",
                dataField: "PhoneNumber",
                dataType: "string"
            },
            {//4
                alignment: "left",
                caption: "Địa chỉ",
                dataField: "DiaChi",
                dataType: "string"
            },
            {//5
                caption: "Xác nhận Email",
                dataField: "EmailConfirmed",
                dataType: "boolean"
            },
            {//6
                caption: "Bảo mật 2 lớp",
                dataField: "TwoFactor",
                dataType: "boolean"
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
            enabled: true,
            excelFilterEnabled: true,
            excelWrapTextEnabled: true,
            fileName: "Danh sách Nhân viên",
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
                    column: "id",
                    summaryType: "count"
                }
            ],
            totalItems: [
                {
                    column: "id",
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
                            $scope.AddAccount();
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
                            $scope.EditAccount();
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
                            $scope.DeleteAccount();
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
                            GetAccountByRole(roleManage);
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
                    $scope.account = angular.copy(e.data);
                    $scope.EditAccount();
                }

                // Reset your click info
                component.clickCount = 0;
                component.lastClickTime = 0;
            }
        },
        //Select Row
        onSelectionChanged: function (e) {
            $scope.selectedAccounts = angular.copy(e.selectedRowsData);
        }
    };

    //---CONTEXTMENU---
    var itemContextMenus = [
        { value: 'add', text: ' Thêm', icon: 'fa fa-plus' },
        { value: 'edit', text: ' Sửa', icon: 'fa fa-pencil' },
        { value: 'delete', text: ' Xóa', icon: 'fa fa-times' }
    ];
    //Account
    $scope.contextMenuAccounts = {
        dataSource: itemContextMenus,
        width: 100,
        target: '#account',
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
                        $scope.AddAccount();
                        break;
                    case "edit":
                        $scope.EditAccount();
                        break;
                    case "delete":
                        $scope.DeleteAccount();
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
        //Get info account
        $http.get('/API/AccountAPI/' + idUser)
            .then(function success(response) {
                $scope.currentUser = {
                    Id: response.data.Id,
                    UserName: response.data.UserName,
                    Email: response.data.Email,
                    TenNguoiDung: response.data.TenNguoiDung,
                    PhoneNumber: response.data.PhoneNumber,
                    DonVi_ID: response.data.DonVi_ID,
                    KhachHang_ID: response.data.KhachHang_ID,
                    PhoneNumber: response.data.PhoneNumber,
                };
                //Get role account
                $http.get('/Account/GetRoleByAccount/' + $scope.currentUser.Id)
                    .then(function success(response) {
                        $scope.currentUser.Role = response.data;

                        //GetAccountByRole
                        GetAccountByRole(roleManage);

                    }, function error(response) {
                        toastr.error("Không lấy được quyền Account");
                    });
            }, function error(response) {
                toastr.error("Không lấy được thông tin Account");
            });
    }

    //---Account---
    //GetAccountNhanVienByKhachHang
    function GetAccountByRole(role) {
        $http.get('/Account/GetNhanVienChotDonByKhachHang/' + $scope.currentUser.KhachHang_ID)
            .then(
                function success(response) {
                    $scope.accounts = angular.copy(response.data);
                },
                function error(response) {
                    toastr.error("Không lấy được danh sách Nhân viên");
                }
            );
    }

    //Add
    $scope.AddAccount = function () {
        $window.location.href = "/Account/AddNhanVien";
    }

    //Edit
    $scope.EditAccount = function () {
        if ($scope.selectedAccounts.length == 0) {
            toastr.error("Chọn 1 dòng để sửa");
        } else {
            $scope.account = angular.copy($scope.selectedAccounts[0]);
            $scope.modifyAccount = true;
        }
    }
    $scope.SaveAccount = function (e) {
        //Sửa
        //Lấy full thông tin account
        $http.get(apiAccount + "/" + $scope.account.Id)
            .then(function success(response) {
                //Gán thông tin cần thay đổi
                var account = response.data;
                account.TenNguoiDung = $scope.account.TenNguoiDung;
                account.PhoneNumber = $scope.account.PhoneNumber;
                account.DiaChi = $scope.account.DiaChi;
                //Lưu qua API
                $http.put(apiAccount + "/" + account.Id, account)
                    .then(function success(response) {
                        GetAccountByRole(roleManage);
                        toastr.success("Thành công", "Sửa");
                        $scope.modifyAccount = false;
                    }, function error(response) {
                        toastr.error("Thất bại", "Sửa");
                    });
            }, function error(response) {
                toastr.error("Thất bại", "Sửa");
            });
    };
    $scope.CancelSaveAccount = function () {
        $scope.modifyAccount = false;
    }

    //Delete
    $scope.DeleteAccount = function () {
        if ($scope.selectedAccounts.length == 0) {
            toastr.error("Chọn dòng để xóa");
        } else {
            $scope.deleteAccount = true;
        }
    }
    $scope.ConfirmDeleteAccount = function () {
        $scope.account = angular.copy($scope.selectedAccounts[0]);
        $window.location.href = "/Account/DeleteNhanVien/" + $scope.account.Id;
        $scope.deleteAccount = false;
    };
    $scope.CancelDeleteAccount = function () {
        $scope.deleteAccount = false;
    };


}]);