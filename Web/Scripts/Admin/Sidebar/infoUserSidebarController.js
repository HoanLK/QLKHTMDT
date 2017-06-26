admin.controller("infoUserSidebarController", ['$scope', '$http', '$cookies', '$window', '$location', function ($scope, $http, $cookies, $window, $location) {
    //---VAR---
    $scope.currentUser = {};


    //---POPUP---

    //---CONTROL CONFIG---

    //---LIST---

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

                        console.log($scope.currentUser);

                        //Get danh sách đơn hàng
                        GetDonHangByKhachHang();
                        //GetAll Tỉnh - Thành phố
                        GetAllTinhThanhPho();

                    }, function error(response) {
                        toastr.error("Không lấy được quyền DonHang");
                    });
            }, function error(response) {
                toastr.error("Không lấy được thông tin DonHang");
            });
    }

    
    //---DonHang---
    //GetDonHangByKhachHang
    function GetDonHangByKhachHang() {
        var idKhachHang = null;
        if ($scope.currentUser.Role == "khachhang") {
            idKhachHang = $scope.currentUser.Id;
        } else {
            if ($scope.currentUser.Role == "nhanvien") {
                idKhachHang = $scope.currentUser.KhachHang_ID;
            }
        }
        $http.get('/API/DonHangAPI?att=KhachHang&&value=' + idKhachHang)
            .then(function success(response) {
                $scope.donhangs = angular.copy(response.data);
            }, function error(response) {
                toastr.error("Không lấy được danh sách đơn hàng");
            });
    }
    //Add
    $scope.AddDonHang = function () {
        //Lấy số hiệu
        $http.get('/KhoSo/GetSoHieuChuaCap')
            .then(function success(response) {
                $scope.donhang = {
                    SoHieu: response.data.SoHieu,
                    Ngay: new Date(),
                    ThoiGianTaoDonHang: new Date(),
                    TrangThai: 'CHUACHOT'
                };

                if ($scope.currentUser.Role == "khachhang") {
                    $scope.donhang.KhachHang_ID = $scope.currentUser.Id;
                } else {
                    if ($scope.currentUser.Role == "nhanvien") {
                        $scope.donhang.KhachHang_ID = $scope.currentUser.KhachHang_ID;
                        $scope.donhang.NhanVien_ID = $scope.currentUser.Id;
                    }
                }

                $scope.titlePopupModifyDonHang = "Thêm đơn hàng";
                $scope.modifyDonHang = true;
                $scope.postDonHang = true;

            }, function error(response) {
                toastr.error("Không lấy được Số hiệu");
            });

        
    }
    //Edit
    $scope.EditDonHang = function () {
        if ($scope.selectedDonHangs.length == 0) {
            toastr.error("Chọn 1 dòng để sửa");
        } else {
            $scope.donhang = angular.copy($scope.selectedDonHangs[0]);
            $scope.modifyDonHang = true;
        }
    }
    //Save
    $scope.SaveDonHang = function (e) {
        //Thêm
        if ($scope.postDonHang == true) {
            $http.post(apiDonHang, $scope.donhang)
                .then(function success(response) {
                    $scope.donhangs.push(response.data);
                    //Cập nhật Kho số
                    $http.get('/KhoSo/XacNhanCap/' + $scope.donhang.SoHieu)
                        .then(function success(response) {
                            if (response.data == 1) {
                                toastr.success("Thành công", "Thêm");
                                $scope.modifyDonHang = false;
                                $scope.postDonHang = false;
                            } else {
                                toastr.error("Không cập nhật được Kho số");
                            }
                        }, function error(response) {
                            toastr.error("Không cập nhật được Kho số");
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
    $scope.DeleteDonHang = function () {
        if ($scope.selectedDonHangs.length == 0) {
            toastr.error("Chọn dòng để xóa");
        } else {
            $scope.deleteDonHang = true;
        }
    }
    $scope.ConfirmDeleteDonHang = function () {
        angular.forEach($scope.selectedDonHangs, function (value, index) {
            $http.delete(apiDonHang + '/' + value.SoHieu)
                .then(function success(response) {
                    angular.forEach($scope.donhangs, function (valueDH, indexDH) {
                        if (value.SoHieu === valueDH.SoHieu) {
                            $scope.donhangs.splice(indexDH, 1);
                            //Cập nhật Kho số
                            $http.get('/KhoSo/HuyCap/' + value.SoHieu)
                                .then(function success(response) {
                                    if (response.data == 1) {
                                    } else {
                                        toastr.error("Không cập nhật được Kho số");
                                    }
                                }, function error(response) {
                                    toastr.error("Không cập nhật được Kho số");
                                });
                        }
                    });
                }, function error(response) {
                    toastr.error("Không xóa được");
                });
        });
        toastr.success("Thành công", "Xóa");
        $scope.deleteDonHang = false;
    };
    $scope.CancelDeleteDonHang = function () {
        $scope.deleteDonHang = false;
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



}]);