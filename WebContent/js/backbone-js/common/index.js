$(function($) {
	$(document).ready(function() {
		indexPage = new indexPageView();
	});
	indexPageView = Backbone.View.extend({
		el : $('body'),
		initialize : function() {
			_.bindAll(this, 'render', 'menuClick', 'menuList', 'menuListHide');
			$(window).resize(function() {
				commonOpt.getMainHeight();
				commonOpt.getMiddleWidth();
				commonOpt.createDatagridScrollBar();
			});
			$('#menu').find('li').bind('click', this.menuClick);
			$('#menu,#more').find('li').bind('mouseover', this.menuList);
			$('#menu,#more').find('li').bind('mouseout', this.menuListHide);
			$('.menu_list').bind('mouseout', this.menuListHide);
			$('.menu_list').closest().bind('mouseover', this.menuList);
			this.render();
		},
		render : function() {// tip的页面元素
			this.pageIndex = cookie_opt.getCookie('index');
			this.menuClick(null, this.pageIndex);
			var height = $("body").height() - 109;
			$(".main").height(height);
			$('#username').text(cookie_opt.getCookie('username'));

		},
		events : {
			"click #more_logout" : "logOut",
			"click #more_personset" : 'showPersonSet'
		},
		logOut : function() {
			$.ajax({
				async : false,
				type : "delete",
				contentType : "application/json",
				url : window.location.protocol + "//" + window.location.host
						+ "/neo-service/login?method=logout",
				success : function(data) {
					if (data.flag) {
						cookie_opt.delCookie('index');
						cookie_opt.delCookie('username');
						cookie_opt.delCookie('userid');
						// top.location.reload();
						// window.location.replace("http://"+window.location.host+"/neo-service");
						window.location.href = "http://" + window.location.host
								+ "/neo-service";
					}
				}
			});

		},
		menuClick : function(event, index) {
			$('.menu_list').hide();
			var menu_item = "";
			if (event) {
				if ($(event.currentTarget).attr('id')) {
					menu_item = $(event.currentTarget).attr('id').substring(5);
				} else {
					$(event.currentTarget).find('ul').show();
					return;
				}
			} else {
				menu_item = index;
			}

			switch (menu_item) {
			case 'index':
				$.get('index_opt.html', function(result) {
				$('.main').html(result);
					commonOpt.getMiddleWidth();
					cookie_opt.setCookie('index','index');
				});
				break;
			case 'group':
				$.get('html/group/group.html', function(result) {
					$('.main').html(result);
					// commonOpt.getMiddleWidth();
					cookie_opt.setCookie('index', 'group');
				});
				break;
			case 'role':
				$.get('html/role/role.html', function(result) {
					$('.main').html(result);
					// commonOpt.getMiddleWidth();
					cookie_opt.setCookie('index', 'role');
				});
				break;
			case 'hostcluster':
				$.get('html/hostcluster/hostcluster.html', function(result) {
					$('.main').html(result);
					// commonOpt.getMiddleWidth();
					cookie_opt.setCookie('index', 'hostcluster');
				});
				break;
			case 'host':
				$.get('html/host/host.html', function(result) {
					$('.main').html(result);
					// commonOpt.getMiddleWidth();
					cookie_opt.setCookie('index', 'host');
				});
				break;
			case 'net':
				$.get('html/net/net.html', function(result) {
					$('.main').html(result);
					// commonOpt.getMiddleWidth();
					cookie_opt.setCookie('index', 'net');
				});
				break;
			case 'image':
				$.get('html/image/image.html', function(result) {
					$('.main').html(result);
					// commonOpt.getMiddleWidth();
					cookie_opt.setCookie('index', 'image');
				});
				break;
			case 'templet':
				$.get('html/templet/templet.html', function(result) {
					$('.main').html(result);
					commonOpt.getMiddleWidth();
					cookie_opt.setCookie('index', 'templet');
				});
				break;
			case 'vm':
				$.get('html/vm/vm.html', function(result) {
					$('.main').html(result);
					commonOpt.getMiddleWidth();
					cookie_opt.setCookie('index', 'vm');
				});
				break;
			case 'monitor':
				$.get('html/monitor/monitor.html', function(result) {
					$('.main').html(result);
					commonOpt.getMiddleWidth();
					cookie_opt.setCookie('index', 'monitor');
				});
				break;
			case 'marninfo':
				$.get('html/monitor/warnInfo.html', function(result) {
					$('.main').html(result);
					commonOpt.getMiddleWidth();
					cookie_opt.setCookie('index', 'marninfo');
				});
				break;
			case 'nettopo':
				$.get('html/monitor/netTopo.html', function(result) {
					$('.main').html(result);
					commonOpt.getMiddleWidth();
					cookie_opt.setCookie('index', 'nettopo');
				});
				break;
			case 'storage':
				$.get('html/storage/storage.html', function(result) {
					$('.main').html(result);
					commonOpt.getMiddleWidth();
					cookie_opt.setCookie('index', 'storage');
				});
				break;
			default:
				break;
			}
		},
		menuList : function(event) {
			this.menuListHide();
			if ($(event.currentTarget).find('ul').length) {
				$(event.currentTarget).find('ul').show();
			}
		},
		menuListHide : function(event) {
			$('.menu_list').hide();
		},
		showPersonSet : function(){
			var tempthis = this;
			$.get('html/top/person_set.html', function(result){
				$('.main').html(result);
				commonOpt.getMiddleWidth();
				new personSetView();
			});
		}
	});
	
	personSetView = Backbone.View.extend({
		el : $('body'),
		initialize : function() {
			_.bindAll(this, 'render');
			$("#person_info_cancel").unbind("click");
			$("#person_info_cancel").bind("click", _(function() {
				this.personSetCancle();
			}).bind(this));
			
			$("#person_info_submit").unbind("click");
			$("#person_info_submit").bind("click", _(function() {
				this.personSetSub();
			}).bind(this));
			
			$("#person_permission_pointer").unbind("click");
			$("#person_permission_pointer").bind("click", _(function() {
				this.permissionList();
			}).bind(this));
			this.render();
		},
		render : function() {// tip的页面元素
			this.personTab = new Cs2c_Tab({
				tab_id : 'person_set_tab',
				tabTitles : [ '基本设置' ]//, '安全设置','个性设置'
			}).render();
			this.personMask =  new CS2C_Shadow({
				isAllMask : false,
				parentEl_id : 'person_basic',
				isLoading : true
			}).render();
			this.personTab.tabBtnAction = _(function(index) {
				this.tabAction(index);
			}).bind(this);
			this.getPersonInfo();
		},
//		events:{
//			'click #person_info_cancel' : 'personSetCancle',
//			'click #person_info_submit' : 'personSetSub',
//			'click #person_permission_pointer' : 'permissionList'
//		},
		tabAction : function(index){
			
		},
		getPersonInfo : function(){
			$.getJSON(window.location.protocol + "//" + window.location.host + "/neo-service/users/" + cookie_opt.getCookie('username') + "", _(function(data) {
				this.userModel = {
						passwordType : data.passwordType,// 会删除
						passwd : 'qwer1234',// 会删除
						uid : data.uid,//用户id
						gid : data.gid,//用户组id
						rid : data.rid,//用户角色id
						realName : data.realName,//用户真实姓名
						email : data.email,//用户邮箱
						groupname : data.groupname//用户所属组名
					};
				$('#ps_username').text(cookie_opt.getCookie('username'));
				$('#ps_userrealname').val(data.realName);
				$('#ps_useremail').val(data.email);
				$('#ps_gname').text(data.groupname);
				if(data.groupAdmin){
					$('#ps_gmanager').text("是");
					$('#ps_rtype').text('组角色');
				}else{
					$('#ps_gmanager').text("否");
					$('#ps_rtype').text('子角色');
				}
				$.getJSON(window.location.protocol + "//" + window.location.host + "/neo-service/users",{
					'userName':cookie_opt.getCookie('username'),
					'method':'getUserQuota'},function(data){
						data.isQuotaEnabled === 0?$('#ps_uquota').html("停用"):$('#ps_uquota').html("启用");
					});
				$.getJSON(window.location.protocol + '//' + window.location.host + '/neo-service/roles', {
							'roleId' : data.rid,
							'method' : 'findDetailById'
						}, function(response) {
							$('#ps_rname').html(response.roleName);
						});
			}).bind(this));
		},
		personSetSub : function(){
			this.personMask.isMask(true);
			this.userModel.realName = $('#ps_userrealname').val();
			this.userModel.email = $('#ps_useremail').val();
			$.ajax({
				url : window.location.protocol + '//' + window.location.host + '/neo-service/users',
				contentType : "application/json",
				type : "put",
				data : JSON.stringify(this.userModel),
				dataType : "json",
				success : _(function() {
					this.personMask.isMask(false);
					cs2c_Message('修改基本信息成功!');
				}).bind(this),
				error : _(function(response) {
					this.personMask.isMask(false);
					cs2c_Message('错误码：' + commonOpt.cs2c_error(response).errCode + '，' + commonOpt.cs2c_error(response).errMsg + '');
				}).bind(this)
			});
		},
		personSetCancle : function(){
			indexPage.menuClick(null, cookie_opt.getCookie('index'));
		},
		permissionList : function(){
			if(!$('#person_permission_list').is(':hidden')){
				$('#person_permission_list').hide();
			}else{
				$('#person_permission_list').empty();
				$.getJSON(window.location.protocol + '//' + window.location.host + '/neo-service/users',{
									'userName' : cookie_opt.getCookie('username'),
									'method' : 'findPermission'
								},function(data) {
									var count = data.permissionList.length;
									for ( var i = 0; i < count; i++) {
										$('#person_permission_list').append('<span style="width:180px;display:inline-block">'
																+ data.permissionList[i].description
																+ '</span>');
									}
								});
				$('#person_permission_list').show();
			}
			
		}
	});
});