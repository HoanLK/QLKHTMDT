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
    public class DichVuAPIController : ApiController
    {
        private MainDBEntities db = new MainDBEntities();

        DichVuAPIController()
        {
            db.Configuration.LazyLoadingEnabled = false;
            db.Configuration.ProxyCreationEnabled = false;
        }

        // GET: api/DichVuAPI
        public IQueryable<DichVu> GetDichVu()
        {
            var model = db.DichVu;

            foreach (var item in model)
            {
                item.DichVu_Name = item.DichVu_ID + " - " + item.DichVu_Name;
            }

            return model;
        }

        // GET: api/DichVuAPI/5
        [ResponseType(typeof(DichVu))]
        public IHttpActionResult GetDichVu(string id)
        {
            DichVu dichVu = db.DichVu.Find(id);
            if (dichVu == null)
            {
                return NotFound();
            }

            return Ok(dichVu);
        }

        // PUT: api/DichVuAPI/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutDichVu(string id, DichVu dichVu)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != dichVu.DichVu_ID)
            {
                return BadRequest();
            }

            db.Entry(dichVu).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DichVuExists(id))
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

        // POST: api/DichVuAPI
        [ResponseType(typeof(DichVu))]
        public IHttpActionResult PostDichVu(DichVu dichVu)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.DichVu.Add(dichVu);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (DichVuExists(dichVu.DichVu_ID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = dichVu.DichVu_ID }, dichVu);
        }

        // DELETE: api/DichVuAPI/5
        [ResponseType(typeof(DichVu))]
        public IHttpActionResult DeleteDichVu(string id)
        {
            DichVu dichVu = db.DichVu.Find(id);
            if (dichVu == null)
            {
                return NotFound();
            }

            db.DichVu.Remove(dichVu);
            db.SaveChanges();

            return Ok(dichVu);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool DichVuExists(string id)
        {
            return db.DichVu.Count(e => e.DichVu_ID == id) > 0;
        }
    }
}