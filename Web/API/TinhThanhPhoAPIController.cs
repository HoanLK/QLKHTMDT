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
    public class TinhThanhPhoAPIController : ApiController
    {
        private MainDBEntities db = new MainDBEntities();

        TinhThanhPhoAPIController()
        {
            db.Configuration.LazyLoadingEnabled = false;
            db.Configuration.ProxyCreationEnabled = false;
        }

        // GET: api/TinhThanhPhoAPI
        public IQueryable<TinhThanhPho> GetTinhThanhPho()
        {
            var model = db.TinhThanhPho;
            foreach (var item in model)
            {
                item.TinhThanhPho_Name = item.TinhThanhPho_ID + " - " + item.TinhThanhPho_Name;
            }

            return model;
        }

        // GET: api/TinhThanhPhoAPI/5
        [ResponseType(typeof(TinhThanhPho))]
        public IHttpActionResult GetTinhThanhPho(string id)
        {
            TinhThanhPho tinhThanhPho = db.TinhThanhPho.Find(id);
            if (tinhThanhPho == null)
            {
                return NotFound();
            }

            return Ok(tinhThanhPho);
        }

        // PUT: api/TinhThanhPhoAPI/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTinhThanhPho(string id, TinhThanhPho tinhThanhPho)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tinhThanhPho.TinhThanhPho_ID)
            {
                return BadRequest();
            }

            db.Entry(tinhThanhPho).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TinhThanhPhoExists(id))
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

        // POST: api/TinhThanhPhoAPI
        [ResponseType(typeof(TinhThanhPho))]
        public IHttpActionResult PostTinhThanhPho(TinhThanhPho tinhThanhPho)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.TinhThanhPho.Add(tinhThanhPho);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (TinhThanhPhoExists(tinhThanhPho.TinhThanhPho_ID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = tinhThanhPho.TinhThanhPho_ID }, tinhThanhPho);
        }

        // DELETE: api/TinhThanhPhoAPI/5
        [ResponseType(typeof(TinhThanhPho))]
        public IHttpActionResult DeleteTinhThanhPho(string id)
        {
            TinhThanhPho tinhThanhPho = db.TinhThanhPho.Find(id);
            if (tinhThanhPho == null)
            {
                return NotFound();
            }

            db.TinhThanhPho.Remove(tinhThanhPho);
            db.SaveChanges();

            return Ok(tinhThanhPho);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TinhThanhPhoExists(string id)
        {
            return db.TinhThanhPho.Count(e => e.TinhThanhPho_ID == id) > 0;
        }
    }
}