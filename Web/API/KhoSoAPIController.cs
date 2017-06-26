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
    public class KhoSoAPIController : ApiController
    {
        private MainDBEntities db = new MainDBEntities();

        // GET: api/KhoSoAPI
        public IQueryable<KhoSo> GetKhoSo()
        {
            return db.KhoSo;
        }

        // GET: api/KhoSoAPI/5
        [ResponseType(typeof(KhoSo))]
        public IHttpActionResult GetKhoSo(string id)
        {
            KhoSo khoSo = db.KhoSo.Find(id);
            if (khoSo == null)
            {
                return NotFound();
            }

            return Ok(khoSo);
        }

        // PUT: api/KhoSoAPI/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutKhoSo(string id, KhoSo khoSo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != khoSo.SoHieu)
            {
                return BadRequest();
            }

            db.Entry(khoSo).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KhoSoExists(id))
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

        // POST: api/KhoSoAPI
        [ResponseType(typeof(KhoSo))]
        public IHttpActionResult PostKhoSo(KhoSo khoSo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.KhoSo.Add(khoSo);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (KhoSoExists(khoSo.SoHieu))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = khoSo.SoHieu }, khoSo);
        }

        // DELETE: api/KhoSoAPI/5
        [ResponseType(typeof(KhoSo))]
        public IHttpActionResult DeleteKhoSo(string id)
        {
            KhoSo khoSo = db.KhoSo.Find(id);
            if (khoSo == null)
            {
                return NotFound();
            }

            db.KhoSo.Remove(khoSo);
            db.SaveChanges();

            return Ok(khoSo);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool KhoSoExists(string id)
        {
            return db.KhoSo.Count(e => e.SoHieu == id) > 0;
        }
    }
}