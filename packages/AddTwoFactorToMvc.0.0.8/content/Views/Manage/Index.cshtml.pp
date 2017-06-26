﻿@model $rootnamespace$.Models.IndexViewModel
@{
    ViewBag.Title = "Manage";
}

<h2>@ViewBag.Title.</h2>

<p class="text-success">@ViewBag.StatusMessage</p>
<div>
    <h4>Change your account settings</h4>
    <hr />
    <dl class="dl-horizontal">
        <dt>Password:</dt>
        <dd>
            [
            @if (Model.HasPassword)
            {
                @Html.ActionLink("Change your password", "ChangePassword")
            }
            else
            {
                @Html.ActionLink("Create", "SetPassword")
            }
            ]
        </dd>

		<br />
		<dt>
			Google Authenticator:
		</dt>
		<dd>
			@if (Model.IsGoogleAuthenticatorEnabled)
			{
				@Html.ActionLink("[Disable]", "DisableGoogleAuthenticator")
			}
			else
			{
				@Html.ActionLink("[Enable]", "EnableGoogleAuthenticator")
			}
		</dd>
	
    </dl>
	
	
</div>
