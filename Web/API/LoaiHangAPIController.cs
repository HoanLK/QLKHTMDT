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
    public class LoaiHangAPIController : ApiController
    {
        private MainDBEntities db = new MainDBEntities();

        // GET: api/LoaiHangAPI
        public IQueryable<LoaiHang> GetLoaiHang()
        {
            return db.LoaiHang;
        }

        // GET: api/LoaiHangAPI/5
        [ResponseType(typeof(LoaiHang))]
        public IHttpActionResult GetLoaiHang(int id)
        {
            LoaiHang loaiHang = db.LoaiHang.Find(id);
            if (loaiHang == null)
            {
                return NotFound();
            }

            return Ok(loaiHang);
        }

        // PUT: api/LoaiHangAPI/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutLoaiHang(int id, LoaiHang loaiHang)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != loaiHang.LoaiHang_ID)
            {
                return BadRequest();
            }

            db.Entry(loaiHang).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LoaiHangExists(id))
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

        // POST: api/LoaiHangAPI
        [ResponseType(typeof(LoaiHang))]
        public IHttpActionResult PostLoaiHang(LoaiHang loaiHang)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.LoaiHang.Add(loaiHang);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = loaiHang.LoaiHang_ID }, loaiHang);
        }

        // DELETE: api/LoaiHangAPI/5
        [ResponseType(typeof(LoaiHang))]
        public IHttpActionResult DeleteLoaiHang(int id)
        {
            LoaiHang loaiHang = db.LoaiHang.Find(id);
            if (loaiHang == null)
            {
                return NotFound();
            }

            db.LoaiHang.Remove(loaiHang);
            db.SaveChanges();

            return Ok(loaiHang);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool LoaiHangExists(int id)
        {
            return db.LoaiHang.Count(e => e.LoaiHang_ID == id) > 0;
        }
    }
}