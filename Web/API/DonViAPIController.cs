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
    public class DonViAPIController : ApiController
    {
        private MainDBEntities db = new MainDBEntities();

        // GET: api/DonViAPI
        public IQueryable<DonVi> GetDonVi()
        {
            db.Configuration.LazyLoadingEnabled = false;
            db.Configuration.ProxyCreationEnabled = false;
            return db.DonVi;
        }

        // GET: api/DonViAPI/5
        [ResponseType(typeof(DonVi))]
        public IHttpActionResult GetDonVi(string id)
        {
            DonVi donVi = db.DonVi.Find(id);
            if (donVi == null)
            {
                return NotFound();
            }

            return Ok(donVi);
        }

        // PUT: api/DonViAPI/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutDonVi(string id, DonVi donVi)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != donVi.DonVi_ID)
            {
                return BadRequest();
            }

            db.Entry(donVi).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DonViExists(id))
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

        // POST: api/DonViAPI
        [ResponseType(typeof(DonVi))]
        public IHttpActionResult PostDonVi(DonVi donVi)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.DonVi.Add(donVi);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (DonViExists(donVi.DonVi_ID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = donVi.DonVi_ID }, donVi);
        }

        // DELETE: api/DonViAPI/5
        [ResponseType(typeof(DonVi))]
        public IHttpActionResult DeleteDonVi(string id)
        {
            DonVi donVi = db.DonVi.Find(id);
            if (donVi == null)
            {
                return NotFound();
            }

            db.DonVi.Remove(donVi);
            db.SaveChanges();

            return Ok(donVi);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool DonViExists(string id)
        {
            return db.DonVi.Count(e => e.DonVi_ID == id) > 0;
        }
    }
}