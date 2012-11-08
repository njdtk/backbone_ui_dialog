(function() {
	/**
	 * 层次显示的全局变量的大小，用于对话框和遮罩层次的确定
	 */
	window.zIndex = 9000;

	/**
	 * cs2c遮罩显示
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
			parentEl_id : ''
		},

		initialize : function() {

			// 随着浏览器窗体大小的改变渲染，包括样式和位置
			var thisEl = this;
			$(window).resize(function() {
				thisEl.calMask();
			});

			$(this.el).addClass('dialog-mask');
			// 在用户创建对话框内容位置创建对话框
			$('#' + this.options.position_id).after(this.el);
		},

		render : function() {
			$(this.el).after('<div class="dialog-mask-msg">正在处理，请稍侯...</div>');
			return this;
		},

		/**
		 * 计算遮罩的大小和位置
		 * 
		 * @author qianqian.yang 2012-11-6
		 */
		calMask : function() {
			// 遮罩等待字样居中显示
			var parent = this.options.isAllMask ? $(window) : $('#'
					+ parentEl_id);
			var mask = $(this.el);
			var msg = $(this.el).next();
			mask.css({
				height : parent.height(),
				width : parent.width()
			});
			msg.css({
				left : (parent.width() - msg.outerWidth()) / 2,
				top : (parent.height() - msg.outerHeight()) / 2
			});
		},

		/**
		 * 是否显示对话框中的蒙板
		 * 
		 * @author qianqian.yang 2012-11-1
		 * @param flag
		 *            是否显示遮罩
		 */

		isMask : function(flag) {
			var parent = this.options.isAllMask ? $(document) : $('#'
					+ parentEl_id);
			var mask = $(this.el);
			var msg = $(this.el).next();
			mask.css({
				height : parent.height(),
				width : parent.width(),
				zIndex : zIndex++
			});
			msg.css({
				left : (parent.width() - msg.outerWidth()) / 2,
				top : (parent.height() - msg.outerHeight()) / 2,
				zIndex : zIndex++
			});
			if (flag) {
				mask.show();
				msg.show();
			} else {
				mask.hide();
				msg.hide();
			}
		}

	});

	/**
	 * cs2c对话框类
	 * 
	 * @author qianqian.yang 2012-10-19
	 */
	window.CS2C_Dialog = Backbone.View
			.extend({

				options : {
					/**
					 * 创建标签名称
					 */
					tagName : 'div',
					/**
					 * 用户自定义的对话框内容的div层id号
					 */
					dialog_content_id : null,
					/**
					 * 对话框标题
					 */
					title : '',
					/**
					 * 对话框显示的按钮集
					 */
					buttons : [],
					/**
					 * 对话框的宽度、高度（不带单位）
					 */
					width : "",
					height : "",
					/**
					 * 是否可关闭
					 */
					closable : true,
					/**
					 * 是否显示背景蒙板
					 */
					modal : true

				},

				events : {
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
					$('#' + this.options.dialog_content_id).parent().append(
							this.el);

					// 创建对话框内容
					this.createHeader();
					this.insertContentDiv();
					this.createInnerMask();
					this.createDialogShadow();
					this.createBottomButtons();

					this.isShadowMask(this.options.modal);

					_.bindAll("render");

				},

				render : function() {

					var thisEl = $(this.el)[0];
					thisEl.style.zIndex = zIndex++;
					thisEl.style.display = "block";
					thisEl.style.position = "fixed";
					thisEl.style.top = ($(document).height() - Number(this.options.height))
							/ 2 + "px";
					thisEl.style.left = (document.body.offsetWidth - Number(this.options.width))
							/ 2 + "px";
					thisEl.style.width = this.options.width + "px";
					thisEl.style.minHeight = (65 + Number(this.options.height))
							+ "px";

					(document.all) ? $(this.el).siblings('.cs2c_dialog_shadow')
							.css('filter', 'alpha(opacity=30)') : '';

					return this;

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
					$(this.el).find('.cs2c_dialog_header').html(
							this.options.title);

					if (this.options.closable) {
						// 标题处工具栏
						var closedButton = document.createElement("a");
						closedButton.className = "cs2c_dialog_close_btn";
						$(this.el).find('.cs2c_dialog_header').append(
								closedButton);
						$(closedButton).html("关闭");
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
					dialog_body.style.backgroundColor = "#fff";
					dialog_body.style.minHeight = this.options.height + "px";
					$(this.el).append(dialog_body);

					$(dialog_body).append(
							$("#" + this.options.dialog_content_id));

				},

				/**
				 * 创建对话框内部的遮罩
				 * 
				 * @author qianqian.yang 2012-11-1
				 */
				createInnerMask : function() {
					$(this.el).find('.cs2c_dialog_body').append(
							'<div class="dialog-mask"></div>');
					$(this.el).find('.cs2c_dialog_body').append(
							'<div class="dialog-mask-msg">正在处理，请稍侯...</div>');
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
						msg
								.css({
									left : (dialog_body.width() - msg
											.outerWidth()) / 2,
									top : (dialog_body.height() - msg
											.outerHeight()) / 2,
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
					$(this.el).after(
							'<div class="cs2c_dialog_shadow" style="z-index:'
									+ (zIndex++) + '"></div>');
				},

				/**
				 * 是否显示对话框的背景遮罩蒙板
				 * 
				 * @author qianqian.yang 2012-11-1
				 * @param flag
				 */
				isShadowMask : function(flag) {
					var outterMasks = $(this.el)
							.siblings('.cs2c_dialog_shadow');
					if (outterMasks.length > 1) {
						var id = '#' + this.options.dialog_content_id;
						_.each(outterMasks,
								function(outterMask) {
									var length = $(outterMask.previousSibling)
											.find(id).length;
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
					if (flag) {
						$(this.el).show();
					} else {
						$(this.el).hide();
					}
				},

				/**
				 * 打开对话框
				 * 
				 * @author qianqian.yang 2012-10-29
				 */
				openDialog : function() {
					this.isOpenDialog(true);
					this.isShadowMask(this.options.modal);
				},

				/**
				 * 关闭对话框
				 * 
				 * @author qianqian.yang 2012-10-29
				 */
				closeDialog : function() {
					this.isOpenDialog(false);
					this.isShadowMask(false);
				},

				/**
				 * 创建底部按钮集合层
				 * 
				 * @author qianqian.yang 2012-10-29
				 */
				createBottomButtons : function() {

					var dialog_btn = document.createElement("div");
					dialog_btn.className = "cs2c_dialog_button";
					dialog_btn.style.height = "28px";
					dialog_btn.style.display = "block";

					$(this.el).append(dialog_btn);

					for ( var i = 0; i < this.options.buttons.length; i++) {
						var btn = document.createElement("a");
						btn.className = "l-btn " + this.options.buttons[i].id;
						btn.href = "#";
						// btn.textContent = this.options.buttons[i].text;

						$(dialog_btn).append(btn);
						$(btn).append(
								'<span class="dialog-btn-left">'
										+ this.options.buttons[i].text
										+ '</span>');
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
						this.otherPressed();
						break;
					}
				},

				/**
				 * 用户点击确定按钮执行动作
				 * 
				 * @author qianqian.yang 2012-11-1
				 */
				okPressed : function() {
					alert("ok");
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
				otherPressed : function() {
				}

			});

}());// 闭包

window.onload = function() {

	var mask = new CS2C_Shadow({
		position_id : "b-dialog",
	}).render();
	// mask.isMask(true);

	var dialog = new CS2C_Dialog({
		dialog_content_id : "b-dialog",
		title : "新建对话框",
		buttons : [ {
			id : 'ok',
			text : '确定'
		}, {
			id : 'cancel',
			text : '取消'
		} ],
		width : "400",
		height : "150",
		closable : true
	}).render();

	var dialog2 = new CS2C_Dialog({
		dialog_content_id : "dialog2",
		title : "另外一个弹出的对话框",
		buttons : [ {
			id : 'ok',
			text : '确定'
		}, {
			id : 'cancel',
			text : '取消'
		} ],
		width : "200",
		height : "120",
		closable : true,
		modal : false
	}).render();

	$('#test').click(function() {
		dialog.openDialog();
	});
	$('#ptest').hide();
	$('#show').click(function() {
		// $('#ptest').slideToggle("slow");
		dialog2.openDialog();
	});

	$('#showmask').click(function() {
		dialog.isInnerMask(true);
	});

	$('#show2').click(function() {
		dialog2.isInnerMask(true);
	});

};
