admin.controller("registerController", ['$scope', '$http', '$cookies', '$window', '$location', function ($scope, $http, $cookies, $window, $location) {
    //---VAR---
    $scope.currentUser = {};
    var roleManage = 'khachhang';

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
                    Fax: response.data.Fax,
                    IsQuyenKhachHang: response.data.IsQuyenKhachHang,
                    KhachHang_ID: response.data.KhachHang_ID,
                    PhoneNumber: response.data.PhoneNumber,
                };
                //Get role account
                $http.get('/Account/GetRoleByAccount/' + $scope.currentUser.Id)
                    .then(function success(response) {
                        $scope.currentUser.Role = response.data;
                    }, function error(response) {
                        toastr.error("Không lấy được quyền Account");
                    });
            }, function error(response) {
                toastr.error("Không lấy được thông tin Account");
            });
    }



}]);