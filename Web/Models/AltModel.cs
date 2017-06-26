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

}