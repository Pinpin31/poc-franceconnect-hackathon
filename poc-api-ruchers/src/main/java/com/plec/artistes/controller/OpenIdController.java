package com.plec.artistes.controller;

import org.mitre.openid.connect.model.OIDCAuthenticationToken;
import org.mitre.openid.connect.model.UserInfo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.JsonObject;

@Controller
@RequestMapping("/openid/")
public class OpenIdController {
	
	@RequestMapping(value="token", produces="application/json")
	@PreAuthorize("hasRole('ROLE_USER')")
	@ResponseBody
	public String getAccessToken() {
		
		Authentication auth =
				SecurityContextHolder.getContext().getAuthentication();
		if (auth instanceof OIDCAuthenticationToken) {
			String idToken = ((OIDCAuthenticationToken) auth).getIdTokenValue();
			String accessToken = ((OIDCAuthenticationToken) auth).getAccessTokenValue();
			JsonObject response = new JsonObject();
			response.addProperty("id_token", idToken);
			response.addProperty("access_token", accessToken);
			return response.toString();
		}
		
		return null;
		
	}
	
	@RequestMapping(value="userinfo", produces="application/json")
	@PreAuthorize("hasRole('ROLE_USER')")
	@ResponseBody
	public String getUserInfo() {
		
		Authentication auth =
				SecurityContextHolder.getContext().getAuthentication();
		if (auth instanceof OIDCAuthenticationToken) {
			UserInfo userInfo = ((OIDCAuthenticationToken) auth).getUserInfo();
			return userInfo.toJson().toString();
		}
		
		return null;
		
	}

}
