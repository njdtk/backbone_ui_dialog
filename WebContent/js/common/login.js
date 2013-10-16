$(function($) {
	loginVar.loginView.init();

});

var loginVar = {
	loginView : null,
	loginTab : null
//	valid : []

};

/**
 * login默认页
 */
loginVar.loginView = {
	init : function() {
		this.showLoginTab();
		$('#password,#verificationCode,#password2,#login_pin,#verificationCode_ukey').val('');
		$('#tab_login').children().eq(0).find('input').eq(0).focus();
		$("#verify_img").append(
				'<img src="' + window.location.protocol + '//' + window.location.host
						+ '/neo-service/verificationCode/authImg.jpg?timeamp=' + new Date().getTime()
						+ '" style="margin-top:5px"/>');
		$(".login_warp").height($("body").height() <= 560 ? 560 : $("body").height());
		$.getJSON(window.location.protocol + "//" + window.location.host
				+ "/neo-service/version", function(data) {
			localStorage.setItem('version',data.version);//版本信息
			localStorage.setItem('storage',data.storage);//存储类型
		});
		this.eventBind();
	},
	eventBind : function() {
		$("#common_submit").unbind("click");
		$("#common_submit").bind("click", _(function(e) {
			this.canLogin(e);
		}).bind(this));
		$("#verify_img").find('img').unbind("click");
		$("#verify_img").find('img').bind("click", _(function(e) {
			this.changeVerifyPicture('verify_img');
		}).bind(this));
		$('#name,#password,#verificationCode,#name2,#password2,#login_pin,#verificationCode_ukey').unbind('keypress');
		$('#name,#password,#verificationCode,#name2,#password2,#login_pin,#verificationCode_ukey').bind("keypress",
				_(function(event) {
					event = event || window.event;
					var targetId = $(event.target).parent().parent().parent().attr('id');
					var curKey = event.which;
					if (curKey === 13) {
						switch (targetId) {
						case 'common_tab':
							$("#common_submit").trigger('click');
							break;
						case 'ukey_tab':
							$("#ukey_submit").trigger('click');
							break;
						default:
							break;
						}
					}
				}).bind(this));
	},
	canLogin : function(e) {
		var logintype = e.target.id, url = window.location.protocol + "//" + window.location.host
				+ "/neo-service/login?method=login", loginUser = {};
		$("#common_tab #error_info,#ukey_tab #error_info_ukey").html('');
		switch (logintype) {
		case 'common_submit':
				$("#common_tab #error_info").html('加载中，请稍侯... ...');
				loginUser = {
					"name" : $("#common_tab #name").val(),
					"password" : $("#common_tab #password").val(),
					"verificationCode" : $("#verificationCode").val()
				};

				$.ajax({
					type : "post",
					contentType : "application/json",
					url : url,
					data : JSON.stringify(loginUser),
					success : _(
							function(data) {
								$.getJSON(window.location.protocol + "//" + window.location.host
										+ "/neo-service/users?method=getNavigatorBar", function(data) {
									/* 将登录用户基本信息放入浏览器会话存储中,需要有一个序列化与反序列化的过程，JSON.stringify将JSON对象转化成字符串，JSON.parse将json字符串转化为JSON对象 */
									localStorage.setItem('nav',JSON.stringify(data.navigatorBars));//过滤菜单
									localStorage.setItem('userInfo',JSON.stringify(data.user));//登录用户信息
									localStorage.setItem('permissionList',JSON.stringify(data.permissions));//登录用户权限信息
									top.location.href = window.location.protocol + "//" + window.location.host
											+ "/neo-service/index.html?timeamp=" + new Date().getTime();
								});
							}).bind(this),
					error : _(
							function(response) {
								this.changeVerifyPicture('verify_img');
								$("#common_tab #error_info").html(commonOpt.cs2c_error(response).errCode + commonOpt.cs2c_error(response).errMsg);
								$("#common_tab #password,#verificationCode").val("");
								switch ($.parseJSON(response.responseText).error.code) {
								case 11002://验证码错误
									$('#name').val()?$('#password').focus():$('#name').focus();
									break;
								case 30013:
									$('#name').focus();
									break;
								case 11004:
									$('#name').focus();
									break;
								default:
									break;
								}
								this.eventBind();
							}).bind(this)
				});
			break;
		case 'ukey_submit':
			var tempthis = this;
				$("#ukey_tab #error_info_ukey").html('加载中，请稍侯... ...');
				var ukeyflag = ukey_opt.checkUkey(), // 检测ukey是否插入
				pin = $('#ukey_tab #login_pin').val(), ret = 0, serverCert = null, randNum = null, username = null, dataPacket = null;
				switch (ukeyflag) {
				case 5:
					$('#ukey_submit').show();
					$('#ukey_login_load').hide();
					if ($.browser.msie) {
						$("#ukey_tab #error_info_ukey").html("请先下载并安装根证书，再刷新本页面安装控件。");
					} else if ($.browser.mozilla) {
						$("#ukey_tab #error_info_ukey").html('请安装浏览器安全控件。');
					}
					break;
				case 1:
					ret = ukeyauth.UkeyCheckAvailable(pin);// 检测pin码是否正确
					if (ret === -3) {
						$('#ukey_submit').show();
						$('#ukey_login_load').hide();
						$("#ukey_tab #login_pin,#verificationCode_ukey").val("");
						this.changeVerifyPicture('verify_ukey_img');
						$("#ukey_tab #error_info_ukey").html('您输入的pin码错误。注意，多次pin码输入错误可能导致您的USBkey被锁定，请确认后重新输入。');
						ukeyauth.UkeyFinish();
						return false;
					} else if (ret === 1) {
						$.getJSON(window.location.protocol + "//" + window.location.host + "/neo-service/login?method=getServerCert",
										function(data) {
											serverCert = data.serverCert;
											randNum = data.randNum;
											username = $("#ukey_tab #name2").val();
											if (serverCert == "" || serverCert == null) {
												$('#ukey_submit').show();
												$('#ukey_login_load').hide();
												$("#ukey_tab #login_pin,#verificationCode_ukey").val("");
												this.changeVerifyPicture('verify_ukey_img');
												$("#ukey_tab #error_info_ukey").html("服务器证书不存在，请确认auth-server开启后重试。");
												ukeyauth.UkeyFinish();
												return false;
											}
											ret = ukeyauth.UkeyCheckServerCert(serverCert);
											switch (ret) {
											case -1:
												$('#ukey_submit').show();
												$('#ukey_login_load').hide();
												ukeyauth.UkeyFinish();
												$("#ukey_tab #password2,#login_pin,#verificationCode_ukey").val("");
												tempthis.changeVerifyPicture('verify_ukey_img');
												$("#ukey_tab #error_info_ukey").html("检查服务器证书失败。");
												break;
											case -2:
												$('#ukey_submit').show();
												$('#ukey_login_load').hide();
												ukeyauth.UkeyFinish();
												$("#ukey_tab #password2,#login_pin,#verificationCode_ukey").val("");
												tempthis.changeVerifyPicture('verify_ukey_img');
												$("#ukey_tab #error_info_ukey").html("服务器证书已过期，请重新生成服务器证书后重试。");
												break;
											case 1:// 检测成功
												var result = ukeyauth.UkeyGenerateDataPacket(username, randNum);
												var tempflag = result.substring(0, 2);
												if (tempflag === '01') {
													dataPacket = result.substring(3);
													loginUser = {
														"name" : $("#ukey_tab #name2").val(),
														"password" : $("#ukey_tab #password2").val(),
														"verificationCode" : $("#ukey_tab #verificationCode_ukey").val(),
														"loginType" : 'ukey',
														"dataPacket" : dataPacket
													};
													$.ajax({
																// async:false,
																type : "post",
																contentType : "application/json",
																url : url,
																data : JSON.stringify(loginUser),
																success : _(
																		function(data) {

																			$.getJSON(window.location.protocol+ "//"+ window.location.host+ "/neo-service/users?method=getNavigatorBar",
																							function(data) {
																				                localStorage.setItem('nav',JSON.stringify(data.navigatorBars));
																								localStorage.setItem('userInfo',JSON.stringify(data.user));
																								localStorage.setItem('permissionList',JSON.stringify(data.permissions));
																								top.location.href = window.location.protocol+ "//"+ window.location.host+ "/neo-service/index.html?timeamp="+ new Date().getTime();
																							});
																		}).bind(this),
																error : _(
																		function(response) {
																			tempthis.changeVerifyPicture('verify_ukey_img');
																			$("#ukey_tab #error_info_ukey").html(commonOpt.cs2c_error(response).errCode + commonOpt.cs2c_error(response).errMsg);
																			$("#ukey_tab #password2,#verificationCode_ukey,#login_pin").val("");
																			switch ($.parseJSON(response.responseText).error.code) {
																			case 11002://验证码错误
																				$('#name2').val()?$('#password2').focus():$('#name2').focus();
																				break;
																			case 30013:
																				$('#name2').focus();
																				break;
																			case 11004:
																				$('#name2').focus();
																				break;
																			default:
																				break;
																			}
																		}).bind(this)
															});
												} else if (tempflag === '02') {
													ukeyauth.UkeyFinish();
													$("#ukey_tab #password2,#login_pin,#verificationCode_ukey").val("");
													tempthis.changeVerifyPicture('verify_ukey_img');
													$("#ukey_tab #error_info_ukey").html("没有检查到USBkey，请插入USBkey后重试。注意，如果您已经插入USBkey，请确认您的USBkey有无损坏或者与计算机是否正常连接后再次尝试。");
												} else {
													ukeyauth.UkeyFinish();
													$("#ukey_tab #password2,#login_pin,#verificationCode_ukey").val("");
													tempthis.changeVerifyPicture('verify_ukey_img');
													$("#ukey_tab #error_info_ukey").html("生成数据包出错。");
												}
												break;
											default:
												$('#ukey_submit').show();
												$('#ukey_login_load').hide();
												ukeyauth.UkeyFinish();
												$("#ukey_tab #password2,#login_pin,#verificationCode_ukey").val("");
												tempthis.changeVerifyPicture('verify_ukey_img');
												$("#ukey_tab #error_info_ukey").html("检查服务器证书错误。");
												break;
											}
										});
					} else {
						$("#ukey_tab #password2,#login_pin,#verificationCode_ukey").val("");
						tempthis.changeVerifyPicture('verify_ukey_img');
						$("#ukey_tab #error_info_ukey").html('没有检查到USBkey，请插入USBkey后重试。注意，如果您已经插入USBkey，请确认您的USBkey有无损坏，与计算机是否正常连接，或者您的USBkey是否被初始化后再次尝试。');
						ukeyauth.UkeyFinish();
						break;
					}

					break;
				default:
					$("#ukey_tab #password2,#login_pin,#verificationCode_ukey").val("");
					this.changeVerifyPicture('verify_ukey_img');
					$("#ukey_tab #error_info_ukey").html('请插入USBkey。');
					ukeyauth.UkeyFinish();
					return;
					break;
				}
			break;
		default:
			break;
		}
	},
	showLoginTab : function() {
		$('.hide').show();
		if (!loginVar.loginTab) {
			loginVar.loginTab = new Cs2c_Tab({
				tab_id : 'tab_login',
				tabTitles : [ '普通用户登录', '多因子认证登录' ], 
				height : 300
			}).render();
		}
		loginVar.loginTab.tabBtnAction = _(function(index) {
			this.loginTabAction(index);
		}).bind(this);

	},
	loginTabAction : function(index) {
		switch (index) {
		case 0:
			$("#common_tab #name,#password,#verificationCode").val("");
			$('#tab_login').children().eq(0).find('input').eq(0).focus();
			$("#verify_img").find('img').attr("src","" + window.location.protocol + "//" + window.location.host
							+ "/neo-service/verificationCode/authImg.jpg?timeamp=" + new Date().getTime() + "");
			break;
		case 1:
			$("#ukey_submit").unbind("click");
			$("#ukey_submit").bind("click", _(function(e) {
				this.canLogin(e);
			}).bind(this));
			$("#verify_ukey_img").find('img').unbind("click");
			$("#verify_ukey_img").find('img').bind("click", _(function(e) {
				this.changeVerifyPicture('verify_ukey_img');
			}).bind(this));
			$("#ukey_tab #name2,#password2,#verificationCode_ukey,#login_pin").val("");
			$('#tab_login').children().eq(1).find('input').eq(0).focus();
			$("#verify_ukey_img").find('img').attr("src","" + window.location.protocol + "//" + window.location.host
							+ "/neo-service/verificationCode/authImg.jpg?timeamp=" + new Date().getTime() + "");
			break;
		default:
			break;
		}
	},
	checkPin : function(pin) {
		var ret = 0;
		ret = ukeyauth.UkeyCheckAvailable(pin);
		return ret;
	},
	changeVerifyPicture : function(id) {
		$('#' + id + '').find('img').attr('src',"" + window.location.protocol + "//" + window.location.host
						+ "/neo-service/verificationCode/authImg.jpg?timeamp=" + new Date().getTime() + "");
	}
};