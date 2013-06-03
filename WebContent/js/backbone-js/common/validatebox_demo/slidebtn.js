$(function() {
	slideBtn = Backbone.View
			.extend({
				el : $('body'),
				val : false,
				options : {
					id : null,// 页面input输入框的id,
					value : false,
					action:function(){}
				},
				initialize : function() {
					_.bindAll(this, 'render', 'getValue');

					$('#' + this.options.id).bind('click', this.getValue);
					this.render();
				},
				render : function() {// tip的页面元素
					this.val = this.options.value;
					var ele = '';
					if (!this.val) {
						ele = '<div class="red"></div><div class="" style="float:right">关</div>';
					} else {
						ele = '<div>开</div><div class="green" style="float:right"></div>';
					}
					$('#' + this.options.id).addClass("slide_btn").append(ele);
				},
				getValue : function() {
					// console.log("click");
					if (!this.val) {
						// this.options.value==1;
						$('#' + this.options.id).find("div:eq(0)").removeClass(
								"red").html("开");
						$('#' + this.options.id).find("div:eq(1)").addClass(
								"green").html("");
					} else {
						$('#' + this.options.id).find("div:eq(0)").addClass(
								"red").html("");
						$('#' + this.options.id).find("div:eq(1)").removeClass(
								"green").html("关");
					}
					this.val = !this.val;
					this.options.action?this.options.action():null;
					// console.log(this.val);
				}
			});
}());
