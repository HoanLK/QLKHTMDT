﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class MainDBEntities : DbContext
    {
        public MainDBEntities()
            : base("name=MainDBEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<AspNetRoles> AspNetRoles { get; set; }
        public virtual DbSet<AspNetUserClaims> AspNetUserClaims { get; set; }
        public virtual DbSet<AspNetUserLogins> AspNetUserLogins { get; set; }
        public virtual DbSet<AspNetUsers> AspNetUsers { get; set; }
        public virtual DbSet<CapDaiSo> CapDaiSo { get; set; }
        public virtual DbSet<ChiTietChotDonHang> ChiTietChotDonHang { get; set; }
        public virtual DbSet<ChotDonHang> ChotDonHang { get; set; }
        public virtual DbSet<DichVu> DichVu { get; set; }
        public virtual DbSet<DonHang> DonHang { get; set; }
        public virtual DbSet<DonVi> DonVi { get; set; }
        public virtual DbSet<KhachHang> KhachHang { get; set; }
        public virtual DbSet<KhoSo> KhoSo { get; set; }
        public virtual DbSet<LoaiHang> LoaiHang { get; set; }
        public virtual DbSet<NguoiDung> NguoiDung { get; set; }
        public virtual DbSet<NhanVien> NhanVien { get; set; }
        public virtual DbSet<QuyenBuuDien> QuyenBuuDien { get; set; }
        public virtual DbSet<QuyenKhachHang> QuyenKhachHang { get; set; }
        public virtual DbSet<sysdiagrams> sysdiagrams { get; set; }
        public virtual DbSet<TinhThanhPho> TinhThanhPho { get; set; }
    }
}
