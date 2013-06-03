//添加鼠标滚轴事件，来源于网络
/**
 * 
 * credits for this plugin go to brandonaaron.net
 * 	
 * unfortunately his site is down
 * 
 * @param {Object} up
 * @param {Object} down
 * @param {Object} preventDefault
 */
jQuery.fn.extend({
	mousewheel: function(up, down, preventDefault) {
		return this.hover(
			function() {
				jQuery.event.mousewheel.giveFocus(this, up, down, preventDefault);
			},
			function() {
				jQuery.event.mousewheel.removeFocus(this);
			}
		);
	},
	mousewheeldown: function(fn, preventDefault) {
		return this.mousewheel(function(){}, fn, preventDefault);
	},
	mousewheelup: function(fn, preventDefault) {
		return this.mousewheel(fn, function(){}, preventDefault);
	},
	unmousewheel: function() {
		return this.each(function() {
			jQuery.event.mousewheel.removeFocus(this);
		});
	},
	unmousewheeldown: jQuery.fn.unmousewheel,
	unmousewheelup: jQuery.fn.unmousewheel
});


jQuery.event.mousewheel = {
	giveFocus: function(el, up, down, preventDefault) {
		if (el._handleMousewheel) jQuery(el).unmousewheel();
		
		if (preventDefault == window.undefined && down && down.constructor != Function) {
			preventDefault = down;
			down = null;
		}
		
		el._handleMousewheel = function(event) {
			if (!event) event = window.event;
			if (preventDefault)
				if (event.preventDefault) event.preventDefault();
				else event.returnValue = false;
			var delta = 0;
			if (event.wheelDelta) {
				delta = event.wheelDelta/120;
				if (window.opera) delta = -delta;
			} else if (event.detail) {
				delta = -event.detail/3;
			}
			if (up && (delta > 0 || !down))
				up.apply(el, [event, delta]);
			else if (down && delta < 0)
				down.apply(el, [event, delta]);
		};
		
		if (window.addEventListener)
			window.addEventListener('DOMMouseScroll', el._handleMousewheel, false);
		window.onmousewheel = document.onmousewheel = el._handleMousewheel;
	},
	
	removeFocus: function(el) {
		if (!el._handleMousewheel) return;
		
		if (window.removeEventListener)
			window.removeEventListener('DOMMouseScroll', el._handleMousewheel, false);
		window.onmousewheel = document.onmousewheel = null;
		el._handleMousewheel = null;
	}
};
$(function($){
	$.ajaxSetup({
		contentType : "application/x-www-form-urlencoded;charset=utf-8",
		cache : false,
		complete : function(XHR, TS) {
			var resText = XHR.responseText;
//			console.log(resText);
//			if(resText === ""){
//				alert("您的登录已超时, 请点确定后重新登录！");
//				top.location.href="http://"+window.location.host+"/neo-service";
//			}
		}
	});
});

var cookie_opt = {
	/**
	 * 写cookie
	 * 
	 * @param name,value
	 */
	setCookie : function(name, value) {
		var _Days = 1;// 此cookie将被保存1天
		var _exp = new Date();
		_exp.setTime(_exp.getTime() + _Days * 24 * 60 * 60 * 1000);// 以毫秒设置Date对象
		document.cookie = name + "=" + escape(value) + ";expires="
				+ _exp.toGMTString();
	},
	/**
	 * 读cookie
	 * 
	 * @param name
	 */
	getCookie : function(name) {
		var _arr = document.cookie.match(new RegExp("(^|)" + name
				+ "=([^;]*)(;|$)"));
		if (_arr !== null) {
			return unescape(_arr[2]);
		}
		return null;
	},
	/**
	 * 删cookie
	 * 
	 * @param name
	 */
	delCookie : function(name) {
		var _exp = new Date();
		_exp.setTime(_exp.getTime() - 1);
		var _cval = this.getCookie(name);
		if (_cval !== null) {
			document.cookie = name + "=" + null + ";expires="
					+ _exp.toGMTString();
		}
	}
};// cookie操作方法集

