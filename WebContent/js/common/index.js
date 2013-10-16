var indexPage;
$(function($) {

	$(document).ready(function() {
		indexPage = new indexPageView();

	});
	$(window).resize(function() {
		if ($(".content_opt")) {

			ui.getHtmlSize();
			if (indexPage.list) {
				ui.getContentWidth(indexPage.list);
			}

		}
	});
});

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 左侧导航和右上角菜单栏渲染视图
 */
var indexPageView = Backbone.View.extend({

	el : $('body'),

	initialize : function() {

		new IndexRouter();
		Backbone.history.start();

		// 页面首次加载时，完成登录用户配额对象的构建
		commonOpt.getLoginUserQuota();
		this.render();
	},

	/**
	 * 绑定左侧导航栏事件处理
	 */
	render : function() {

		ui.getHtmlSize();

		this.formMenu();
		this.bindEvents();

		// 显示当前登录用户名
		$('#login_userName').html(commonOpt.getLoginUserInfo().userName);
	},
	/**
	 * 初始化左侧菜单
	 */
	formMenu : function() {
		var navArray = JSON.parse(localStorage.getItem('nav'));
		var nav_str = '';

		$.each(navArray, function(i, navObj) {
			var navstart_str = i === navArray.length - 1 ? '<li class="nav_first" id="menu_' + navObj.id + '"><div style="top:inherit;bottom:0;"><ul class="menu_list">'
					: '<li class="nav_first" id="menu_' + navObj.id + '"><div><ul class="menu_list">';
			var navend_str = '</ul></div></li>';
			var itemArray = [];

			$.each(navObj.menubars, function(i, item) {
				var navItem = '<li id="menu_' + item.id + '"><a href="#' + item.id + '">' + item.name + '</a></li>';
				itemArray.push(navItem);
			});
			var item_str = itemArray.join('');
			nav_str += navstart_str + item_str + navend_str;
		});

		$('.left_nav_block').find('ul').html(nav_str);
	},
	bindEvents : function() {
		$('.user_down').find('li').bind('click', _(function(e) {
			this.topClick(e);
		}).bind(this));
	},

	/**
	 * 退出登录
	 */
	logOut : function() {

		$.ajax({
			async : false,
			type : "delete",
			contentType : "application/json",
			url : window.location.protocol + "//" + window.location.host + "/neo-service/login?method=logout",
			success : function(data) {
				if (data.flag) {
					localStorage.clear();
					window.location.href = window.location.protocol + "//" + window.location.host + "/neo-service";
				}
			}
		});

	},

	/**
	 * 导航和首页右上角菜单栏操作处理
	 * 
	 * @param event
	 *            触发事件
	 * @param index
	 *            触发索引值
	 */
	topClick : function(event) {

		var menu_item = "";

		// 获取索引值
		if ($(event.currentTarget).attr('id')) {

			menu_item = $(event.currentTarget).attr('id').substring(5);
		} else {
			$(event.currentTarget).find('ul').show();
			return;
		}

		switch (menu_item) {
		case 'logout':
			this.logOut();
			break;
		case 'setUserInfo':
			$.get('res/common/top/setUserInfo.html', function(result) {
				$('#top-dialogs').html(result);
				ui.getContentWidth();
				userInfoSetView.initialize();
			});
			break;
		case 'setPasswd':
			$.get('res/common/top/setPasswd.html', function(result) {
				$('#top-dialogs').html(result);
				ui.getContentWidth();
				setPasswdView.initialize();
			});
			break;
		/*
		 * case 'authInfo': $.get('res/common/top/authorize.html',
		 * function(result) { $('#top-dialogs').html(result);
		 * ui.getContentWidth(); new authInfoDialogView(); }); break; case
		 * 'about': $.get('res/common/top/about.html', function(result) {
		 * $('#top-dialogs').html(result); ui.getContentWidth(); new
		 * aboutDialogView(); }); break;
		 */case 'help':
			break;
		default:
			break;
		}
	}
});

