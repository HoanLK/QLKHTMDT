using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Web.Models
{
    public class ExternalLoginConfirmationViewModel
    {
        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }

    public class ExternalLoginListViewModel
    {
        public string ReturnUrl { get; set; }
    }

    public class SendCodeViewModel
    {
        public string SelectedProvider { get; set; }
        public ICollection<System.Web.Mvc.SelectListItem> Providers { get; set; }
        public string ReturnUrl { get; set; }
        public bool RememberMe { get; set; }
    }

    public class VerifyCodeViewModel
    {
        [Required]
        public string Provider { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập Code")]
        [Display(Name = "Code")]
        public string Code { get; set; }
        public string ReturnUrl { get; set; }

        [Display(Name = "Remember this browser?")]
        public bool RememberBrowser { get; set; }

        public bool RememberMe { get; set; }
    }

    public class ForgotViewModel
    {
        [Required(ErrorMessage = "Vui lòng nhập Email")]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }

    public class LoginViewModel
    {
        [Required(ErrorMessage = "Vui lòng nhập Email")]
        [Display(Name = "Email")]
        [EmailAddress(ErrorMessage = "Vui lòng nhập đúng Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập Mật khẩu")]
        [DataType(DataType.Password)]
        [Display(Name = "Mật khẩu")]
        public string Password { get; set; }

        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }
    }

    public class RegisterViewModel
    {
        [Required(ErrorMessage = "Vui lòng nhập Email")]
        [EmailAddress(ErrorMessage = "Vui lòng nhập đúng Email")]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập Tên người dùng")]
        [Display(Name = "Tên người dùng")]
        public string TenNguoiDung { get; set; }

        [Display(Name = "Địa chỉ")]
        public string DiaChi { get; set; }

        [Display(Name = "Điện thoại")]
        public string PhoneNumber { get; set; }

        [Display(Name = "Fax")]
        public string Fax { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn Đơn vị")]
        [Display(Name = "Đơn vị")]
        public string DonVi_ID { get; set; }

        [Display(Name = "Khách hàng")]
        public string KhachHang_ID { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn Quyền")]
        [Display(Name = "Role")]
        public string Role { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập Mật khẩu")]
        [StringLength(100, ErrorMessage = "Mật khẩu phải nhiều hơn 6 ký tự", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Mật khẩu")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Xác nhận mật khẩu")]
        [Compare("Password", ErrorMessage = "Không khớp với mật khẩu")]
        public string ConfirmPassword { get; set; }
    }

    public class AddNhanVienViewModel
    {
        [Required(ErrorMessage = "Vui lòng nhập Email")]
        [EmailAddress(ErrorMessage = "Vui lòng nhập đúng Email")]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập Tên người dùng")]
        [Display(Name = "Tên người dùng")]
        public string TenNguoiDung { get; set; }

        [Display(Name = "Địa chỉ")]
        public string DiaChi { get; set; }

        [Display(Name = "Điện thoại")]
        public string PhoneNumber { get; set; }

        [Display(Name = "Fax")]
        public string Fax { get; set; }

        [Display(Name = "Đơn vị")]
        public string DonVi_ID { get; set; }

        [Display(Name = "Khách hàng")]
        public string KhachHang_ID { get; set; }

        [Display(Name = "Role")]
        public string Role { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập Mật khẩu")]
        [StringLength(100, ErrorMessage = "Mật khẩu phải nhiều hơn 6 ký tự", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Mật khẩu")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Xác nhận mật khẩu")]
        [Compare("Password", ErrorMessage = "Không khớp với mật khẩu")]
        public string ConfirmPassword { get; set; }
    }

    public class ResetPasswordViewModel
    {
        [Required(ErrorMessage = "Vui lòng nhập Email")]
        [EmailAddress(ErrorMessage = "Vui lòng nhập đúng Email")]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập Mật khẩu")]
        [StringLength(100, ErrorMessage = "Mật khẩu phải nhiều hơn 6 ký tự", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Mật khẩu")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Xác nhận mật khẩu")]
        [Compare("Password", ErrorMessage = "Không khớp với mật khẩu")]
        public string ConfirmPassword { get; set; }

        public string Code { get; set; }
    }

    public class ForgotPasswordViewModel
    {
        [Required(ErrorMessage = "Vui lòng nhập Email")]
        [EmailAddress(ErrorMessage = "Vui lòng nhập đúng Email")]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }

    public class ResendValidationEmailViewModel
    {
        public string UserId { get; set; }
        public string CallbackUrl { get; set; }
    }
}
