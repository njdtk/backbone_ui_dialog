(function() {
	/**
	 * TODO 创建选项卡控件
	 * 
	 * @author qianqian.yang 2013-1-9
	 */
	window.Cs2c_Tab = Backbone.View.extend({
		options : {
			tab_id : '',
			tabTitles : [],
			height : 150
		// 该属性暂时不用，cs2c_tab的高度为100%，自适应(xiran)
		},

		events : {
			"click .cs2c_tab_btn" : "changTab"
		},

		initialize : function() {
			$(this.el).addClass('cs2c_tab');
			// 在用户创建对话框内容位置创建对话框
			$('#' + this.options.tab_id).parent().append(this.el);
			// 创建控件内容
			this.createTabs();
			this.createTabsBody();
		},

		/**
		 * 创建选项卡控件的选项标题集合
		 * 
		 * @author qianqian.yang 2013-1-9
		 */
		createTabs : function() {
			$(this.el).append('<div class="cs2c_tab_title"></div>');
			// 设置Tab的标签的显示状态
			var tabTitles = '';
			for ( var i = 0; i < this.options.tabTitles.length; i++) {
				tabTitles += '<span class="cs2c_tab_btn ' + (i == 0 ? 'cs2c_tabs_selected ' : '') + '" id="'
						+ (i == 0 ? 'tab_' + i : '') + '">' + this.options.tabTitles[i] + '</span>';
			}
			$(this.el).find('.cs2c_tab_title').append(tabTitles);
		},

		/**
		 * 创建选项卡控件的选项内容集合
		 * 
		 * @author qianqian.yang 2013-1-9
		 */
		createTabsBody : function() {
			$(this.el).append($('#' + this.options.tab_id));
			var tabsBody = $(this.el).find('#' + this.options.tab_id);
			tabsBody.addClass('cs2c_tab_ctx');
			// tabsBody.height(this.options.height);//页面滚动条和自适应的需求，暂时屏蔽该语句（xiran）
			// 设置Tab的内容的显示状态
			tabsBody.children().eq(0).show().siblings().hide();
		},

		render : function() {
			return this;
		},

		/**
		 * 鼠标点击选项卡标题事件
		 * 
		 * @author qianqian.yang 2013-1-9
		 */
		changTab : function(e) {

			// 同辈中的索引位置
			var index = $(e.currentTarget).index();

			// 需要在Tab的状态切换之前执行的状态
			if (!this.beforeToggleTabAction(index)) {
				return;
			}

			// 设置Tab的显示位置
			$(e.currentTarget).addClass('cs2c_tabs_selected').siblings().removeClass('cs2c_tabs_selected');
			$(e.currentTarget).attr("id", "tab_" + index).siblings().attr("id", "");
			// 控制Tab内容的显示

			$('#' + this.options.tab_id).children().eq(index).show().siblings().hide();

			this.tabBtnAction(index);
		},
		/**
		 * 点击Tab的切换之前执行的操作
		 * 
		 * @param index
		 *            2013-4-7
		 */
		beforeToggleTabAction : function(index) {
			return true;
		},
		/**
		 * 点击Tab按钮，执行操作
		 * 
		 * @param index
		 *            用户点击的Tab的索引，从0开始
		 */
		tabBtnAction : function(index) {

		},

		/**
		 * 设置Tab的显示状态
		 * 
		 * @author qianqian.yang
		 * @param index
		 *            显示Tab的索引号
		 */
		showTabIndex : function(index) {
			$(this.el).find('#' + this.options.tab_id).children().eq(index).show().siblings().hide();
			$(this.el).find('.cs2c_tab_title span').eq(index).addClass('cs2c_tabs_selected').siblings().removeClass(
					'cs2c_tabs_selected');
		},
		/**
		 * 动态删除Tab页面
		 * 
		 * @author qianqian.yang
		 * @param index
		 *            显示Tab的索引号
		 */
		removeTabByIndex : function(index) {
			$(this.el).find('#' + this.options.tab_id).children().eq(index).remove();
			$(this.el).find('.cs2c_tab_title span').eq(index).remove();
		}
	});
}());