IndexRouter = Backbone.Router.extend({
	routes : {
		'' : 'index',
		'group' : 'group',
		'role' : 'role',
		'user' : 'user',
		'hostcluster' : 'hostcluster',
		'host' : 'host',
		'net' : 'net',
		'image' : 'image',
		'templet' : 'templet',
		'vim' : 'vim',
		'monitor' : 'monitor',// 实时监控
		'report' : 'report',// 统计报表
		'warninfo' : 'warninfo', // 预警信息
		'nettopo' : 'nettopo', // 网络拓扑
		'storageNode' : 'storageNode',// 存储节点
		'volume' : 'volume', // 存储服务卷管理
		'cluster' : 'cluster', // 集群管理
		'task' : 'task', // 任务管理
		'balance' : 'balance', // 负载均衡
		'download' : 'download', // 软件下载
		'audit' : 'audit',
		'ukey' : 'ukey',
		'seclogin' : 'seclogin',
		'ha' : 'ha',
		'vmtrace':'vmtrace',
		'vmsnapshot':'vmsnapshot',
		'volumelog':'volumelog'
	},

	index : function() {
		commonOpt.removeMessageTip();
		$.get('welcome.html', function(result) {
			$('.main').html(result);
		});
	},
	group : function() {
		commonOpt.removeMessageTip();
		$.get('res/group/html/group.html', function(result) {
			$('.main').html(result);
		});
	},
	role : function() {
		commonOpt.removeMessageTip();
		$.get('res/role/html/role.html', function(result) {
			$('.main').html(result);
		});
	},
	user : function() {
		commonOpt.removeMessageTip();
		$.get('res/user/html/user.html', function(result) {
			$('.main').html(result);
		});
	},
	hostcluster : function() {
		commonOpt.removeMessageTip();
		$.get('res/hostCluster/html/hostCluster.html', function(result) {
			$('.main').html(result);
		});

	},
	host : function() {
		commonOpt.removeMessageTip();
		$.get('res/host/host.html', function(result) {
			$('.main').html(result);
		});
	},
	net : function() {
		commonOpt.removeMessageTip();
		$.get('res/net/net.html', function(result) {
			$('.main').html(result);
		});
	},
	image : function() {
		commonOpt.removeMessageTip();
		$.get('res/image/html/image.html', function(result) {
			$('.main').html(result);
		});
	},
	templet : function() {
		commonOpt.removeMessageTip();
		$.get('res/templet/templet.html', function(result) {
			$('.main').html(result);
		});
	},
	vim : function() {
		commonOpt.removeMessageTip();
		$.get('res/vm/html/vm.html', function(result) {
			$('.main').html(result);
		});
	},
	monitor : function() {// 实时监控
		commonOpt.removeMessageTip();
		$.get('res/monitor_real/html/monitor_real.html', function(result) {
			$('.main').html(result);
		});
	},
	report : function() {// 统计报表
		commonOpt.removeMessageTip();
		$.get('res/monitor_real/html/monitor_report.html', function(result) {
			$('.main').html(result);
		});
	},
	warninfo : function() { // 预警信息
		commonOpt.removeMessageTip();
		$.get('res/monitor_real/html/monitor_warn.html', function(result) {
			$('.main').html(result);
		});
	},
	nettopo : function() { // 网络拓扑
		commonOpt.removeMessageTip();
		$.get('html/monitor/netTopo.html', function(result) {
			$('.main').html(result);
		});
	},
	storageNode : function() {// 存储节点
		commonOpt.removeMessageTip();
		$.get('res/storage_server/html/glusterserver.html', function(result) {
			$('.main').html(result);
		});
	},
	volume : function() { // 存储服务卷管理
		commonOpt.removeMessageTip();
		$.get('res/storage_volume/html/volume.html', function(result) {
			$('.main').html(result);
		});
	},
	cluster : function() { // 集群管理
		commonOpt.removeMessageTip();
		$.get('res/storage_gluster/storage_gluster.html', function(result) {
			$('.main').html(result);
		});
	},
	task : function() { // 任务管理
		commonOpt.removeMessageTip();
		$.get('res/storage_task/task.html', function(result) {
			$('.main').html(result);
		});
	},
	balance : function() { // 负载均衡
		commonOpt.removeMessageTip();
		$.get('res/sys_service/html/loadBalance.html', function(result) {
			$('.main').html(result);
		});
	},
	download : function() { // 软件下载
		commonOpt.removeMessageTip();
		$.get('res/sys_service/html/softwareDownload.html', function(result) {
			$('.main').html(result);
		});
	},
	audit : function() {
		commonOpt.removeMessageTip();
		$.get('res/security/html/sec_audit.html', function(result) {
			$('.main').html(result);
		});
	},
	ukey : function() {
		commonOpt.removeMessageTip();
		$.get('res/security/html/sec_ukeyManage.html', function(result) {
			$('.main').html(result);
		});
	},
	seclogin : function() {
		commonOpt.removeMessageTip();
		$.get('res/security/html/sec_ukeyLogin.html', function(result) {
			$('.main').html(result);
		});
	}
});

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 * 关于
 */
