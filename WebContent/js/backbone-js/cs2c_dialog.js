(function() {

	window.CS2C_Dialog = Backbone.View
			.extend({

				options : {

					tagName : 'div',

					dialog_content_id : null,

					title : '',

					buttons : [],

					width : "360",

					height : "",

					closable : true,

					closed : false

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

					var dialog_div = $('#' + this.options.dialog_content_id)
							.parent()[0];
					// 确认是否已经生成cs2c_dialog对话框
					if (dialog_div.className !== "cs2c_dialog") {
						this.createHeader();
						this.insertContentDiv();
						this.createModalLayer();
						this.createBottomButtons();
						document.body.appendChild(this.el);
					} else {
						// 需要的对话框已经生成，则直接显示即可
						this.openDialog();
					}

					_.bindAll("render");

				},

				render : function() {

					var thisEl = $(this.el)[0];
					thisEl.style.zIndex = "9999";
					thisEl.style.display = "block";
					thisEl.style.position = "fixed";
					thisEl.style.top = ($(document).height() - Number(this.options.height))
							/ 2 + "px";
					thisEl.style.left = (document.body.offsetWidth - Number(this.options.width))
							/ 2 + "px";
					thisEl.style.width = this.options.width + "px";
					thisEl.style.minHeight = (65 + Number(this.options.height))
							+ "px";

					return this;

				},

				/**
				 * 创建对话框的标题
				 * 
				 * @author qianqian.yang 2012-10-19
				 */
				createHeader : function() {

					var header = $('.cs2c_dialog_header')[0];
					if (header == null || header == "undefined") {
						header = document.createElement("div");
						header.className = "cs2c_dialog_header";
						$(this.el).append(header);
					} else {
						header.style.display = "block";
					}

					// 将用户自定义的对话框标题写入新建对话框
					$(header).html(this.options.title);

					// 标题处工具栏
					var closedButton = document.createElement("a");
					closedButton.className = "cs2c_dialog_close_btn";
					closedButton.style.marginLeft = (Number(this.options.width) - 110)
							+ "px";

					$(header).append(closedButton);
					$(closedButton).html("关闭");

				},

				/**
				 * 将用户定义的对话框内容层插入到绘制的对话框中
				 * 
				 * @author qianqian.yang 2012-10-19
				 */
				insertContentDiv : function() {

					var dialog_body = document.createElement("div");
					dialog_body.className = "cs2c_dialog_body";
					dialog_body.style.backgroundColor = "#fff";
					dialog_body.style.height = this.options.height + "px";
					$(this.el).append(dialog_body);

					var userDivClassName = "#" + this.options.dialog_content_id;
					var dialog_content = $(userDivClassName)[0];

					if (dialog_content.parentNode.localName == "body") {
						$(dialog_body).append(dialog_content);

					} else {
						dialog_content.style.display = "block";
					}

				},

				/**
				 * 创建对话框背景蒙板层
				 * 
				 * @author qianqian.yang 2012-10-19
				 */
				createModalLayer : function() {
					// 弹出层背景遮罩
					var layer = $('.cs2c_dialog_layer')[0];
					if (layer == null || layer == "undefined") {
						layer = document.createElement("div");
						layer.className = "cs2c_dialog_layer";

						document.body.appendChild(layer);
						// layer.style.display = "none";
					} else {
						layer.style.display = "block";
					}
					layer.style.width = layer.style.height = "100%";
					layer.style.position = !this.isIE6 ? "fixed" : "absolute";
					layer.style.top = layer.style.left = 0;
					layer.style.backgroundColor = "#000";
					layer.style.zIndex = "9998";
					layer.style.opacity = "0.3";
				},

				/**
				 * 打开隐藏的对话框
				 * 
				 * @author qianqian.yang 2012-10-29
				 */
				openDialog : function() {
					var uwindow = $(this.el)[0];// 关闭弹出层
					uwindow.style.display = "block";
					var grayLayer = $('.cs2c_dialog_layer')[0];// 关闭遮罩层
					grayLayer.style.display = "block";

				},

				closeDialog : function() {
					var uwindow = $(this.el)[0];// 关闭弹出层
					uwindow.style.display = "none";
					var grayLayer = $('.cs2c_dialog_layer')[0];// 关闭遮罩层
					grayLayer.style.display = "none";

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
						btn.className = this.options.buttons[i];
						btn.href = "#";
						btn.textContent = this.options.buttons[i];

						$(dialog_btn).append(btn);
					}

				},

				/**
				 * 对话框按钮执行动作
				 * 
				 * @author qianqian.yang 2012-10-30
				 * @param e
				 */
				buttonAction : function(e) {
					var button = e.currentTarget;
					switch (button.className) {
					case "ok":
						alert("ok");
						break;

					case "cancel":
						this.closeDialog();
						break;

					default:
						break;
					}
				},

				isIE6 : function() {
					var isIE = (document.all) ? true : false;
					var isIE6 = isIE
							&& ([ /MSIE (\d)\.0/i.exec(navigator.userAgent) ][0][1] == 6);

					return isIE6;

				}

			});

}());// 闭包

window.onload = function() {

	var dialog = new CS2C_Dialog({
		dialog_content_id : "b-dialog",
		title : "新建对话框",
		buttons : [ 'ok', 'cancel' ],
		width : "400",
		height : "50"
	}).render();

	$('#test').click(function() {
		dialog.openDialog();
	});
	$('#ptest').hide();
	$('#show').click(function() {
		$('#ptest').slideToggle("slow");
		// var height = $('#b-dialog')[0];
		// dialog.options.height = "100px";
		// dialog.render();
	});

};
