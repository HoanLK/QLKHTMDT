using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Models;

namespace Web.Controllers
{
    [Authorize]
    public class DonHangController : Controller
    {
        // GET: DonHang
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult QuanLyDonHang()
        {
            return View();
        }

        public ActionResult ChotDonHang()
        {
            return View();
        }

        public ActionResult XacNhanDonHang()
        {
            return View();
        }

        //---API SUPPORT---
        public int CapNhatChiTietChotDon(int idChotDon, string idDonHangs)
        {
            using (MainDBEntities db = new MainDBEntities())
            {
                db.Configuration.LazyLoadingEnabled = false;
                db.Configuration.ProxyCreationEnabled = false;

                var chotDonHang = db.ChotDonHang.Where(p => p.ChotDonHang_ID == idChotDon).FirstOrDefault();
                if(chotDonHang != null)
                {
                    
                    var oldChitietChotDons = db.ChiTietChotDonHang.Where(p => p.ChotDonHang_ID == chotDonHang.ChotDonHang_ID).ToList();
                    //Trả lại trạng thái chưa chốt của những chi tiết trước khi sửa
                    foreach (var item in oldChitietChotDons)
                    {
                        var donhang = db.DonHang.Where(p => p.SoHieu == item.SoHieu).FirstOrDefault();
                        if(donhang != null)
                        {
                            donhang.TrangThai = "CHUACHOT";
                        }
                    }
                    //Xóa chi tiết chốt đơn cũ
                    db.ChiTietChotDonHang.RemoveRange(oldChitietChotDons);

                    var listId = idDonHangs.Split(',');

                    foreach (var item in listId)
                    {
                        //Cập nhật trạng thái đơn
                        var donhang = db.DonHang.Where(p => p.SoHieu == item).FirstOrDefault();
                        if (donhang != null)
                        {
                            if(chotDonHang.TrangThaiChotDonHang == "DACHOT")
                            {
                                donhang.TrangThai = "DACHOT";
                            }
                            else
                            {
                                donhang.TrangThai = "CHUACHOT";
                            }

                            //Thêm chi tiết chốt đơn
                            ChiTietChotDonHang chitietChotDon = new ChiTietChotDonHang()
                            {
                                ChotDonHang_ID = chotDonHang.ChotDonHang_ID,
                                SoHieu = donhang.SoHieu
                            };
                            db.ChiTietChotDonHang.Add(chitietChotDon);
                        }
                    }

                    try
                    {
                        db.SaveChanges();
                        return 1;
                    }
                    catch (Exception)
                    {
                        return 0;
                        throw;
                    }
                }
                else
                {
                    return 0;
                }
            }
        }

        public int XoaDonHang(string id)
        {
            using(MainDBEntities db = new MainDBEntities())
            {
                db.Configuration.LazyLoadingEnabled = false;
                db.Configuration.ProxyCreationEnabled = false;

                var listId = id.Split(',');

                foreach (var item in listId)
                {
                    //Xóa đơn hàng
                    var donhang = db.DonHang.Where(p => p.SoHieu == item).FirstOrDefault();
                    if(donhang != null)
                    {
                        db.DonHang.Remove(donhang);
                        //Cập nhật kho số
                        var khoso = db.KhoSo.Where(p => p.SoHieu == donhang.SoHieu).FirstOrDefault();
                        if(khoso != null)
                        {
                            khoso.TrangThai = "CHUACAP";
                        }
                        else
                        {
                            return 0;
                        }
                    }
                }

                try
                {
                    db.SaveChanges();
                    return 1;
                }
                catch (Exception)
                {
                    return 0;
                    throw;
                }

            }
        }

        public int XoaChotDonHang(string id)
        {
            using (MainDBEntities db = new MainDBEntities())
            {
                db.Configuration.LazyLoadingEnabled = false;
                db.Configuration.ProxyCreationEnabled = false;

                var listId = id.Split(',');

                foreach (var item in listId)
                {
                    //Xóa chốt đơn hàng
                    var chotDonHang = db.ChotDonHang.Where(p => p.ChotDonHang_ID.ToString() == item).FirstOrDefault();
                    if (chotDonHang != null)
                    {
                        db.ChotDonHang.Remove(chotDonHang);
                        //Xóa chi tiết chốt đơn
                        var chitiets = db.ChiTietChotDonHang.Where(p => p.ChotDonHang_ID == chotDonHang.ChotDonHang_ID).ToList();
                        if (chitiets != null)
                        {
                            //Cập nhật trạng thái đơn
                            foreach (var chitiet in chitiets)
                            {
                                var donhang = db.DonHang.Where(p => p.SoHieu == chitiet.SoHieu).FirstOrDefault();
                                if (donhang != null)
                                {
                                    donhang.TrangThai = "CHUACHOT";
                                }
                            }

                            db.ChiTietChotDonHang.RemoveRange(chitiets);
                        }
                    }
                }

                try
                {
                    db.SaveChanges();
                    return 1;
                }
                catch (Exception)
                {
                    return 0;
                    throw;
                }

            }
        }

        public int XacNhanChotDonHang(string id)
        {
            using (MainDBEntities db = new MainDBEntities())
            {
                db.Configuration.LazyLoadingEnabled = false;
                db.Configuration.ProxyCreationEnabled = false;

                var listId = id.Split(',');

                foreach (var item in listId)
                {
                    //Cập nhật trạng thái Xác nhận cho chốt đơn hàng
                    var chotDonHang = db.ChotDonHang.Where(p => p.ChotDonHang_ID.ToString() == item).FirstOrDefault();
                    if (chotDonHang != null)
                    {
                        chotDonHang.TrangThaiXacNhanDonHang = "DAXACNHAN";
                    }
                }

                try
                {
                    db.SaveChanges();
                    return 1;
                }
                catch (Exception)
                {
                    return 0;
                    throw;
                }

            }
        }

        public int HuyXacNhanChotDonHang(string id)
        {
            using (MainDBEntities db = new MainDBEntities())
            {
                db.Configuration.LazyLoadingEnabled = false;
                db.Configuration.ProxyCreationEnabled = false;

                var listId = id.Split(',');

                foreach (var item in listId)
                {
                    //Cập nhật trạng thái Xác nhận cho chốt đơn hàng
                    var chotDonHang = db.ChotDonHang.Where(p => p.ChotDonHang_ID.ToString() == item).FirstOrDefault();
                    if (chotDonHang != null)
                    {
                        chotDonHang.TrangThaiXacNhanDonHang = "CHUAXACNHAN";
                    }
                }

                try
                {
                    db.SaveChanges();
                    return 1;
                }
                catch (Exception)
                {
                    return 0;
                    throw;
                }

            }
        }
    }
}