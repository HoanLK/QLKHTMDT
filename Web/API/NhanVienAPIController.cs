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
    public class NhanVienAPIController : ApiController
    {
        private MainDBEntities db = new MainDBEntities();

        // GET: api/NhanVienAPI
        public IQueryable<NhanVien> GetNhanVien()
        {
            return db.NhanVien;
        }

        // GET: api/NhanVienAPI/5
        [ResponseType(typeof(NhanVien))]
        public IHttpActionResult GetNhanVien(string id)
        {
            NhanVien nhanVien = db.NhanVien.Find(id);
            if (nhanVien == null)
            {
                return NotFound();
            }

            return Ok(nhanVien);
        }

        // PUT: api/NhanVienAPI/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutNhanVien(string id, NhanVien nhanVien)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != nhanVien.NhanVien_ID)
            {
                return BadRequest();
            }

            db.Entry(nhanVien).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NhanVienExists(id))
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

        // POST: api/NhanVienAPI
        [ResponseType(typeof(NhanVien))]
        public IHttpActionResult PostNhanVien(NhanVien nhanVien)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.NhanVien.Add(nhanVien);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (NhanVienExists(nhanVien.NhanVien_ID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = nhanVien.NhanVien_ID }, nhanVien);
        }

        // DELETE: api/NhanVienAPI/5
        [ResponseType(typeof(NhanVien))]
        public IHttpActionResult DeleteNhanVien(string id)
        {
            NhanVien nhanVien = db.NhanVien.Find(id);
            if (nhanVien == null)
            {
                return NotFound();
            }

            db.NhanVien.Remove(nhanVien);
            db.SaveChanges();

            return Ok(nhanVien);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool NhanVienExists(string id)
        {
            return db.NhanVien.Count(e => e.NhanVien_ID == id) > 0;
        }
    }
}