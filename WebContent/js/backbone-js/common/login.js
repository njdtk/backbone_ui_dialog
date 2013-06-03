$(function($) {
	loginVar.loginView.init();

});

var loginVar = {
	loginView : null,
	loginTab : null,
	valid : []

};

/**
 * login默认页
 */
loginVar.loginView = {
	init : function() {
		this.showLoginTab();

		$("#verify_img").append('<img src="'+window.location.protocol+'//'+window.location.host+'/neo-service/verificationCode/authImg.jpg?timeamp='+new Date().getTime()+'" />');


		loginVar.valid[0] = new validateBoxView({
			'id' : "name",
			'tipmsg' : validateMsg.name,
			'reqmsg' : '必填项',
			'reg_exp' : validateReg.name
		});
		loginVar.valid[1] = new validateBoxView({
			'id' : "password",
			'tipmsg' : validateMsg.userPassWd,
			'reqmsg' : '必填项',
			'reg_exp' : validateReg.userPassWd
		});
		loginVar.valid[2] = new validateBoxView({
			'id' : "verificationCode",
			'tipmsg' : "验证码格式有误",
			'reqmsg' : '必填项',
			'reg_exp' : validateReg.verify

		});
		loginVar.valid[3] = new validateBoxView({
			'id' : "name2",
			'tipmsg' : validateMsg.name,
			'reqmsg' : '必填项',
			'reg_exp' : validateReg.name
		});
		loginVar.valid[4] = new validateBoxView({
			'id' : "password2",
			'tipmsg' : validateMsg.userPassWd,
			'reqmsg' : '必填项',
			'reg_exp' : validateReg.userPassWd
		});
		loginVar.valid[5] = new validateBoxView({
			'id' : "verificationCode_ukey",
			'tipmsg' : "验证码格式有误",
			'reqmsg' : '必填项',
			'reg_exp' : validateReg.verify
		});
		loginVar.valid[6] = new validateBoxView({
			'id' : "login_pin",
			'tipmsg' : validateMsg.pin,
			'reqmsg' : '必填项',
			'reg_exp' : validateReg.pin

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
	},
	canLogin : function(e) {
		var logintype = e.target.id,
			url = "http://"+window.location.host+"/neo-service/login?method=login",
			loginUser = {};
		$("#common_tab #error_info").html('');
		switch(logintype){
		case 'common_submit':
			if(loginVar.valid[0].inputValidate()&&loginVar.valid[1].inputValidate()&&loginVar.valid[2].inputValidate()){
					loginUser = {
						"name" : $("#common_tab #name").val(),
						"password" : $("#common_tab #password").val(),
						"verificationCode":$("#verificationCode").val()
					};
				$.ajax({
				async:false,
				type : "post",
				contentType : "application/json",
				url : url,
				data : JSON.stringify(loginUser),
				success : _(function(data) {							
						cookie_opt.setCookie('username', loginUser.name);
						$.getJSON(window.location.protocol + "//"
								+ window.location.host + "/neo-service/users/"
								+ loginUser.name + "", function(data) {
							cookie_opt.setCookie('userid', data.uid);
							cookie_opt.setCookie('index', 'index');
							top.location.href="http://"+window.location.host+"/neo-service/index.html?timeamp="+new Date().getTime();
						});
				}).bind(this),
				error:_(function(response){
					this.changeVerifyPicture('verify_img');
					$("#common_tab #error_info").html(commonOpt.cs2c_error(response).errCode+":"+commonOpt.cs2c_error(response).errMsg);
					$("#common_tab #password,#verificationCode").val("");
					this.eventBind();
				}).bind(this)
			});
			}
			break;
		case 'ukey_submit':
			var tempthis = this;
			if(loginVar.valid[3].inputValidate()&&loginVar.valid[4].inputValidate()&&loginVar.valid[5].inputValidate()&&loginVar.valid[6].inputValidate()){
				var ukeyflag = ukey_opt.checkUkey(),//检测ukey是否插入
				pin = $('#ukey_tab #login_pin').val(),
				ret = 0,
				serverCert = null,
				randNum = null,
				username = null,
				dataPacket = null;
				switch(ukeyflag){
				case 5:
					if($.browser.msie){
		            	cs2c_Message("请先下载并安装根证书，再刷新本页面安装控件。");
		            }else if($.browser.mozilla){
		            	$("#ukey_tab #error_info_ukey").html('请安装浏览器安全控件。');
		            }
					break;
				case 1:
					ret = ukeyauth.UkeyCheckAvailable(pin);//检测pin码是否正确
					if(ret === -3){
						$("#ukey_tab #login_pin,#verificationCode_ukey").val("");
						this.changeVerifyPicture('verify_ukey_img');
						$("#ukey_tab #error_info_ukey").html('您输入的pin码错误。注意，多次pin码输入错误可能导致您的USBkey被锁定，请确认后重新输入。');
						ukeyauth.UkeyFinish();
						return false;
					}else if(ret === 1){
						$.getJSON(window.location.protocol + "//" + window.location.host + "/neo-service/login?method=getServerCert",function(data){
							serverCert = data.serverCert;
							randNum = data.randNum;
							username = $("#ukey_tab #name2").val();
							if(serverCert == "" || serverCert == null){
								$("#ukey_tab #login_pin,#verificationCode_ukey").val("");
								this.changeVerifyPicture('verify_ukey_img');
								$("#ukey_tab #error_info_ukey").html("服务器证书不存在，请确认auth-server开启后重试。");
								ukeyauth.UkeyFinish();
								return false;
							}
							ret = ukeyauth.UkeyCheckServerCert(serverCert);
							switch(ret){
							case -1:
								ukeyauth.UkeyFinish();
								$("#ukey_tab #password2,#login_pin,#verificationCode_ukey").val("");
								tempthis.changeVerifyPicture('verify_ukey_img');
								$("#ukey_tab #error_info_ukey").html("检查服务器证书失败。");
								break;
							case -2:
								ukeyauth.UkeyFinish();
								$("#ukey_tab #password2,#login_pin,#verificationCode_ukey").val("");
								tempthis.changeVerifyPicture('verify_ukey_img');
								$("#ukey_tab #error_info_ukey").html("服务器证书已过期，请重新生成服务器证书后重试。");
								break;
							case 1://检测成功
								var result = ukeyauth.UkeyGenerateDataPacket(username, randNum);
								var tempflag = result.substring(0,2);
								if(tempflag === '01'){
									dataPacket = result.substring(3);
									loginUser = {
											"name" : $("#ukey_tab #name2").val(),
											"password" : $("#ukey_tab #password2").val(),
											"verificationCode":$("#ukey_tab #verificationCode_ukey").val(),
											"loginType":'ukey',
											"dataPacket":dataPacket
										};
									$.ajax({
										async:false,
										type : "post",
										contentType : "application/json",
										url : url,
										data : JSON.stringify(loginUser),
										success : _(function(data) {							
												cookie_opt.setCookie('username', loginUser.name);
												$.getJSON(window.location.protocol + "//"
														+ window.location.host + "/neo-service/users/"
														+ loginUser.name + "", function(data) {
													cookie_opt.setCookie('userid', data.uid);
													cookie_opt.setCookie('index', 'index');
													top.location.href="http://"+window.location.host+"/neo-service/index.html?timeamp="+new Date().getTime();
												});
										}).bind(this),
										error:_(function(response){
											tempthis.changeVerifyPicture('verify_ukey_img');
											$("#ukey_tab #error_info_ukey").html(commonOpt.cs2c_error(response).errCode+":"+commonOpt.cs2c_error(response).errMsg);
											$("#ukey_tab #password2,#verificationCode_ukey,#login_pin").val("");
											tempthis.eventBind();
										}).bind(this)
									});
								}else if(tempflag === '02'){
									ukeyauth.UkeyFinish();
									$("#ukey_tab #password2,#login_pin,#verificationCode_ukey").val("");
									tempthis.changeVerifyPicture('verify_ukey_img');
									$("#ukey_tab #error_info_ukey").html("没有检查到USBkey，请插入USBkey后重试。注意，如果您已经插入USBkey，请确认您的USBkey有无损坏或者与计算机是否正常连接后再次尝试。");
								}else{
									ukeyauth.UkeyFinish();
									$("#ukey_tab #password2,#login_pin,#verificationCode_ukey").val("");
									tempthis.changeVerifyPicture('verify_ukey_img');
									$("#ukey_tab #error_info_ukey").html("生成数据包出错。");
								}
								break;
							default:
								ukeyauth.UkeyFinish();
							$("#ukey_tab #password2,#login_pin,#verificationCode_ukey").val("");
							tempthis.changeVerifyPicture('verify_ukey_img');
							$("#ukey_tab #error_info_ukey").html("检查服务器证书错误。");
								break;
							}
						});
					} else{
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
			}
			break;
		default:break;
		}
	},
	showLoginTab : function() {
		if (!loginVar.loginTab) {
			loginVar.loginTab = new Cs2c_Tab({
				tab_id : 'tab_login',
				// tabTitles : [ '普通用户登录' ],
				tabTitles : [ '普通用户登录', '多因子认证登录' ],
				height : 300,
			}).render();
		}
		loginVar.loginTab.tabBtnAction = _(function(index) {
			this.loginTabAction(index);
		}).bind(this);

	},
	loginTabAction : function(index){
		switch(index){
		case 0:
			$("#common_tab #name,#password,#verificationCode").val("");
			$("#verify_img").find('img').attr("src",""+window.location.protocol+"//"+window.location.host+"/neo-service/verificationCode/authImg.jpg?timeamp="+new Date().getTime()+"");
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
			$("#verify_ukey_img").find('img').attr("src",""+window.location.protocol+"//"+window.location.host+"/neo-service/verificationCode/authImg.jpg?timeamp="+new Date().getTime()+"");
			break;
		default:break;
		}
	},
	checkPin :function(pin){
            var ret = 0;
            ret = ukeyauth.UkeyCheckAvailable(pin);
            return ret;
	},
	changeVerifyPicture : function(id){
		$('#'+id+'').find('img').attr('src',""+window.location.protocol+"//"+window.location.host+"/neo-service/verificationCode/authImg.jpg?timeamp="+new Date().getTime()+"");
	}
};
