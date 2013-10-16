$(function() {
	slideBtn = Backbone.View.extend({
		el : $('body'),
		val : false,
		options : {
			id : null,// 页面input输入框的id,
			value : false,
			action : function() {
			}
		},
		initialize : function() {
			_.bindAll(this, 'render', 'getValue');

			this.render();
		},
		render : function() {// tip的页面元素
			this.val = this.options.value;
			var ele = '';
			if ($("#" + this.options.id + " div").length === 0) {

				if (!this.val) {
					ele = '<div class="off">关 闭</div>';
				} else {
					ele = '<div class="on">开 启</div>';
				}
				$('#' + this.options.id).addClass("slide_btn").append(ele);

			} else {

				if (this.val) {
					// this.options.value==1;
					$('#' + this.options.id).find("div").removeClass("off").addClass("on").html("开 启");
				} else {
					// alert("aaaaaa:" + this.options.value);
					$('#' + this.options.id).find("div").removeClass("on").addClass("off").html("关 闭");

				}
			}
			$('#' + this.options.id).unbind('click').bind('click', this.getValue);
		},
		getValue : function() {
			if (!this.val) {
				$('#' + this.options.id).find("div").removeClass("off").addClass("on").html("开 启");
			} else {
				$('#' + this.options.id).find("div").removeClass("on").addClass("off").html("关 闭");

			}
			this.val = !this.val;
			this.options.action ? this.options.action() : null;
			// alert("value:" + this.val);
		}
	});
}());
