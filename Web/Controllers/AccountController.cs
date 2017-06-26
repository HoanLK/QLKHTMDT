using System;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;

using Web.Models;
using System.Web.Security;
using System.Collections.Generic;

namespace Web.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;
        private ApplicationDbContext _context;
        private MainDBEntities _db;

        public AccountController()
        {
            _context = new ApplicationDbContext();
            _db = new MainDBEntities();
        }

        public AccountController(ApplicationUserManager userManager, ApplicationSignInManager signInManager )
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set 
            { 
                _signInManager = value; 
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult NhanVienQuanLy()
        {
            return View();
        }

        public ActionResult NhanVien()
        {
            return View();
        }

        //
        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(LoginViewModel model, string returnUrl)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // This doesn't count login failures towards account lockout
            // To enable password failures to trigger account lockout, change to shouldLockout: true
            var result = await SignInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, shouldLockout: true);

            // If it was a successful login
            if (result == SignInStatus.Success || result == SignInStatus.RequiresVerification)
            {
                // check that their email address is confirmed:
                var user = await UserManager.FindByNameAsync(model.Email);
                if (!await UserManager.IsEmailConfirmedAsync(user.Id))
                {
                    // sign them out!
                    AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);

                    TempData["UserId"] = user.Id;
                    return RedirectToAction("UnconfirmedEmail");
                }

                // reset their login 
            }

            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToLocal(returnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.RequiresVerification:
                    return RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = model.RememberMe });
                case SignInStatus.Failure:
                default:
                    ModelState.AddModelError("", "Invalid login attempt.");
                    return View(model);
            }
        }

        [AllowAnonymous]
        public ActionResult UnconfirmedEmail()
        {
            ResendValidationEmailViewModel ViewModel = new ResendValidationEmailViewModel();
            ViewModel.UserId = (string)TempData["UserId"];
            return View(ViewModel);
        }


        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult> ResendValidationEmail(ResendValidationEmailViewModel ViewModel)
        {
            string callbackUrl = await generateConfirmAccountEmail(ViewModel.UserId);

#if DEBUG
            ViewModel.CallbackUrl = callbackUrl;
#endif

            return View(ViewModel);
        }


        private async Task<string> generateConfirmAccountEmail(string userId)
        {
            string email = UserManager.GetEmail(userId);

            string code = 
                await UserManager.GenerateEmailConfirmationTokenAsync(userId);

            var routeValues = new { userId = userId, code = code };

            var callbackUrl =
                Url.Action("ConfirmEmail", "Account", routeValues, protocol: Request.Url.Scheme);

            Emailer emailer = new Emailer();
            emailer.sendEmail(email, 
                      "Xác nhận tài khoản",
                      "Vui lòng <a href=\"" + callbackUrl + "\">Nhấn vào đây</a> để xác nhận tài khoản của bạn.");
            
            return callbackUrl;
        }

        //
        // GET: /Account/VerifyCode
        [AllowAnonymous]
        public async Task<ActionResult> VerifyCode(string provider, string returnUrl, bool rememberMe)
        {
            // Require that the user has already logged in via username/password or external login
            if (!await SignInManager.HasBeenVerifiedAsync())
            {
                return View("Error");
            }
            return View(new VerifyCodeViewModel { Provider = provider, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }

        //
        // POST: /Account/VerifyCode
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> VerifyCode(VerifyCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // The following code protects for brute force attacks against the two factor codes. 
            // If a user enters incorrect codes for a specified amount of time then the user account 
            // will be locked out for a specified amount of time. 
            // You can configure the account lockout settings in IdentityConfig
            var result = await SignInManager.TwoFactorSignInAsync(
                model.Provider, 
                model.Code, 
                isPersistent:  model.RememberMe, 
                rememberBrowser: model.RememberBrowser);

            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToLocal(model.ReturnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.Failure:
                default:
                    ModelState.AddModelError("", "Invalid code.");
                    return View(model);
            }
        }

        //
        // GET: /Account/Register
        [AllowAnonymous]
        public ActionResult Register()
        {
            //Lấy danh sách khóa ngoại
            var DonVis = _db.DonVi;

            //Tạo list cho View
            ViewBag.DonVi_ID = new SelectList(DonVis, "DonVi_ID", "DonVi_Name");
            ViewBag.Role = new SelectList(_context.Roles.Where(p => p.Name == "Administrator" || p.Name == "Nhân viên bưu điện"), "Name", "Name");

            return View();
        }

        //
        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Register(RegisterViewModel model)
        {
            //Lấy danh sách khóa ngoại
            var DonVis = _db.DonVi;
            
            //Tạo list cho View
            ViewBag.DonVi_ID = new SelectList(DonVis, "DonVi_ID", "DonVi_Name", model.DonVi_ID);
            ViewBag.Role = new SelectList(_context.Roles.Where(p => p.Name == "Administrator" || p.Name == "Nhân viên bưu điện"), "Name", "Name", model.Role);

            if (ModelState.IsValid)
            {
                var user = new Web.Models.ApplicationUser { UserName = model.Email, Email = model.Email };

                var result = await UserManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    //Assign Role to user Here 
                    await this.UserManager.AddToRoleAsync(user.Id, model.Role);

                    var temp = _db.AspNetUsers.Where(p => p.Id == user.Id).FirstOrDefault();
                    if (temp != null)
                    {
                        temp.TenNguoiDung = model.TenNguoiDung;
                        temp.DiaChi = model.DiaChi;
                        temp.PhoneNumber = model.PhoneNumber;
                        temp.DonVi_ID = model.DonVi_ID;
                        _db.SaveChanges();
                    }

                    var callbackUrl = await generateConfirmAccountEmail(user.Id);

        #if DEBUG
                    TempData["ViewBagLink"] = callbackUrl;
        #endif

                    ViewBag.Message = "Vui lòng xác nhận Email trước khi đăng nhập.";

                    return View("Info");
                }
                AddErrors(result);
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }


        //
        // GET: /Account/AddKhachHang
        [AllowAnonymous]
        public ActionResult AddNhanVienQuanLy()
        {
            var currentUser = _context.Users.Find(User.Identity.GetUserId());
            var infoUser = _db.AspNetUsers.Find(currentUser.Id);

            //Lấy danh sách khóa ngoại
            var DonVis = _db.DonVi;
            var KhachHangs = _db.KhachHang.Where(p => p.DonVi_ID == infoUser.DonVi_ID);

            //Tạo list cho View
            ViewBag.DonVi_ID = new SelectList(DonVis, "DonVi_ID", "DonVi_Name", infoUser.DonVi_ID);
            ViewBag.Role = new SelectList(_context.Roles, "Name", "Name", "Nhân viên quản lý");
            ViewBag.KhachHang_ID = new SelectList(KhachHangs, "KhachHang_ID", "KhachHang_Name");


            return View();
        }

        //
        // POST: /Account/AddKhachHang
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> AddNhanVienQuanLy(RegisterViewModel model)
        {
            var currentUser = _context.Users.Find(User.Identity.GetUserId());
            var infoUser = _db.AspNetUsers.Find(currentUser.Id);

            //Lấy danh sách khóa ngoại
            var DonVis = _db.DonVi;
            var KhachHangs = _db.KhachHang.Where(p => p.DonVi_ID == infoUser.DonVi_ID);

            //Tạo list cho View
            ViewBag.DonVi_ID = new SelectList(DonVis, "DonVi_ID", "DonVi_Name", infoUser.DonVi_ID);
            ViewBag.Role = new SelectList(_context.Roles, "Name", "Name", "Nhân viên quản lý");
            ViewBag.KhachHang_ID = new SelectList(KhachHangs, "KhachHang_ID", "KhachHang_Name", model.KhachHang_ID);

            if (ModelState.IsValid)
            {
                var user = new Web.Models.ApplicationUser { UserName = model.Email, Email = model.Email };

                var result = await UserManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    //Assign Role to user Here 
                    await this.UserManager.AddToRoleAsync(user.Id, model.Role);

                    var callbackUrl = await generateConfirmAccountEmail(user.Id);

#if DEBUG
                    TempData["ViewBagLink"] = callbackUrl;
#endif

                    ViewBag.Message = "Vui lòng xác nhận Email trước khi đăng nhập.";

                    var temp = _db.AspNetUsers.Where(p => p.Id == user.Id).FirstOrDefault();
                    if (temp != null)
                    {
                        temp.TenNguoiDung = model.TenNguoiDung;
                        temp.DiaChi = model.DiaChi;
                        temp.PhoneNumber = model.PhoneNumber;
                        _db.SaveChanges();
                    }

                    return RedirectToAction("NhanVienQuanLy");
                }
                AddErrors(result);
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/AddNhanVien
        [AllowAnonymous]
        public ActionResult AddNhanVien()
        {
            var currentUser = _context.Users.Find(User.Identity.GetUserId());
            var infoUser = _db.AspNetUsers.Find(currentUser.Id);

            //Lấy danh sách khóa ngoại
            List<AltListNguoiDung> KhachHangs = new List<AltListNguoiDung>();
            var users = _context.Users.ToList();
            foreach (var item in users)
            {
                if (item.Roles.ToList()[0].RoleId == "khachhang")
                {
                    var user = _db.AspNetUsers.Where(p => p.Id == item.Id).FirstOrDefault();
                    if (user != null)
                    {
                        AltListNguoiDung account = new AltListNguoiDung()
                        {
                            Id = user.Id,
                            TenNguoiDung = user.TenNguoiDung,
                            Email = user.Email,
                            PhoneNumber = user.PhoneNumber,
                            DonVi_ID = user.DonVi_ID,
                            EmailConfirmed = user.EmailConfirmed,
                            TwoFactor = user.TwoFactorEnabled
                        };

                        KhachHangs.Add(account);
                    }
                }
            }

            //Tạo list cho View
            if(currentUser.Roles.ToList()[0].RoleId == "khachhang")
            {
                ViewBag.KhachHang_ID = new SelectList(KhachHangs, "Id", "TenNguoiDung", currentUser.Id);
            }
            else
            {
                ViewBag.KhachHang_ID = new SelectList(KhachHangs, "Id", "TenNguoiDung");
            }
            

            return View();
        }

        //
        // POST: /Account/AddNhanVien
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> AddNhanVien(AddNhanVienViewModel model)
        {
            var currentUser = _context.Users.Find(User.Identity.GetUserId());
            var infoUser = _db.AspNetUsers.Find(currentUser.Id);

            //Lấy danh sách khóa ngoại
            List<AltListNguoiDung> KhachHangs = new List<AltListNguoiDung>();
            var users = _context.Users.ToList();
            foreach (var item in users)
            {
                if (item.Roles.ToList()[0].RoleId == "khachhang")
                {
                    var user = _db.AspNetUsers.Where(p => p.Id == item.Id).FirstOrDefault();
                    if (user != null)
                    {
                        AltListNguoiDung account = new AltListNguoiDung()
                        {
                            Id = user.Id,
                            TenNguoiDung = user.TenNguoiDung,
                            Email = user.Email,
                            PhoneNumber = user.PhoneNumber,
                            DonVi_ID = user.DonVi_ID,
                            EmailConfirmed = user.EmailConfirmed,
                            TwoFactor = user.TwoFactorEnabled
                        };

                        KhachHangs.Add(account);
                    }
                }
            }

            //Tạo list cho View
            if (currentUser.Roles.ToList()[0].RoleId == "khachhang")
            {
                ViewBag.KhachHang_ID = new SelectList(KhachHangs, "Id", "TenNguoiDung", currentUser.Id);
            }
            else
            {
                ViewBag.KhachHang_ID = new SelectList(KhachHangs, "Id", "TenNguoiDung", model.KhachHang_ID);
            }


            model.Role = "Nhân viên";

            if (ModelState.IsValid)
            {
                var user = new Web.Models.ApplicationUser { UserName = model.Email, Email = model.Email };

                var result = await UserManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    //Assign Role to user Here 
                    await this.UserManager.AddToRoleAsync(user.Id, model.Role);

                    var callbackUrl = await generateConfirmAccountEmail(user.Id);

#if DEBUG
                    TempData["ViewBagLink"] = callbackUrl;
#endif

                    ViewBag.Message = "Vui lòng xác nhận Email trước khi đăng nhập.";

                    var temp = _db.AspNetUsers.Where(p => p.Id == user.Id).FirstOrDefault();
                    if (temp != null)
                    {
                        temp.TenNguoiDung = model.TenNguoiDung;
                        temp.DiaChi = model.DiaChi;
                        temp.PhoneNumber = model.PhoneNumber;
                        temp.Fax = model.Fax;
                        temp.DonVi_ID = model.DonVi_ID;
                        temp.KhachHang_ID = model.KhachHang_ID;
                        _db.SaveChanges();
                    }

                    return View("NhanVien");
                }
                AddErrors(result);
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/ConfirmEmail
        [AllowAnonymous]
        public async Task<ActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return View("Error");
            }
            var result = await UserManager.ConfirmEmailAsync(userId, code);
            return View(result.Succeeded ? "ConfirmEmail" : "Error");
        }

        //
        // GET: /Account/ForgotPassword
        [AllowAnonymous]
        public ActionResult ForgotPassword()
        {
            return View();
        }

        //
        // POST: /Account/ForgotPassword
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await UserManager.FindByNameAsync(model.Email);
                if (user == null || !(await UserManager.IsEmailConfirmedAsync(user.Id)))
                {
                    // Don't reveal that the user does not exist or is not confirmed
                    return View("ForgotPasswordConfirmation");
                }

                // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=320771
                // Send an email with this link
                string code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
                var callbackUrl = Url.Action("ResetPassword", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);

                Emailer emailer = new Emailer();
                emailer.sendEmail(model.Email, "Reset Password", "Please reset your password by clicking <a href=\"" + callbackUrl + "\">here</a>");

                return RedirectToAction("ForgotPasswordConfirmation", "Account");
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/ForgotPasswordConfirmation
        [AllowAnonymous]
        public ActionResult ForgotPasswordConfirmation()
        {
            return View();
        }

        //
        // GET: /Account/ResetPassword
        [AllowAnonymous]
        public ActionResult ResetPassword(string code)
        {
            return code == null ? View("Error") : View();
        }

        //
        // POST: /Account/ResetPassword
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            var user = await UserManager.FindByNameAsync(model.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return RedirectToAction("ResetPasswordConfirmation", "Account");
            }
            var result = await UserManager.ResetPasswordAsync(user.Id, model.Code, model.Password);
            if (result.Succeeded)
            {
                return RedirectToAction("ResetPasswordConfirmation", "Account");
            }
            AddErrors(result);
            return View();
        }

        //
        // GET: /Account/ResetPasswordConfirmation
        [AllowAnonymous]
        public ActionResult ResetPasswordConfirmation()
        {
            return View();
        }

      

        //
        // GET: /Account/SendCode
        [AllowAnonymous]
        public async Task<ActionResult> SendCode(string returnUrl, bool rememberMe)
        {
            var userId = await SignInManager.GetVerifiedUserIdAsync();
            if (userId == null)
            {
                return View("Error");
            }
            var userFactors = await UserManager.GetValidTwoFactorProvidersAsync(userId);

            // If there's only one, don't make the user select it
            if (userFactors.Count == 1)
            {
                return RedirectToAction("VerifyCode", new { 
                    Provider = userFactors[0], 
                    ReturnUrl = returnUrl, 
                    RememberMe = rememberMe });
            }

            var factorOptions = userFactors.Select(
                purpose => new SelectListItem { Text = purpose, Value = purpose }).ToList();

            return View(new SendCodeViewModel { 
                Providers = factorOptions, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }

        //
        // POST: /Account/SendCode
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SendCode(SendCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }

            // Generate the token and send it
            if (!await SignInManager.SendTwoFactorCodeAsync(model.SelectedProvider))
            {
                return View("Error");
            }
            return RedirectToAction("VerifyCode", new { Provider = model.SelectedProvider, ReturnUrl = model.ReturnUrl, RememberMe = model.RememberMe });
        }

      
        //
        // POST: /Account/LogOff
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
            return RedirectToAction("Index", "Home");
        }


        public ActionResult Delete(string id)
        {
            var user = _context.Users.Find(id);

            _context.Users.Remove(user);

            _context.SaveChanges();

            if(user.Roles.ToList()[0].RoleId == "khachhang")
            {
                return RedirectToAction("KhachHang", "Account");
            }

            return RedirectToAction("Index", "Account");
        }

        public ActionResult DeleteNhanVien(string id)
        {
            var user = _context.Users.Find(id);

            _context.Users.Remove(user);

            _context.SaveChanges();

            return RedirectToAction("NhanVien", "Account");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_userManager != null)
                {
                    _userManager.Dispose();
                    _userManager = null;
                }

                if (_signInManager != null)
                {
                    _signInManager.Dispose();
                    _signInManager = null;
                }
            }

            base.Dispose(disposing);
        }

        #region Helpers
        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "XsrfId";

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction("Index", "Home");
        }

        internal class ChallengeResult : HttpUnauthorizedResult
        {
            public ChallengeResult(string provider, string redirectUri)
                : this(provider, redirectUri, null)
            {
            }

            public ChallengeResult(string provider, string redirectUri, string userId)
            {
                LoginProvider = provider;
                RedirectUri = redirectUri;
                UserId = userId;
            }

            public string LoginProvider { get; set; }
            public string RedirectUri { get; set; }
            public string UserId { get; set; }

            public override void ExecuteResult(ControllerContext context)
            {
                var properties = new AuthenticationProperties { RedirectUri = RedirectUri };
                if (UserId != null)
                {
                    properties.Dictionary[XsrfKey] = UserId;
                }
                context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
            }
        }
        #endregion


        //API SUPPORT
        public JsonResult GetAccountByRole(string RoleId)
        {
            List<AltListNhanVien> model = new List<AltListNhanVien>();

            var users = _context.Users.ToList();

            foreach (var item in users)
            {
                if(item.Roles.ToList()[0].RoleId == RoleId)
                {
                    var user = _db.AspNetUsers.Where(p => p.Id == item.Id).FirstOrDefault();
                    if(user != null)
                    {
                        AltListNhanVien account = new AltListNhanVien()
                        {
                            Id = user.Id,
                            TenNguoiDung = user.TenNguoiDung,
                            Email = user.Email,
                            PhoneNumber = user.PhoneNumber,
                            DiaChi = user.DiaChi,
                            DonVi_ID = user.DonVi_ID,
                            KhachHang_ID = user.KhachHang_ID,
                            EmailConfirmed = user.EmailConfirmed,
                            TwoFactor = user.TwoFactorEnabled
                        };

                        model.Add(account);
                    }
                }
            }

            return Json(model, JsonRequestBehavior.AllowGet);
        }

        public string GetRoleByAccount(string Id)
        {
            var user = _context.Users.Where(p => p.Id == Id).FirstOrDefault();

            if (user != null)
            {
                return user.Roles.ToList()[0].RoleId;
            }

            return null;
        }


        //public JsonResult GetNhanVienByKhachHang(string id)
        //{
        //    List<AltListNhanVien> model = new List<AltListNhanVien>();

        //    var users = _context.Users.ToList();

        //    foreach (var item in users)
        //    {
        //        if()
        //    }
        //}
    }
}
