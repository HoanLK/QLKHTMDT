using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Models;

namespace Web.Controllers
{
    public class KhoSoController : Controller
    {
        // GET: KhoSo
        public ActionResult Index()
        {
            return View();
        }

        //---API SUPPORT---
        public JsonResult GetSoHieuChuaCap()
        {
            using(MainDBEntities db = new MainDBEntities())
            {
                db.Configuration.LazyLoadingEnabled = false;
                db.Configuration.ProxyCreationEnabled = false;

                var model = db.KhoSo.Where(p => p.TrangThai.Contains("CHUACAP")).FirstOrDefault();

                return Json(model, JsonRequestBehavior.AllowGet);
            }
        }

        public int XacNhanCap(string id)
        {
            using(MainDBEntities db = new MainDBEntities())
            {
                var model = db.KhoSo.Where(p => p.SoHieu.Contains(id)).FirstOrDefault();

                if(model != null)
                {
                    model.TrangThai = "DACAP";
                    db.SaveChanges();
                    return 1;
                }

                return 0;
            }
        }

        public int HuyCap(string id)
        {
            using (MainDBEntities db = new MainDBEntities())
            {
                var model = db.KhoSo.Where(p => p.SoHieu.Contains(id)).FirstOrDefault();

                if (model != null)
                {
                    model.TrangThai = "CHUACAP";
                    db.SaveChanges();
                    return 1;
                }

                return 0;
            }
        }
    }
}