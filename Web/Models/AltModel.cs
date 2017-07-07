using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Models
{
    public class AltModel
    {
    }

    public class AltListNguoiDung
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string TenNguoiDung { get; set; }
        public string DonVi_ID { get; set; }
        public string PhoneNumber { get; set; }
        public string Fax { get; set; }
        public string DiaChi { get; set; }
        public bool EmailConfirmed { get; set; }
        public bool TwoFactor { get; set; }
    }

    public class AltListNhanVien
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string TenNguoiDung { get; set; }
        public string DonVi_ID { get; set; }
        public string KhachHang_ID { get; set; }
        public string PhoneNumber { get; set; }
        public string DiaChi { get; set; }
        public bool EmailConfirmed { get; set; }
        public bool TwoFactor { get; set; }
    }

    public class AltChiTietPhieuChotExport
    {
        public string SoHieu { get; set; }
        public string TenNguoiNhan { get; set; }
        public string DiaChiNguoiNhan { get; set; }
        public string TinhPhat { get; set; }
        public string MaTinhPhat { get; set; }
        public string SoDTNguoiNhan { get; set; }
        public string SoTienCOD { get; set; }
        public string MaDonHang { get; set; }
        public string MaSo { get; set; }
        public string NoiDungHang { get; set; }
        public string TrongLuong { get; set; }
        public string ChieuDai { get; set; }
        public string ChieuRong { get; set; }
        public string ChieuCao { get; set; }
        public string PhatDongKiem { get; set; }
        public string VUN { get; set; }
        public string VungSauVungXa { get; set; }
        public string TenShop { get; set; }
        public string DiaChiShop { get; set; }
        public string SoDienThoaiShop { get; set; }
    }
}