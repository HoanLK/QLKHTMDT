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
    
    public partial class NhanVien
    {
        public string KhachHang_ID { get; set; }
        public string NhanVien_ID { get; set; }
        public string NhanVien1 { get; set; }
        public string TenTruyCap { get; set; }
        public string MatKhau { get; set; }
        public string QuyenKhachHang_ID { get; set; }
    
        public virtual KhachHang KhachHang { get; set; }
        public virtual QuyenKhachHang QuyenKhachHang { get; set; }
    }
}
