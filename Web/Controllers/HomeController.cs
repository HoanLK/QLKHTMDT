using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Models;
using Microsoft.AspNet.Identity;

namespace Web.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private ApplicationDbContext _context = new ApplicationDbContext();

        public ActionResult Index()
        {
            var idUser = User.Identity.GetUserId();
            var user = _context.Users.Where(p => p.Id == idUser).FirstOrDefault();

            if (user != null)
            {
                if (user.Roles.ToList()[0].RoleId == "nhanvien")
                {
                    return RedirectToAction("QuanLyDonHang", "DonHang");
                }
                if (user.Roles.ToList()[0].RoleId == "khachhang")
                {
                    return RedirectToAction("ChotDonHang", "DonHang");
                }
                if (user.Roles.ToList()[0].RoleId == "nhanvienbuudien")
                {
                    return RedirectToAction("XacNhanDonHang", "DonHang");
                }
            }


            return View();
        }

    }
}
