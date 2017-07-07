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
    public class KhachHangAPIController : ApiController
    {
        private MainDBEntities db = new MainDBEntities();

        // GET: api/KhachHangAPI
        public IQueryable<KhachHang> GetKhachHang()
        {
            db.Configuration.LazyLoadingEnabled = false;
            db.Configuration.ProxyCreationEnabled = false;

            return db.KhachHang;
        }

        // GET: api/KhachHangAPI/5
        [ResponseType(typeof(KhachHang))]
        public IHttpActionResult GetKhachHang(string id)
        {
            db.Configuration.LazyLoadingEnabled = false;
            db.Configuration.ProxyCreationEnabled = false;

            KhachHang khachHang = db.KhachHang.Find(id);
            if (khachHang == null)
            {
                return NotFound();
            }

            return Ok(khachHang);
        }

        //GET: api/KhachHangAPI?att=...&&value=...
        [ResponseType(typeof(DonHang))]
        public IQueryable<KhachHang> GetKhachHang(string att, string value)
        {
            db.Configuration.LazyLoadingEnabled = false;
            db.Configuration.ProxyCreationEnabled = false;

            if (att == "DonVi")
            {
                var model = db.KhachHang.Where(p => p.DonVi_ID == value);
                return model;
            }

            return null;
        }

        // PUT: api/KhachHangAPI/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutKhachHang(string id, KhachHang khachHang)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != khachHang.KhachHang_ID)
            {
                return BadRequest();
            }

            db.Entry(khachHang).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KhachHangExists(id))
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

        // POST: api/KhachHangAPI
        [ResponseType(typeof(KhachHang))]
        public IHttpActionResult PostKhachHang(KhachHang khachHang)
        {
            db.Configuration.LazyLoadingEnabled = false;
            db.Configuration.ProxyCreationEnabled = false;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.KhachHang.Add(khachHang);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (KhachHangExists(khachHang.KhachHang_ID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = khachHang.KhachHang_ID }, khachHang);
        }

        // DELETE: api/KhachHangAPI/5
        [ResponseType(typeof(KhachHang))]
        public IHttpActionResult DeleteKhachHang(string id)
        {
            KhachHang khachHang = db.KhachHang.Find(id);
            if (khachHang == null)
            {
                return NotFound();
            }

            db.KhachHang.Remove(khachHang);
            db.SaveChanges();

            return Ok(khachHang);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool KhachHangExists(string id)
        {
            return db.KhachHang.Count(e => e.KhachHang_ID == id) > 0;
        }
    }
}