var validateReg = {
	groupAddName : /^(\w|[\u4E00-\u9FA5\_]){2,20}$/,// 组名
	groupAddDesc : /^(\w|[\u4E00-\u9FA5\_\ ]|\s){2,128}$/,// 组描述
	name : /^[a-zA-Z][a-zA-Z0-9\_]{3,19}$/,// 用户名
	userRealname : /^(\w|[\u4E00-\u9FA5\_]|\s){2,20}$/,// 用户真实姓名
	userEmail : /^[a-zA-Z0-9]([a-zA-Z0-9\.]*[-_]?[a-zA-Z0-9]+)*@([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)+[\.][a-zA-Z]{2,3}([\.][a-zA-Z]{2})?$/,// 邮箱
	userPassWd : /^.{6,18}$/, // 用户初始密码
	verify : /^.{1,4}$/,
	roleName : /^[a-zA-Z][a-zA-Z0-9\_]{1,19}$/, // 角色名称
	ip : /^([1-9]|[1-9]\d|1\d{2}|2[0-1]\d|22[0-3])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/,
	int : /^[1-9][0-9]*$/, //正整数
	// 虚拟机
	intNumber : /^(-|\+)?\d+$/,
	pin : /^.{4,16}$/,
	
};// 页面输入正则表达式对象，有待添加

var validateMsg = {
	groupAddName : '请勿输入除英文字母（不区分大小写）、下划线、数字和汉字之外的字符，字符个数不小于2且不大于20。',
	groupAddDesc : '请勿输入除英文字母（区分大小写）、空格、下划线、数字和汉字之外的字符，字符个数不小于2且不大于128。',
	name : '请勿输入除英文字母（不区分大小写）、数字和下划线之外的字符，且必须以英文字母（不区分大小写）开头，字符个数不小于4且不大于20。',
	userRealname : '请勿输入除英文字母（区分大小写）、空格（字符串首部和尾部的空格除外）、下划线、数字和汉字之外的字符，字符个数不小于2且不大于20。',
	userEmail : '请输入有效的邮件地址，格式为：邮箱名@服务器名.域名，其中邮箱名、服务器名和域名均由英文字母（不区分大小写）、数字、减号、点和下划线组成，其首尾的字符不能为减号、点和下划线。',
	userPassWd : '请输入长度不少于6且不大于18的密码。',
	equalTo : '您两次输入的字符不相同，请重新输入。',
	roleName : '请勿输入除英文字母（不区分大小写）、数字和下划线之外的字符，且必须以英文字母（不区分大小写）开头，字符个数不小于2且不大于20。',
	hostBalance : '请输入不小于50且不大于100的整数。',
	ip : '请输入有效的IP地址',
	vlanId : '请输入不小于1且不大于4095的整数。',
	rangedSize : '请输入不小于2且不大于16777214的整数。',
	netMask : '请输入有效的子网掩码，格式如255.255.252.0等。',
	pin : '请输入长度不小于4且不大于16的任意字符。',
	//用户配额
	quotaCpu :'请输入不小于0且不大于1000000的整数。',
	quotaMem : '请输入不小于256且不大于1048576的整数。',
	quotaDisk : '请输入不小于0且不大于2048的整数。',
	quotaVcpu : '请输入不小于0且不大于10000的整数。',
	quotaVM : '请输入不小于0且不大于10000的整数。',

	// 虚拟机
	vmNum : '请输入不小于2且不大于50的整数。',
	vmCpuNum : '请输入不小于1且不大于64的整数。',
	vmCpuSingle : '请输入不小于1且不大于3200的整数。',
	vmMem : '请输入不小于16且不大于32768的整数。',
	vmBandWidth : '请输入单位选择为Kbps时范围为1到1000、Mbps时范围为1到1000、Gbps时范围为1到10的整数。',
	
	int : '请填入合法的时间值。'

};// 页面输入提示信息对象，和正则表达式对象属性对应，有待添加

var validateFunc = {
	vnetVlanId : function(value) {
		return /^[1-9]\d*$/.test(value) && parseInt(value) > 0
				&& parseInt(value) < 4096;
	},
	vnetSize : function(value) {
		return /^[0-9]*[0-9][0-9]*$/.test(value) && parseInt(value) < 16777215
				&& parseInt(value) > 1;
	},
	netMask : function(value) {
		var IPPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
		if (!IPPattern.test(value)) {
			return false;
		}
		var IPArray = value.split(".");
		var ip1 = parseInt(IPArray[0]);
		var ip2 = parseInt(IPArray[1]);
		var ip3 = parseInt(IPArray[2]);
		var ip4 = parseInt(IPArray[3]);
		if (ip1 < 0 || ip1 > 255 || ip2 < 0 || ip2 > 255 || ip3 < 0
				|| ip3 > 255 || ip4 < 0 || ip4 > 255) {
			return false;
		}
		var ip_binary = (ip1 + 256).toString(2).substring(1)
				+ (ip2 + 256).toString(2).substring(1)
				+ (ip3 + 256).toString(2).substring(1)
				+ (ip4 + 256).toString(2).substring(1);
		if (-1 != ip_binary.indexOf("01")) {
			return false;
		}
		return true;
	}
};

var commonOpt = {
	/**
	 * 错误信息处理
	 * 
	 * @param response,ajax的返回值
	 * @return _errorObj：_errorObj.errCode,错误码，_errorObj.errMsg，错误信息
	 */
	cs2c_error : function(response) {
		var _errorObj = {
			'errCode' : $.parseJSON(response.responseText).error.code,
			'errMsg' : $.parseJSON(response.responseText).error.msg
		};
		return _errorObj;
	},

	/**
	 * 权限信息映射
	 */
	auth_formatter : function(permission) {
		var returnVal = null;

		switch (permission) {
		case 'PERMISSION_BACKUP_RECOVER':
			returnVal = "备份与恢复权限";
			break;
		case 'PERMISSION_SUPER_ADMIN':
			returnVal = "超级管理员权限";
			break;
		case 'PERMISSION_HOST_MANAGE':
			returnVal = "主机管理权限";
			break;
		case 'PERMISSION_MONITOR_LOG':
			returnVal = "预警信息权限";
			break;
		case 'PERMISSION_LOGAUDIT':
			returnVal = "日志与审计权限";
			break;
		case 'PERMISSION_USER_MANAGE':
			returnVal = "用户管理权限";
			break;
		case 'PERMISSION_VM_MANAGE':
			returnVal = "虚拟机管理权限";
			break;
		case 'PERMISSION_STORAGE_MANAGE':
			returnVal = "存储管理权限";
			break;
		case 'PERMISSION_MONITOR_STATS':
			returnVal = "统计报表权限";
			break;
		case 'PERMISSION_IMAGE_MANAGE':
			returnVal = "映像管理权限";
			break;
		case 'PERMISSION_TOPOLOGY':
			returnVal = "网络拓扑权限";
			break;
		case 'PERMISSION_BALANCE_RECORD':
			returnVal = "负载均衡配置权限";
			break;
		case 'PERMISSION_HOSTCLUSTER_MANAGE':
			returnVal = "主机资源池管理权限";
			break;
		case 'PERMISSION_VNET_MANAGE':
			returnVal = "虚拟网络管理权限";
			break;
		defaul: returnVal = "未知";
	}

	return returnVal;
},
	getMainHeight : function() {
		var height = $("body").height() - 108;
		$(".main").height(height);
	},
	getMiddleWidth : function() {
		
		var width = $("body").width() - ($(".left").width() ? 200 : 0)
				- ($(".right").width() ? 200 : 0) - 2;
		$(".middle").width(width);
		var height = $(".main").height() - 42;
		$(".content").height(height);
		this.getDialogSize();
	},
	getDialogSize : function() {
		var height=$(".content").height() - 85;
		$(".move").height(height);
		$(".move_shut").height(height);
		$(".move_opt").height(height-60);
	},
	/*针对tab控件渲染滚动条*/
//	createTabScrollBar : function(){
//		var tabContentHeight = 0;
//		tabContentHeight = $('.move_opt').height() - 34;//此处为tabtitle的高+线的宽度，如果变化需更改
//		console.log(tabContentHeight);
//		if($('.cs2c_tab').find('.cs2c_scrollbar').length >0){
//			$('.cs2c_scrollbar').height(tabContentHeight);
//		}else{
//			$('.cs2c_tab_ctx').addClass('scrollbar_content');
//			$('.cs2c_tab_ctx').wrap('<div class="cs2c_scrollbar" style="height:'+tabContentHeight+'px"></div>');
//			$('.cs2c_tab_ctx').after('<div class="scrollbar_draggable"><div class="draggable"></div></div>');
//		}
//		this.scrollBar(tabContentHeight,'cs2c_tab');
//	},
	
	/*针对表格控件渲染滚动条*/
	createDatagridScrollBar : function(){
		var datagridContentHeight = 0,
			datagridPtab = $('.cs2c_datagrid').parents().filter('.cs2c_tab').length,//datagrid外是否被tab包裹
			datagridToolBar = $('.cs2c_datagrid').find('.datagrid_toolbar').length,//datagrid是否有toolbar
			otherHeight = 70;//28title+42paper
		if(datagridPtab){
			otherHeight += 54;//34title+20padding
		}
		if(datagridToolBar){
			otherHeight += 55;//27height+16padding+2line
		}
		datagridContentHeight = $('.content').height() - otherHeight;//此处为toolbar+title+pager的高度，如有改变，要调整
		if($('.datagrid_wrap').find('.cs2c_scrollbar').length >0){
			$('.cs2c_scrollbar').height(datagridContentHeight);
		}else{
			$('.datagrid_body').addClass('scrollbar_content');
			datagridPtab?$('.datagrid_body').width($('.content').width()-32):$('.datagrid_body').width($('.content').width()-12);
			//console.log($('.datagrid_body').width());
			$('.datagrid_body').wrap('<div class="cs2c_scrollbar" style="height:'+datagridContentHeight+'px"></div>');
			$('.datagrid_body').after('<div class="scrollbar_draggable"><div class="draggable"></div></div>');
		}
		this.scrollBar(datagridContentHeight,'datagrid_wrap');
	},
	
	/*滚动条*/
	scrollBar : function(dragContainerHeight,parentEl){
		var contentObj = $('.'+parentEl+' .scrollbar_content'),//内容
		scrollObj = $('.'+parentEl+' .scrollbar_draggable'),//滚动容器
		dragObj = $('.'+parentEl+' .draggable'),//滚动块
		dragContainer = $('.'+parentEl+' .cs2c_scrollbar'),//最外层
		dragObj_H = 0;//滚动块高度
		diff = 0;//内外高度差
		var posY,tempY = 0,flag = 0, ctop = 0;
		scrollObj.height(dragContainerHeight-20);//滚动容器高度 = 最外层高度暂时
//		console.log(contentObj.innerHeight());
//		console.log(dragContainerHeight);
		diff = parseInt(contentObj.innerHeight()-dragContainerHeight);//内外层高度差，>0出现滚动条，反之滚动条消失
		dragObj_H = dragContainerHeight-diff;
		if(dragObj_H>0){
			dragObj.height(dragObj_H);
		}else{
			dragObj.height(30);
		}
		if(diff > 0){
			var pxDraggable = parseInt(dragContainer.height()) - parseInt(dragObj.height());
			var pxUpWhenScrollMove = 10;
			var pxUpWhenMaskMove = pxUpWhenScrollMove * (diff/pxDraggable);
			scrollObj.show();
			$('.'+parentEl+'').find('.cs2c_scrollbar').mousewheel(function(event,scrolldata){
				if (scrolldata > 0 && parseInt(contentObj.css('top')) < 0){
					dragObj.stop(true, true).animate({top:'-='+pxUpWhenScrollMove+'px'}, 100);
					contentObj.stop(true, true).animate({top:'+='+pxUpWhenMaskMove+'px'},100,function(){
						if(parseInt(contentObj.css('top')) > 0 ) {
							dragObj.animate({top:'0px'},150);
							contentObj.css({top:0});
						}
					});
				} else if (scrolldata < 0 && parseInt(contentObj.css('top')) > -diff) {
					dragObj.stop(true, true).animate({top:'+='+pxUpWhenScrollMove+'px'}, 100);
					contentObj.stop(true, true).animate({top:'-='+pxUpWhenMaskMove+'px'},100,function(){
						if(parseInt(contentObj.css('top')) < -diff){
							contentObj.css({top:-diff});
							dragObj.animate({top:pxDraggable},150);
						}
					});
				}
			});

			$('.'+parentEl+'').find('.draggable').mousedown(function(event){
				if(!event) event = window.event; //IE
				posY = event.clientY - parseInt(dragObj.offset().top);
				ctop = parseInt(dragObj.offset().top); 
				document.onmousemove = function(event){
					if(!event) event = window.event;
					tempY = event.clientY - ctop;
					flag = parseInt(dragObj.css("top"))- tempY;//flag<0,往下拉，flag>0,往上拉
					dragObj.css('top',''+tempY+'px');
					contentObj.css({top:'+='+flag+'px'});
					if(flag>0 && parseInt(contentObj.css('top')) > 0){
							dragObj.css('top','0px');
							contentObj.css({top:0});
					} else if(flag<0 && parseInt(contentObj.css('top')) < -diff) {
						contentObj.css({top:-diff});
						dragObj.css({top:pxDraggable});
					}
				};
				document.onmouseup = function(event){
					document.onmousemove = null;
					document.onmouseup = null;
					flag = tempY+1;
				};	
			});
		} else {
			scrollObj.hide();
		}	
	},
	moniterVerifyInput : function(event){
		var p_x = $(event.currentTarget).position().top;
		var p_y = $(event.currentTarget).position().left+$(event.currentTarget).width() + 5;
		$('.validate_tip_1').css('left',p_y);
		$('.validate_tip_1').css('top',p_x);
		var inputval = $(event.currentTarget).val();
		if(inputval === ""){
			$('.validate_tip_1').find('p').text('必填项');
		}else{
			$('.validate_tip_1').find('p').text('请填入合法的时间值。');
		}
		inputval === ""?$('.validate_tip_1').show():$('.validate_tip_1').hide();
	},
	moniterVerify : function(obj){
		var p_x = obj.position().top;
		var p_y = obj.position().left+obj.width() + 5;
		$('.validate_tip_1').css('left',p_y);
		$('.validate_tip_1').css('top',p_x);
		var inputval = obj.val();
		$('.validate_tip_1').find('p').text('必填项');
		inputval === ""?$('.validate_tip_1').show():$('.validate_tip_1').hide();
		return inputval !== "";
	},
	moniterVerifyBlur : function(event){
		$('.validate_tip_1').hide();
	}
};// 公共方法集

var ukey_opt = {
		checkUkey : function(){//检测ukey是否插入，ret=5，未安装插件；ret=1，ukey插入，其他，未插入ukey
			var ret;
			try{
	            //plugin begin
	            if($.browser.mozilla){
	                    ukeyauth = document.getElementById('ukey_auth_ff');//firefox插件对象
	            } else if($.browser.msie){
	                    ukeyauth = ukey_auth;//IE插件对象
	            }
	            ret = ukeyauth.UkeyInit();
	            if(ret != 1){
	                    ukeyauth.UkeyFinish();
	                    ukeyauth.UkeyInit();
	            }
	            ret = ukeyauth.UkeyCheckOn();
	            return ret;
	    }
	    catch(e){
	            return ret=5;
	    }
	}
};//ukey操作方法集