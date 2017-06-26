using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Web.Models;

namespace Web.API
{
    [Authorize]
    public class DonHangAPIController : ApiController
    {
        private MainDBEntities db = new MainDBEntities();

        // GET: api/DonHangAPI
        public IQueryable<DonHang> GetDonHang()
        {
            return db.DonHang;
        }

        // GET: api/DonHangAPI/5
        [ResponseType(typeof(DonHang))]
        public IHttpActionResult GetDonHang(string id)
        {
            db.Configuration.LazyLoadingEnabled = false;
            db.Configuration.ProxyCreationEnabled = false;

            DonHang donHang = db.DonHang.Where(p => p.SoHieu.Contains(id)).FirstOrDefault();
            if (donHang == null)
            {
                return NotFound();
            }

            return Ok(donHang);
        }

        //GET: api/DonHangAPI?att=...&&value=...
        [ResponseType(typeof(DonHang))]
        public IQueryable<DonHang> GetDonHang(string att, string value)
        {
            db.Configuration.LazyLoadingEnabled = false;
            db.Configuration.ProxyCreationEnabled = false;

            if (att == "KhachHang")
            {
                var model = db.DonHang.Where(p => p.KhachHang_ID == value).OrderByDescending(p => p.ThoiGianTaoDonHang);
                return model;
            }
            if (att == "NhanVien")
            {
                var model = db.DonHang.Where(p => p.NhanVien_ID == value).OrderByDescending(p => p.ThoiGianTaoDonHang);
                return model;
            }
            //Danh danh sách đơn hàng theo khách hàng và chưa có trong chi tiết chốt
            if (att == "KhachHangChuaCoTrongChiTietChot")
            {
                var model = db.DonHang.Where(p => p.KhachHang_ID == value && p.TrangThai == "CHUACHOT" && (db.ChiTietChotDonHang.Where(ct => ct.SoHieu == p.SoHieu).FirstOrDefault() == null)).OrderByDescending(p => p.ThoiGianTaoDonHang);
                return model;
            }
            if (att == "ChotDonHang")
            {
                int idChotDon;
                if(int.TryParse(value, out idChotDon))
                {
                    var chitietChotDonHangs = db.ChiTietChotDonHang.Where(p => p.ChotDonHang_ID == idChotDon).Select(p => p.SoHieu).ToList();
                    if(chitietChotDonHangs != null)
                    {
                        var model = db.DonHang.Where(p => chitietChotDonHangs.Contains(p.SoHieu)).OrderByDescending(p => p.ThoiGianTaoDonHang);
                        return model;
                    }
                }
            }

            return null;
        }

        //GET: api/DonHangAPI?att=...&&value=...&&status=...
        [ResponseType(typeof(DonHang))]
        public IQueryable<DonHang> GetDonHang(string att, string value, string status)
        {
            db.Configuration.LazyLoadingEnabled = false;
            db.Configuration.ProxyCreationEnabled = false;

            //Danh danh sách đơn hàng theo khách hàng và trạng thái
            if (att == "KhachHang")
            {
                if(status == "ALL")
                {
                    var model = db.DonHang.Where(p => p.KhachHang_ID == value).OrderByDescending(p => p.ThoiGianTaoDonHang);
                    return model;
                }
                else
                {
                    var model = db.DonHang.Where(p => p.KhachHang_ID == value && p.TrangThai == status).OrderByDescending(p => p.ThoiGianTaoDonHang);
                    return model;
                }
                
            }
            if (att == "NhanVien")
            {
                if (status == "ALL")
                {
                    var model = db.DonHang.Where(p => p.NhanVien_ID == value).OrderByDescending(p => p.ThoiGianTaoDonHang);
                    return model;
                }
                else
                {
                    var model = db.DonHang.Where(p => p.NhanVien_ID == value && p.TrangThai == status).OrderByDescending(p => p.ThoiGianTaoDonHang);
                    return model;
                }

            }

            return null;
        }

        // PUT: api/DonHangAPI/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutDonHang(string id, DonHang donHang)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != donHang.SoHieu)
            {
                return BadRequest();
            }

            db.Entry(donHang).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DonHangExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/DonHangAPI
        [ResponseType(typeof(DonHang))]
        public IHttpActionResult PostDonHang(DonHang donHang)
        {
            db.Configuration.LazyLoadingEnabled = false;
            db.Configuration.ProxyCreationEnabled = false;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //Thêm đơn hàng
            db.DonHang.Add(donHang);

            //Cập nhật kho số
            var khoso = db.KhoSo.Where(p => p.SoHieu.Contains(donHang.SoHieu)).FirstOrDefault();
            if(khoso != null)
            {
                khoso.TrangThai = "DACAP";
            }
            else
            {
                return BadRequest(ModelState);
            }

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (DonHangExists(donHang.SoHieu))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = donHang.SoHieu }, donHang);
        }

        // DELETE: api/DonHangAPI/5
        [ResponseType(typeof(DonHang))]
        public IHttpActionResult DeleteDonHang(string id)
        {
            DonHang donHang = db.DonHang.Where(p => p.SoHieu == id).FirstOrDefault();
            if (donHang == null)
            {
                return NotFound();
            }

            //Xóa đơn hàng trong chi tiết Chốt đơn nếu có
            var chitietChotDon = db.ChiTietChotDonHang.Where(p => p.SoHieu == donHang.SoHieu).FirstOrDefault();
            if(chitietChotDon != null)
            {
                db.ChiTietChotDonHang.Remove(chitietChotDon);
            }

            db.DonHang.Remove(donHang);

            //Cập nhật kho số
            var khoso = db.KhoSo.Where(p => p.SoHieu.Contains(donHang.SoHieu)).FirstOrDefault();
            if (khoso != null)
            {
                khoso.TrangThai = "CHUACAP";
            }
            else
            {
                return BadRequest(ModelState);
            }

            db.SaveChanges();

            return Ok(donHang);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool DonHangExists(string id)
        {
            return db.DonHang.Count(e => e.SoHieu == id) > 0;
        }
    }
}