aboutDialogView = Backbone.View.extend({
	el : '#dialog_about',

	initialize : function() {

		_.bindAll(this);

		this.componentsInit();

		this.render();
	},

	render : function() {
		this.dialog.openDialog();
	},

	componentsInit : function() {

		this.dialog = new CS2C_Dialog({
			dialog_content_id : "dialog_about",
			title : "关于",
			width : 330,
			height : 220,
			closable : true
		});
	}
});

/*
 * 授权信息
 */
authInfoDialogView = Backbone.View.extend({
	el : '#dialog_authorize',

	initialize : function() {

		_.bindAll(this);

		this.componentsInit();

		this.render();
	},

	render : function() {
		this.dialog.openDialog();
	},

	componentsInit : function() {

		this.dialog = new CS2C_Dialog({
			dialog_content_id : "dialog_authorize",
			title : "授权信息",
			width : 300,
			height : 350,
			closable : true
		});
	}
});

/**
 * 用户信息设置
 */
var userInfoSetView = {
	el : '#dialog_userInfo',

	initialize : function() {
		_.bindAll(this, 'render');

		this.createComps();

		this.render();

		this.bindEvents();
	},

	/**
	 * 创建所需组件
	 */
	createComps : function() {

		// 创建对话框
		if ($(this.el).parent().parent().attr("class") !== "cs2c_dialog") {
			this.dialog_userInfo = new CS2C_Dialog({
				dialog_content_id : "dialog_userInfo",
				title : "修改个人信息",
				buttons : [ {
					id : 'userInfoSet_submit',
					text : '确定'
				}, {
					id : 'cancel',
					text : '取消'
				} ],
				width : 420,
				height : 400,
				closable : true
			}).render();
		}

		// 创建遮罩
		this.Mask = new CS2C_Shadow({
			isAllMask : false,
			parentEl_id : 'dialog_userInfo',
			isLoading : true
		}).render();

		// 创建数据验证格式
		this.valid = {};

		this.valid.userRnameVarify = new validateBoxView({
			'id' : 'us_realname',
			'tipmsg' : validateMsg.userRealname,
			'reqmsg' : '必填项',
			'reg_exp' : validateReg.userRealname
		});
		this.valid.userEmailVarify = new validateBoxView({
			'id' : 'us_useremail',
			'tipmsg' : validateMsg.userEmail,
			'reqmsg' : '必填项',
			'reg_exp' : validateReg.userEmail
		});

	},

	/**
	 * 页面渲染
	 */
	render : function() {// tip的页面元素

		// 显示对话框
		this.dialog_userInfo.openDialog();

		// 获取用户信息并初始化对话框显示数据
		this.getUserInfo();
	},

	/**
	 * 事件绑定
	 */
	bindEvents : function() {
		// 用户信息修改取消
		$(".userInfoSet_cancel").unbind("click");
		$(".userInfoSet_cancel").bind("click", _(function() {
			this.setCancel();
		}).bind(this));

		// 用户信息提交确认
		$(".userInfoSet_submit").unbind("click");
		$(".userInfoSet_submit").bind("click", _(function() {
			this.setSubmit();
		}).bind(this));

		// 权限信息查看
		$("#person_permission_pointer").unbind("click");
		$("#person_permission_pointer").bind("click", _(function() {
			this.permissionList();
		}).bind(this));

	},

	/**
	 * 通过3个get请求获取用户基本信息、用户角色、是否启用用户配额等信息
	 */
	getUserInfo : function() {
		// 获取用户基本信息
		$.getJSON(window.location.protocol + "//" + window.location.host + "/neo-service/users/" + commonOpt.getLoginUserInfo().userName + "", _(function(data) {
			// console.log(data);
			this.userModel = {
				userName : data.userName,
				passwordType : data.passwordType,// 会删除
				uid : data.uid,// 用户id
				gid : data.gid,// 用户组id
				rid : data.rid,// 用户角色id
				realName : data.realName,// 用户真实姓名
				email : data.email,// 用户邮箱
				groupname : data.groupname
			// 用户所属组名
			};

			$('#us_username').text(data.userName);

			$('#us_realname').val(data.realName);

			$('#us_useremail').val(data.email);

			$('#us_gname').text(data.groupname);

			$('#us_roleName').html(data.role.roleName);

			if (data.groupAdmin) {
				$('#us_gmanager').text("是");
				$('#us_roleType').text('组角色');
			} else {
				$('#us_gmanager').text("否");
				$('#us_roleType').text('子角色');
			}

			// 获取是否启用用户配额
			$.getJSON(window.location.protocol + "//" + window.location.host + "/neo-service/users",

			{
				'userName' : commonOpt.getLoginUserInfo().userName,
				'method' : 'getUserQuota'
			},

			function(data) {
				data.isQuotaEnabled === 0 ? $('#us_uquota').html("停用") : $('#us_uquota').html("启用");
			});

			// 获取权限信息

		}).bind(this));
	},

	/**
	 * 提交用户信息
	 * 
	 * @returns {Boolean}
	 */
	setSubmit : function() {
		var tempthis = this;
		if (this.valid.userRnameVarify.inputValidate() && this.valid.userEmailVarify.inputValidate()) {
			this.Mask.isMask(true);
			this.userModel.realName = $('#us_realname').val();
			this.userModel.email = $('#us_useremail').val();
			$.ajax({
				url : window.location.protocol + '//' + window.location.host + '/neo-service/users',
				contentType : "application/json",
				type : "put",
				data : JSON.stringify(this.userModel),
				dataType : "json",
				success : _(function() {
					this.Mask.isMask(false);
					cs2c_Message('修改基本信息成功!');
					this.dialog_userInfo.closeDialog();
				}).bind(this),
				error : _(function(response) {
					this.Mask.isMask(false);
					cs2c_Message(commonOpt.cs2c_error(response).errCode + commonOpt.cs2c_error(response).errMsg);
					this.dialog_userInfo.closeDialog();
				}).bind(this)
			});
		} else {
			return false;
		}

	},

	/**
	 * 取消用户信息设置
	 */

	permissionList : function() {
		if (!$('#person_permission_list').is(':hidden')) {
			$('#person_permission_list').hide();
		} else {
			$('#person_permission_list').empty();
			$.getJSON(window.location.protocol + '//' + window.location.host + '/neo-service/users', {
				'userName' : commonOpt.getLoginUserInfo().userName,
				'method' : 'findPermission'
			}, function(data) {
				var count = data.permissionList.length;
				for ( var i = 0; i < count; i++) {
					$('#person_permission_list').append('<span style="width:180px;display:inline-block">' + data.permissionList[i].description + '</span>');
				}
			});
			$('#person_permission_list').show();
		}

	}

};

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 修改密码视图对象定义
 */