(function() {
	/**
	 * 层次显示的全局变量的大小，用于对话框和遮罩层次的确定
	 */
	window.zIndex = 9000;

	/**
	 * TODO cs2c遮罩显示
	 * 
	 * @author qianqian.yang 2012-10-19
	 */
	window.CS2C_Shadow = Backbone.View.extend({
		options : {
			/**
			 * 创建遮罩的位置
			 */
			position_id : '',
			/**
			 * 是否是全局遮罩，默认为是
			 */
			isAllMask : true,
			/**
			 * 如果不是全局遮罩，局部遮罩父节点的id
			 */
			parentEl_id : '',
			/**
			 * 是否显示请等待的字样
			 */
			isLoading : true
		},

		initialize : function() {

			// 随着浏览器窗体大小的改变渲染，包括样式和位置
			$(window).resize(_(function() {
				this.calMask();
			}).bind(this));

			$(this.el).addClass('dialog-mask');

			if (this.options.isAllMask) {
				// 在用户创建对话框内容位置创建对话框
				$('#' + this.options.position_id).after(this.el);
			} else {
				$('#' + this.options.parentEl_id).append(this.el);
			}
			_.bindAll(this, 'render');
		},

		render : function() {
			if (this.options.isLoading) {
				$(this.el).after('<div class="dialog-mask-msg">正在处理，请稍侯...</div>');
			}
			return this;
		},

		/**
		 * 计算遮罩的大小和位置
		 * 
		 * @author qianqian.yang 2012-11-6
		 */
		calMask : function() {
			// 遮罩等待字样居中显示
			var parent = this.options.isAllMask ? $(document) : $('#' + this.options.parentEl_id);
			var mask = $(this.el);
			mask.css({
				height : parent.height(),
				width : parent.width()
			});
			// 如果需要显示加载字样
			if (this.options.isLoading) {
				var msg = $(this.el).next();
				msg.css({
					left : (parent.width() - msg.outerWidth()) / 2,
					top : (parent.height() - msg.outerHeight()) / 2
				});
			}
		},

		/**
		 * 是否显示对话框中的蒙板
		 * 
		 * @author qianqian.yang 2012-11-1
		 * @param flag
		 *            是否显示遮罩
		 */

		isMask : function(flag) {
			var parent = this.options.isAllMask ? $(document) : $('#' + this.options.parentEl_id);
			var mask = $(this.el);
			mask.css({
				height : parent.height(),
				width : parent.width(),
				zIndex : zIndex++
			});

			if (flag) {
				mask.show();
			} else {
				mask.hide();
			}

			// 如果需要显示加载字样
			if (this.options.isLoading) {
				var msg = $(this.el).next();
				msg.css({
					left : (parent.width() - msg.outerWidth()) / 2,
					top : (parent.height() - msg.outerHeight()) / 2,
					zIndex : zIndex++
				});

				if (flag) {
					msg.show();
				} else {
					msg.hide();
				}
			}
		}

	});

	/**
	 * TODO cs2c对话框类
	 * 
	 * @author qianqian.yang 2012-10-19
	 */
	window.CS2C_Dialog = Backbone.View
			.extend({

				options : {
					/*
					 * 用户自定义的对话框内容的div层id号
					 */
					dialog_content_id : null,
					/*
					 * 对话框标题
					 */
					title : '',
					/*
					 * 对话框显示的按钮集
					 */
					buttons : [],
					/*
					 * 对话框的宽度、高度（不带单位）
					 */
					width : 300,
					height : 120,
					/*
					 * 是否可关闭
					 */
					closable : true,
					/*
					 * 是否显示背景蒙板
					 */
					modal : true,
					/*
					 * 对话框的绝对定位，如果有位置的定义，则如下：position:{x:100,y:200}
					 */
					position : {
						x : 0,
						y : 0
					}
				},

				events : {
					"mousemove .cs2c_dialog_header" : "mouseMoveDone",
					"mousedown .cs2c_dialog_header" : "mouseDownDone",
					"click .cs2c_dialog_close_btn" : "closeDialog",
					"click .cs2c_dialog_button a" : "buttonAction"
				},

				initialize : function() {

					// 随着浏览器窗体大小的改变渲染，包括样式和位置
					var thisEl = this;
					$(window).resize(function() {
						thisEl.render();
					});
					$(this.el).addClass('cs2c_dialog');

					// 在用户创建对话框内容位置创建对话框
					$('#' + this.options.dialog_content_id).parent().append(this.el);

					// 创建对话框内容
					this.createUidom();
					this.createHeader();
					this.insertContentDiv();
					// this.createInnerMask();
					this.createDialogShadow();
					this.createBottomButtons();
					this.isShadowMask(this.options.modal);
					this.closeDialog();
					this.createOtherComponent();

					_.bindAll(this, 'render');

				},

				render : function() {

					var pageWidth = window.innerWidth, pageHeight = window.innerHeight;
					if (typeof pageWidth != 'number') {
						if (document.compatMode == 'CSS1Compat') {
							pageWidth = document.documentElement.clientWidth;
							pageHeight = document.documentElement.clientHeight;
						} else {
							pageWidth = document.body.clientWidth;
							pageHeight = document.body.clientHeight;
						}
					}

					var top, left;

					var thisEl = $(this.el)[0];
					thisEl.style.zIndex = zIndex++;
					// thisEl.style.display = "block";
					thisEl.style.position = "fixed";

					if (typeof this.options.position === 'undefined' || this.options.position.x === 0
							|| typeof this.options.position.x === 'undefined') {
						if (thisEl.clientHeight != this.options.height) {
							top = (pageHeight - thisEl.clientHeight) / 2 + "px";
						} else {
							top = (pageHeight - this.options.height) / 2 + "px";
						}
						left = (pageWidth - this.options.width) / 2 + "px";
					} else {
						top = this.options.position.y + "px";
						left = this.options.position.x + "px";
					}
					thisEl.style.top = top;
					thisEl.style.left = left;
					thisEl.style.minwidth = this.options.width + "px";
					thisEl.style.width = this.options.width + "px";
					// thisEl.style.height = (65 + this.options.height) + "px";
					thisEl.style.minHeight = this.options.height + "px";

					// (document.all) ?
					// $(this.el).siblings('.cs2c_dialog_shadow').css('filter',
					// 'alpha(opacity=30)') : '';

					$(this.el).siblings('.cs2c_dialog_shadow').css({
						'filter' : 'alpha(opacity=30)',
						'width' : pageWidth + 'px',
						'height' : pageHeight + 'px'
					});
					return this;

				},

				createUidom : function() {
					$(this.el)
							.append(
									'<div class="ui_left"></div><div class="ui_right"></div><div class="ui_top"></div><div class="ui_bottom"></div>');
				},
				/**
				 * 创建对话框的标题
				 * 
				 * @author qianqian.yang 2012-10-19
				 */
				createHeader : function() {

					// 创建标题栏
					$(this.el).append('<div class="cs2c_dialog_header"></div>');

					// 将用户自定义的对话框标题写入新建对话框
					$(this.el).find('.cs2c_dialog_header').html(this.options.title);

					if (this.options.closable) {
						// 标题处工具栏
						var closedButton = document.createElement("a");
						closedButton.className = "cs2c_dialog_close_btn";
						$(this.el).find('.cs2c_dialog_header').append(closedButton);
						// $(closedButton).html("关闭");
					}

				},

				/**
				 * 将用户定义的对话框内容层插入到绘制的对话框中
				 * 
				 * @author qianqian.yang 2012-10-19
				 */
				insertContentDiv : function() {

					// 创建对话框的内容显示区域
					var dialog_body = document.createElement("div");
					dialog_body.className = "cs2c_dialog_body";
					dialog_body.style.position = "relative";
					// dialog_body.style.backgroundColor = "#fff";
					// dialog_body.style.height = (this.options.height - 35) +
					// "px";
					dialog_body.style.minHeight = (this.options.height - 65) + "px";
					dialog_body.style.overflowY = "auto";
					dialog_body.style.overflowX = "hidden";
					dialog_body.style.maxHeight = (this.options.height + document.documentElement.clientHeight) / 2
							- 80 + "px";

					$(this.el).append(dialog_body);

					$(dialog_body).append($("#" + this.options.dialog_content_id));

				},

				/**
				 * 变换鼠标显示状态
				 * 
				 * @author qianqian.yang 2012-12-5
				 * @param e
				 */
				mouseMoveDone : function(e) {
					var header = e.currentTarget;
					header.style.cursor = "move";
				},

				mouseDownDone : function(e) {
					e = e || event;
					var moveObj = $(e.currentTarget).parent();
					var moveObjOffset = moveObj.offset();

					// x=鼠标相对于网页的x坐标-网页被卷去的宽-待移动对象的左外边距
					var x = e.clientX - document.body.scrollLeft - moveObjOffset.left;
					// y=鼠标相对于网页的y左边-网页被卷去的高-待移动对象的左上边距
					var y = e.clientY - document.body.scrollTop - moveObjOffset.top;

					document.onmousemove = function(e) {// 鼠标移动
						if (!e) {
							e = window.event; // 移动时创建一个事件
						}
						moveObj.offset({
							left : e.clientX + document.body.scrollLeft - x,
							top : e.clientY + document.body.scrollTop - y
						});
					};
					document.onmouseup = function() {// 鼠标放开
						document.onmousemove = null;
						document.onmouseup = null;
						moveObj.css("cursor", "normal");
					};
				},

				/**
				 * 创建对话框内部的遮罩
				 * 
				 * @author qianqian.yang 2012-11-1
				 */
				createInnerMask : function() {
					$(this.el).find('.cs2c_dialog_body').append('<div class="dialog-mask"></div>');
					$(this.el).find('.cs2c_dialog_body').append('<div class="dialog-mask-msg">正在处理，请稍侯...</div>');
				},

				/**
				 * 是否显示对话框中的蒙板
				 * 
				 * @author qianqian.yang 2012-11-1
				 * @param flag
				 */
				isInnerMask : function(flag) {
					if (flag) {
						// 遮罩等待字样居中显示
						var dialog_body = $(this.el).find('.cs2c_dialog_body');
						var mask = $(this.el).find('.dialog-mask');

						mask.css({
							height : dialog_body.height(),
							width : dialog_body.width(),
							zIndex : zIndex++
						});
						mask.show();

						var msg = $(this.el).find('.dialog-mask-msg');
						msg.css({
							left : (dialog_body.width() - msg.outerWidth()) / 2,
							top : (dialog_body.height() - msg.outerHeight()) / 2,
							zIndex : zIndex++
						});
						msg.show();
					} else {
						$(this.el).find('.dialog-mask').hide();
						$(this.el).find('.dialog-mask-msg').hide();
					}

				},

				/**
				 * 创建对话框背景蒙板层
				 * 
				 * @author qianqian.yang 2012-10-19
				 */
				createDialogShadow : function() {

					var pageWidth = window.innerWidth, pageHeight = window.innerHeight;
					if (typeof pageWidth != 'number') {
						if (document.compatMode == 'CSS1Compat') {
							pageWidth = document.documentElement.clientWidth;
							pageHeight = document.documentElement.clientHeight;
						} else {
							pageWidth = document.body.clientWidth;
							pageHeight = document.body.clientHeight;
						}
					}
					$(this.el).after(
							'<div class="cs2c_dialog_shadow" style="z-index:' + (zIndex++) + '; height:' + pageHeight
									+ 'px; width:' + pageWidth + 'px;"></div>');
				},

				/**
				 * 是否显示对话框的背景遮罩蒙板
				 * 
				 * @author qianqian.yang 2012-11-1
				 * @param flag
				 */
				isShadowMask : function(flag) {
					var outterMasks = $(this.el).siblings('.cs2c_dialog_shadow');
					if (outterMasks.length > 1) {
						var id = '#' + this.options.dialog_content_id;
						_.each(outterMasks, function(outterMask) {
							var length = $(outterMask.previousSibling).find(id).length;
							if (length !== 0) {
								outterMasks = $(outterMask);
							}
						});
					}
					if (flag) {
						outterMasks.show();
					} else {
						outterMasks.hide();
					}
				},

				/**
				 * 控制对话框的开关状态
				 * 
				 * @author qianqian.yang 2012-11-1
				 * @param flag
				 *            true 打开对话框 flase 关闭对话框
				 */
				isOpenDialog : function(flag) {
					$(this.el).css({
						zIndex : zIndex++
					});
					if (flag) {
						$(this.el).show();
						$('#' + this.options.dialog_content_id).show();
					} else {
						$(this.el).hide();
						$('#' + this.options.dialog_content_id).hide();
					}
				},

				/**
				 * 打开对话框
				 * 
				 * @author qianqian.yang 2012-10-29
				 */
				openDialog : function(x, y) {
					this.options.position = {
						x : x,
						y : y
					};
					this.isOpenDialog(true);

					this.isShadowMask(this.options.modal);
					this.createOtherComponent();
					this.render();

					// 打开对话框即将鼠标焦点聚焦在第一个input输入框上
					var inputs = $(this.el).find('input');
					$.each(inputs, function(i, input) {
						if (i == 0 && $(input).css('display') != 'none') {
							$(input).focus();
						}
					});
					$('.validate_tip').hide();
				},

				/**
				 * 关闭对话框
				 * 
				 * @author qianqian.yang 2012-10-29
				 */
				closeDialog : function() {
					this.isOpenDialog(false);
					this.isShadowMask(false);
					$('.validate_tip').hide();
				},

				/**
				 * 创建底部按钮集合层
				 * 
				 * @author qianqian.yang 2012-10-29
				 */
				createBottomButtons : function() {

					if (this.options.buttons.length == 0) {
						return;
					}

					var dialog_btn = document.createElement("div");
					dialog_btn.className = "cs2c_dialog_button";
					dialog_btn.style.height = "44px";
					dialog_btn.style.display = "block";

					$(this.el).append(dialog_btn);

					for ( var i = 0; i < this.options.buttons.length; i++) {
						var btn = document.createElement("a");
						btn.className = "l-btn " + this.options.buttons[i].id;
						btn.href = "javascript:void(0)";
						// btn.textContent = this.options.buttons[i].text;

						$(dialog_btn).append(btn);
						$(btn).append('<span class="dialog-btn-left">' + this.options.buttons[i].text + '</span>');
					}

				},

				/**
				 * 对话框按钮执行动作
				 * 
				 * @author qianqian.yang 2012-10-30
				 * @param e
				 */
				buttonAction : function(e) {
					var button = e.currentTarget.className.split(" ")[1];
					switch (button) {
					case "ok":
						this.okPressed();
						break;
					case "cancel":
						this.cancelPressed();
						break;
					default:
						this.otherPressed(button);
						break;
					}
				},

				/**
				 * 用户点击确定按钮执行动作
				 * 
				 * @author qianqian.yang 2012-11-1
				 */
				okPressed : function() {
				},

				/**
				 * 用户点击取消按钮执行动作
				 * 
				 * @author qianqian.yang 2012-11-1
				 */
				cancelPressed : function() {
					this.closeDialog();
				},

				/**
				 * 用户点击其他按钮执行动作，用户自定义可以重写
				 * 
				 * @author qianqian.yang 2012-11-1
				 */
				otherPressed : function(btnClass) {

				},

				/**
				 * 可自定义其他的控件
				 * 
				 * @author qianqian.yang 2012-12-21
				 */
				createOtherComponent : function() {

				}

			});

}());

