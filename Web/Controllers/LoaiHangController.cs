using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Models;

namespace Web.Controllers
{
    public class LoaiHangController : Controller
    {
        // GET: LoaiHang
        public ActionResult Index()
        {
            return View();
        }

        //SUPPORT API
        public JsonResult GetListName()
        {
            using(MainDBEntities db = new MainDBEntities())
            {
                return Json(db.LoaiHang.Select(p => p.LoaiHang_Name).ToList(), JsonRequestBehavior.AllowGet);
            }
        }
    }
}