var setPasswdView = {

	el : "#dialog_setPasswd", // 指定修改密码对话框对应div的id

	initialize : function() {

		// 创建所需组件
		this.createComps();

		// 完成页面渲染
		this.render();

		// 绑定事件处理
		this.bindEvents();
	},

	/**
	 * 创建公共组件
	 */
	createComps : function() {

		// 创建对话框
		if ($(this.el).parent().parent().attr("class") !== "cs2c_dialog") {
			this.dialog_setPasswd = new CS2C_Dialog({
				dialog_content_id : "dialog_setPasswd",
				title : "修改密码",
				buttons : [ {
					id : 'passwdSet_submit',
					text : '确定'
				}, {
					// id : 'passwdSet_cancel',
					id : 'cancel',
					text : '取消'
				} ],
				width : 420,
				height : 170,
				closable : true
			}).render();
		}

		// 创建遮罩
		this.Mask = new CS2C_Shadow({
			isAllMask : false,
			parentEl_id : 'dialog_setPasswd',
			isLoading : true
		}).render();

		// 创建数据格式验证
		this.valid = {};

		// 旧密码格式验证
		this.valid.userOldPwdVarify = new validateBoxView({
			'id' : 'ps_old_pwd',
			'tipmsg' : validateMsg.userPassWd,
			'reqmsg' : '必填项',
			'reg_exp' : validateReg.userPassWd
		});

		// 新密码格式验证
		this.valid.userNewPwdVarify = new validateBoxView({
			'id' : 'ps_new_pwdf',
			'tipmsg' : validateMsg.userPassWd,
			'reqmsg' : '必填项',
			'reg_exp' : validateReg.userPassWd
		});

		// 确认密码格式验证
		this.valid.userResurePwdVarify = new validateBoxView({
			'id' : 'ps_new_pwd',
			'tipmsg' : validateMsg.equalTo,
			'reqmsg' : '必填项'
		});

		// 密码是否一致
		this.valid.userResurePwdVarify.validateFunc = function() {
			return ($('#ps_new_pwd').val() === $('#ps_new_pwdf').val() ? true : false);
		};

	},

	render : function() {

		this.dialog_setPasswd.openDialog();

	},

	bindEvents : function() {

		$('.passwdSet_submit').unbind('click');
		$(".passwdSet_submit").bind("click", _(function() {
			this.setPasswdSubmit();
		}).bind(this));

		$('.passwdSet_cancel').unbind('click');
		$(".passwdSet_cancel").bind("click", _(function() {
			this.setPasswdCancel();
		}).bind(this));

		$('#verify_logout').unbind('click');
		$("#verify_logout").bind("click", _(function() {
			indexPage.logOut();
		}).bind(this));

	},

	setPasswdSubmit : function() {
		if (this.valid.userOldPwdVarify.inputValidate() && this.valid.userNewPwdVarify.inputValidate() && this.valid.userResurePwdVarify.inputValidate()) {
			this.Mask.isMask(true);

			// 获取用户基本信息
			$.getJSON(window.location.protocol + "//" + window.location.host + "/neo-service/users/" + commonOpt.getLoginUserInfo().userName + "", _(function(data) {

				this.userModel = {
					userName : data.userName,
					passwordType : data.passwordType,// 会删除
					uid : data.uid,// 用户id
					gid : data.gid,// 用户组id
					rid : data.rid,// 用户角色id
					realName : data.realName,// 用户真实姓名
					email : data.email,// 用户邮箱
					groupname : data.groupname
				};

				this.postPasswd();

			}).bind(this));

		}
	},

	postPasswd : function() {
		$.ajax({
			url : window.location.protocol + '//' + window.location.host + '/neo-service/users?method=updatePassword',
			contentType : "application/json",
			type : "put",
			data : JSON.stringify({
				'uid' : this.userModel.uid,
				'userName' : this.userModel.userName,
				'newPasswd' : $('#ps_new_pwd').val(),
				'oldPasswd' : $('#ps_old_pwd').val(),
				'passwordType' : this.userModel.passwordType
			}),
			dataType : "json",
			success : _(function() {
				this.Mask.isMask(false);
				cs2c_Message('修改密码成功!');
				$('#verify_pwd').hide();
				$('#verify_ok').show();

			}).bind(this),
			error : _(function(response) {
				this.Mask.isMask(false);
				cs2c_Message(commonOpt.cs2c_error(response).errCode + commonOpt.cs2c_error(response).errMsg);
			}).bind(this)
		});
	}
};

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 权限信息
 */
ha = Backbone.View.extend({
	el : $('body'),
	initialize : function() {
		_.bindAll(this, 'render');
		this.render();
	},
	render : function() {// tip的页面元素
		this.getHaInfo();
	},
	getHaInfo : function() {
		$.getJSON(window.location.protocol + "//" + window.location.host + "/neo-service/ha?method=findHaStatus", function(data) {
			$('#haSwitch').html(data.haSwitch ? "开启" : "未开启");
			$('#status').html(data.status ? "启动" : "不启动");
			$('#storageType').html(data.storageType);
			$('#mainIp').html(data.mainIp);

			$('#mainState').html(data.mainState ? "在线" : "不在线");
			$('#draftIp').html(data.draftIp);
			$('#slaveIp').html(data.slaveIp);
			$('#slaveState').html(data.slaveState ? "在线" : "不在线");

		});

	}
});