/**
 * TODO jquery插件方法创建的遮罩方法
 */
(function($) {
	$.fn.cs2c_Mask = function(message) {
		var zIndex = 9000;
		// 创建遮罩的层
		this.append('<div class="dialog-mask"></div>');

		var mask = this.find('.dialog-mask');
		// 如果是对话框中的遮罩，宽度+24
		var width = this.parent().hasClass('cs2c_dialog') || this.hasClass('cs2c_dialog') ? (this.width() + 24) : this
				.width();
		mask.css({
			height : this.height(),
			width : width,
			zIndex : zIndex++
		});
		mask.show();

		// 显示的文字样式的层
		if (typeof message != 'undefined') {
			this.append('<div class="dialog-mask-msg"></div>');

			var msg = this.find('.dialog-mask-msg');
			msg.append('<div class="dialog-mask-label">' + message + '</div>');
			msg.css({
				left : (this.width() - msg.outerWidth()) / 2,
				top : (this.height() - msg.outerHeight()) / 2,
				zIndex : zIndex++
			});
			msg.show();
		}

	};

	$.fn.cs2c_unMask = function() {
		this.find('.dialog-mask').remove();
		this.find('.dialog-mask-msg').remove();
	};
})(jQuery);

// 模仿块级作用域
(function() {
	/**
	 * Cs2c_wizard_dialog是继承自CS2C_Dialog的子类，创建对象时，初始化都在父类里，在子类只是重写父类中的方法
	 */
	window.Cs2c_wizard_dialog = CS2C_Dialog
			.extend({
				// 使用的标志参数
				_pageNum : 1,
				options : {
					// 在上下步骤控制时，是否需要显示取消按钮
					cancelable : false,
					steps : []
				},
				/**
				 * 可自定义其他的控件，重写父类的方法
				 * 
				 * @author qianqian.yang 2012-12-21
				 */
				createOtherComponent : function() {
					// 页面选择定位初始化
					this._pageNum = 1;

					// 创建向导的导航提示条幅
					var exitClassName = $('#' + this.options.dialog_content_id).children()[0].className;
					if (exitClassName != 'cs2c_wizard_dialog_banner') {
						$('#' + this.options.dialog_content_id).wrapInner('<div class="cs2c_wizard_dialog_ctx"></div>');

						var bannerStepString = '';
						for ( var i = 0; i < this.options.steps.length; i++) {
							var redText = (i == 0 ? 'redText' : '');
							bannerStepString += '<span class="cs2c_wizard_dialog_banner_span ' + redText + '">'
									+ this.options.steps[i] + '</span>';
						}
						$('#' + this.options.dialog_content_id).prepend(
								'<div class="cs2c_wizard_dialog_banner">' + bannerStepString + '</div>');
					}
					// 只显示第一屏的内容
					$('.cs2c_wizard_dialog_ctx').find('.dialog_wizard_1').show().siblings().hide();
					$(this.el).find('.cs2c_wizard_dialog_banner').children().eq(0).addClass('redText').siblings()
							.removeClass('redText');

					this.createUpDownButton();
				},

				createUpDownButton : function() {
					var dialog_btn = $(this.el).find('.cs2c_dialog_button');
					if (dialog_btn.children().length <= 2) {
						dialog_btn
								.prepend('<a class="l-btn down" href="javascript:void(0)"><span class="dialog-btn-left">下一步</span></a>');
						dialog_btn
								.prepend('<a class="l-btn up" href="javascript:void(0)"><span class="dialog-btn-left">上一步</span></a>');
					} else {
						dialog_btn.find('.down').show();
					}
					dialog_btn.find('.up').hide();
					dialog_btn.find('.ok').hide();
					if (this.options.cancelable) {
						dialog_btn.find('.cancel').show();
					} else {
						dialog_btn.find('.cancel').hide();
					}
				},

				/**
				 * 其他按钮的执行动作
				 * 
				 * @author qianqian.yang 2012-12-26
				 * @param btnClass
				 */
				otherPressed : function(btnClass) {

					switch (btnClass) {
					case 'up':
						this._pageNum--;
						break;
					case 'down':
						this._pageNum++;
						break;
					default:
						break;
					}

					var dialog_btn = $(this.el).find('.cs2c_dialog_button');

					// 1、控制步骤进度条的显示
					var banners = $(this.el).find('.cs2c_wizard_dialog_banner').children();
					banners.eq(this._pageNum - 1).addClass('redText').siblings().removeClass('redText');

					// 2、控制界面内容切换的显示
					$('#' + this.options.dialog_content_id).find('.dialog_wizard_' + this._pageNum).show().siblings()
							.hide();

					// 控制按钮的显示：如果是最后一页，显示完成和取消按钮
					var wizardNum = $('#' + this.options.dialog_content_id).find(".cs2c_wizard_dialog_ctx").children().length;
					if (this._pageNum === wizardNum) {
						dialog_btn.find('.up').hide();
						dialog_btn.find('.down').hide();
						dialog_btn.find('.ok').show();
						dialog_btn.find('.cancel').show();
					} else if (this._pageNum === 1) {
						dialog_btn.find('.up').hide();
						dialog_btn.find('.down').show();
					} else {
						dialog_btn.find('.up').show();
					}

				}

			});

}());

