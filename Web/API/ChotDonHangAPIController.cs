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
    public class ChotDonHangAPIController : ApiController
    {
        private MainDBEntities db = new MainDBEntities();

        // GET: api/ChotDonHangAPI
        public IQueryable<ChotDonHang> GetChotDonHang()
        {
            db.Configuration.LazyLoadingEnabled = false;
            db.Configuration.ProxyCreationEnabled = false;

            return db.ChotDonHang;
        }

        // GET: api/ChotDonHangAPI/5
        [ResponseType(typeof(ChotDonHang))]
        public IHttpActionResult GetChotDonHang(double id)
        {
            db.Configuration.LazyLoadingEnabled = false;
            db.Configuration.ProxyCreationEnabled = false;

            ChotDonHang chotDonHang = db.ChotDonHang.Find(id);
            if (chotDonHang == null)
            {
                return NotFound();
            }

            return Ok(chotDonHang);
        }

        //GET: api/ChotDonHangAPI?att=...&&value=...
        [ResponseType(typeof(ChotDonHang))]
        public IQueryable<ChotDonHang> GetDonHang(string att, string value)
        {
            db.Configuration.LazyLoadingEnabled = false;
            db.Configuration.ProxyCreationEnabled = false;

            //Get chốt đơn hàng theo khách hàng
            if(att == "KhachHang")
            {
                var model = db.ChotDonHang.Where(p => p.KhachHang_ID == value).OrderByDescending(p => p.ThoiGianChotDonHang);
                return model;
            }

            //Get Chốt đơn hàng đã Chốt theo đơn vị
            if (att == "DaChotTheoDonVi")
            {
                var model = db.ChotDonHang.Where(p => p.DonVi_ID == value && p.TrangThaiChotDonHang == "DACHOT").OrderByDescending(p => p.ThoiGianChotDonHang);
                return model;
            }

            return null;
        }

        // PUT: api/ChotDonHangAPI/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutChotDonHang(double id, ChotDonHang chotDonHang)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != chotDonHang.ChotDonHang_ID)
            {
                return BadRequest();
            }

            db.Entry(chotDonHang).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ChotDonHangExists(id))
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

        // POST: api/ChotDonHangAPI
        [ResponseType(typeof(ChotDonHang))]
        public IHttpActionResult PostChotDonHang(ChotDonHang chotDonHang)
        {
            db.Configuration.LazyLoadingEnabled = false;
            db.Configuration.ProxyCreationEnabled = false;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ChotDonHang.Add(chotDonHang);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (ChotDonHangExists(chotDonHang.ChotDonHang_ID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = chotDonHang.ChotDonHang_ID }, chotDonHang);
        }

        // DELETE: api/ChotDonHangAPI/5
        [ResponseType(typeof(ChotDonHang))]
        public IHttpActionResult DeleteChotDonHang(double id)
        {
            ChotDonHang chotDonHang = db.ChotDonHang.Find(id);
            if (chotDonHang == null)
            {
                return NotFound();
            }

            db.ChotDonHang.Remove(chotDonHang);

            //Xóa chi tiết chốt đơn
            var chitiets = db.ChiTietChotDonHang.Where(p => p.ChotDonHang_ID == chotDonHang.ChotDonHang_ID).ToList();
            if(chitiets != null)
            {
                //Cập nhật trạng thái đơn
                foreach (var item in chitiets)
                {
                    var donhang = db.DonHang.Where(p => p.SoHieu == item.SoHieu).FirstOrDefault();
                    if(donhang != null)
                    {
                        donhang.TrangThai = "CHUACHOT";
                    }
                }

                db.ChiTietChotDonHang.RemoveRange(chitiets);
            }

            db.SaveChanges();

            return Ok(chotDonHang);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ChotDonHangExists(double id)
        {
            return db.ChotDonHang.Count(e => e.ChotDonHang_ID == id) > 0;
        }
    }
}