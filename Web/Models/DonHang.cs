//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Web.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class DonHang
    {
        public Nullable<System.DateTime> Ngay { get; set; }
        public string KhachHang_ID { get; set; }
        public string NhanVien_ID { get; set; }
        public Nullable<System.DateTime> ThoiGianTaoDonHang { get; set; }
        public string SoHieu { get; set; }
        public string NguoiNhan { get; set; }
        public string DiaChiNguoiNhan { get; set; }
        public string TinhThanhPho_ID { get; set; }
        public string SoDienThoaiNguoiNhan { get; set; }
        public Nullable<double> SoTienThuHo { get; set; }
        public string NoiDungHang { get; set; }
        public string TrangThai { get; set; }
    
        public virtual TinhThanhPho TinhThanhPho { get; set; }
    }
}