(function() {
	/**
	 * TODO Cs2c_wizard by qianqian.yang
	 */
	window.Cs2c_Wizard = Backbone.View
			.extend({

				// 使用的标志参数
				_pageNum : 1,

				options : {
					// 向导界面的位置id
					wizard_id : null,
					// 向导界面的高度
					height : 150,
					// 每一页是否显示完成按钮
					achievable : false,
					// 在上下步骤控制时，是否需要显示取消按钮
					cancelable : false,
					// 最后步骤，完成界面，是否显示上一步的按钮，（默认显示）
					okHasUp : true,
					// 是否需要导航显示条
					banner : true,
					// 向导步骤的显示名称
					steps : []

				},

				initialize : function() {
					// 页面选择定位初始化
					this._pageNum = 1;

					$(this.el).addClass('cs2c_wizard');

					// 在用户创建对话框内容位置创建对话框
					$('#' + this.options.wizard_id).parent().append(this.el);

					if (this.options.banner) {
						// 创建导航
						this.createWizardBanner();
					}
					// 创建内容
					this.createWizardCtx();
					// 创建按钮集合
					this.createWizardButton();

				},

				events : {
					"click .cs2c_dialog_button a" : "buttonAction"
				},

				render : function() {

					// 只显示第一屏的内容
					$(this.el).find('.cs2c_wizard_dialog_ctx').find('.dialog_wizard_1').show().siblings().hide();

					$(this.el).find('.cs2c_wizard_dialog_banner').children().eq(0).addClass('redText').siblings()
							.removeClass('redText');
					return this;
				},

				/**
				 * @author qianqian.yang 创建向导进度步骤条
				 */
				createWizardBanner : function() {
					var bannerStepString = '';
					var lang = this.options.steps.length;
					var wid = 'style="width:' + 100 / lang + '%"';
					// alert(wid);
					for ( var i = 0; i < lang; i++) {
						var redText = (i == 0 ? 'redText' : (i == lang - 1) ? "lastText" : "");
						bannerStepString += '<div ' + wid + ' class="cs2c_wizard_dialog_banner_span ' + redText
								+ '"><span>' + this.options.steps[i] + '</span></div>';
					}
					$(this.el).append('<div class="cs2c_wizard_dialog_banner">' + bannerStepString + '</div>');

				},

				/**
				 * 创建向导面板的内容 2013-5-21
				 */
				createWizardCtx : function() {
					$(this.el).append('<div class="cs2c_wizard_dialog_ctx"></div>');
					$(this.el).find('.cs2c_wizard_dialog_ctx').append($('#' + this.options.wizard_id));
					$(this.el).find('.cs2c_wizard_dialog_ctx').height(this.options.height);
				},

				/**
				 * 创建向导面板的button区域 2013-5-21
				 */
				createWizardButton : function() {
					$(this.el).append('<div class="cs2c_dialog_button"></div>');

					var dialog_btn = $(this.el).find('.cs2c_dialog_button');

					dialog_btn
							.prepend('<a class="l-btn cancel" href="javascript:void(0)"><span class="dialog-btn-left">取消</span></a>');
					dialog_btn
							.prepend('<a class="l-btn ok" href="javascript:void(0)"><span class="dialog-btn-left">完成</span></a>');

					if (dialog_btn.children().length <= 2) {
						dialog_btn
								.prepend('<a class="l-btn down" href="javascript:void(0)"><span class="dialog-btn-left">下一步</span></a>');
						dialog_btn
								.prepend('<a class="l-btn up" href="javascript:void(0)"><span class="dialog-btn-left">上一步</span></a>');
					} else {
						dialog_btn.find('.down').show();
					}

					dialog_btn.find('.up').hide();
					// 判断是否显示【完成】按钮
					this.options.achievable ? dialog_btn.find('.ok').show() : dialog_btn.find('.ok').hide();
					// 判断是否显示【取消】按钮
					this.options.cancelable ? dialog_btn.find('.cancel').show() : dialog_btn.find('.cancel').hide();
				},

				/**
				 * 其他按钮的执行动作
				 * 
				 * @author qianqian.yang 2012-12-26
				 * @param btnClass
				 */
				buttonAction : function(e) {

					var btnClass = e.currentTarget.className.split(" ")[1];

					switch (btnClass) {
					case 'up':
						this.upPressed(this._pageNum - 1);
						this._pageNum--;
						break;
					case 'down':
						if (!this.downPressed(this._pageNum - 1)) {
							return;
						}
						this._pageNum++;
						break;
					case 'cancel':
						this.cancelPressed();
						break;
					case 'ok':
						this.okPressed(this._pageNum - 1);
						return;
						break;
					default:
						break;
					}

					this.componentDisplayController(this._pageNum);

				},

				/**
				 * @param pageNum
				 *            从0开始索引 上一步按钮执行动作 2013-5-21
				 */
				upPressed : function(pageNum) {
				},
				/**
				 * @param pageNum
				 *            下一步按钮执行动作 2013-5-21
				 */
				downPressed : function(pageNum) {
					return true;
				},
				okPressed : function(pageNum) {
				},
				cancelPressed : function() {
				},
				/**
				 * @param stepIndex
				 *            显示向导需要显示第几步 2013-5-21 从0开始索引
				 */
				showWizardStep : function(stepIndex) {
					this._pageNum = stepIndex + 1;
					this.componentDisplayController(stepIndex + 1);
				},
				/**
				 * @param stepIndex
				 *            从0开始检索 隐藏向导的部分步骤（包括进度指示条以及内容） 2013-5-21
				 */
				hideWizardStep : function(stepIndex) {
					// 1、控制步骤进度条的显示
					var banners = $(this.el).find('.cs2c_wizard_dialog_banner').children();
					banners.eq(stepIndex).hide();
					// 2、控制界面内容切换的显示
					$('#' + this.options.wizard_id).find('.dialog_wizard_' + (stepIndex + 1)).hide();
				},
				componentDisplayController : function(pageNum) {
					var dialog_btn = $(this.el).find('.cs2c_dialog_button');

					// 1、控制步骤进度条的显示
					var banners = $(this.el).find('.cs2c_wizard_dialog_banner').children();
					banners.eq(pageNum - 1).addClass('redText').siblings().removeClass('redText');
					if (pageNum !== 1) {
						banners.eq(pageNum - 2).addClass('prevText').siblings().removeClass('prevText');
					} else {
						$(this.el).find(".prevText").removeClass('prevText');
					}
					// 2、控制界面内容切换的显示
					$('#' + this.options.wizard_id).find('.dialog_wizard_' + pageNum).show().siblings().hide();

					// 3.控制按钮的显示：如果是最后一页，显示完成和取消按钮
					var wizardNum = $(this.el).find(".cs2c_wizard_dialog_ctx").children().children().length;

					// 判断每一步的按钮显示状态
					if (pageNum === wizardNum) {
						// 最终的完成界面是否显示【上一步】按钮
						this.options.okHasUp ? dialog_btn.find('.up').show() : dialog_btn.find('.up').hide();
						dialog_btn.find('.down').hide();
						dialog_btn.find('.ok').show();
					} else if (pageNum === 1) {
						dialog_btn.find('.up').hide();
						dialog_btn.find('.down').show();
						// 判断是否显示【完成】按钮
						this.options.achievable ? dialog_btn.find('.ok').show() : dialog_btn.find('.ok').hide();
					} else {
						dialog_btn.find('.up').show();
						dialog_btn.find('.down').show();
						// 判断是否显示【完成】按钮
						this.options.achievable ? dialog_btn.find('.ok').show() : dialog_btn.find('.ok').hide();
					}
					this.currentStepAction(pageNum - 1);// 从0开始索引
				},

				/**
				 * @param pageNum
				 *            2013-7-31 当前页显示的时候需要执行的动作
				 */
				currentStepAction : function(pageNum) {

				}

			});

}());

(function() {

	/**
	 * TODO cs2c组建库的信息提示 by qianqian.yang 2013-4-1
	 */
	window.cs2c_Message = function(msg, posEl) {

		// 确定浏览器的可视界面的大小
		var pageWidth = window.innerWidth;
		var pageHeight = window.innerHeight;
		if (typeof pageWidth != 'number') {
			if (document.compatMode == "CSS1Compat") {
				pageWidth = documnet.documentElment.clientWidth;
				pageHeight = documnet.documentElment.clientHeight;
			} else {
				pageWidth = documnet.body.clientWidth;
				pageHeight = documnet.body.clientHeight;
			}
		}
		pageWidth = (typeof posEl != "undefined") ? posEl[0].scrollWidth : pageWidth;
		var message_body = document.createElement("div");
		message_body.className = "cs2c_message";
		message_body.style.zIndex = 10000;
		message_body.style.left = ((typeof posEl != "undefined" ? posEl.offset().left : 0) + (pageWidth - 300) / 2)
				+ "px";

		$('body').append(message_body);
		$(message_body).html(msg);
		$(message_body).fadeIn("slow");

		// 关闭该信息条
		timeout = setTimeout(function() {
			clearTimeout(timeout);
			$(message_body).remove();
		}, 3000);

		// 如果用户鼠标划过该区域，则【取消】关闭
		$(message_body).mouseover(function() {
			clearTimeout(timeout);
		});
		// 如果用户鼠标移除该区域，则【关闭】该提示条
		$(message_body).mouseout(function() {
			timeout2 = setTimeout(function() {
				$(message_body).remove();
				clearTimeout(timeout2);
			}, 1000);
		});

	};

	/**
	 * TODO cs2c组建库的确认提示 by qianqian.yang 2013-4-18
	 */
	window.cs2c_confirm = function(msg, fn) {
		var dialogIdDiv = document.createElement("div");
		dialogIdDiv.id = "cs2c_confirm_dialog";

		$('body').append(dialogIdDiv);
		$(dialogIdDiv).html(msg);
		$(dialogIdDiv).css({
			padding : '5px',
			paddingTop : '0px',
			textAlign : 'center',
			lineHeight : '20px'
		});

		// 打开一个确认对胡框
		var confirm_dialog = new CS2C_Dialog({
			dialog_content_id : "cs2c_confirm_dialog",
			title : "确认",
			buttons : [ {
				id : 'ok',
				text : '确定'
			}, {
				id : 'cancel',
				text : '取消'
			} ],
			width : 300,
			height : 80,
			closable : false,
			modal : true
		}).render();
		confirm_dialog.openDialog();

		// 销毁该确认对话框
		var destroyConfirm = function() {
			var dialog = $('#cs2c_confirm_dialog').parent().parent();
			// 删除【确认对话框】的遮罩
			dialog.next().remove();
			// 删除【确认对话框】
			dialog.remove();
		};

		confirm_dialog.okPressed = function() {
			destroyConfirm();
			this.closeDialog();
			if (fn) {
				fn(true);
			}
		};
		confirm_dialog.cancelPressed = function() {
			destroyConfirm();
			this.closeDialog();
			if (fn) {
				fn(false);
			}
		};
	};

}());

(function() {
})();
