$(function() {
	validateBoxView = Backbone.View.extend({
		el : $('body'),
		options : {
			id : null,// 页面input输入框的id
			tipmsg : null,// 提示信息
			reqmsg : '必填项',// 必填项提示信息
			reg_exp : null
		// 正则表达式,如果可以用正则表达式解决的，直接给出匹配的正则表达式，如果不能，此属性不定义，需要重写validateFunc方法。
		},
		initialize : function() {
			_.bindAll(this, 'render', 'inputValidate', 'inputFocus', 'inputBlur', 'inputMouseover', 'validateFunc');
			$('#' + this.options.id + '').bind('input', this.inputValidate);
			$('#' + this.options.id + '').bind('focus', this.inputFocus);
			$('#' + this.options.id + '').bind('blur', this.inputBlur);
			$('#' + this.options.id + '').bind('mouseover', this.inputMouseover);
			$('#' + this.options.id + '').bind('mouseout', this.inputBlur);
			this.render();
		},
		render : function() {// tip的页面元素
			if ($('body').find('.validate_tip').length === 0) {
				this.tip = $('<span class="validate_tip"></span>');
				this.tip.append('<p></p><span class="validate_tip_arrow_border"></span><span class="validate_tip_arrow"></span>');
				$('body').append(this.tip);
			} else {
				this.tip = $('.validate_tip');
			}
		},
		inputValidate : function() {
			this.content = $.trim($('#' + this.options.id + '').val());
			var requireFlag = $('#' + this.options.id + '').attr('required');
			this.tip.children().eq(0).text(this.options.tipmsg);
			// this.content === ""?this.tip.children().eq(0).text(this.options.reqmsg):this.tip.children().eq(0).text(this.options.tipmsg);
			this.tip.hide();
			this.cssPosition();
			if (requireFlag === undefined && this.content === "") {
				return true;
			} else {
				if (this.options.reg_exp) {
					this.options.reg_exp.test(this.content) ? this.tip.hide() : this.tip.show();
					return this.options.reg_exp.test(this.content);
				} else {
					this.validateFunc() ? this.tip.hide() : this.tip.show();
					return this.validateFunc();
				}
			}

		},
		validateFunc : function() {// 如果正则表达式搞不定，需要重写该方法，校验通过return true;否则return false
		},
		inputMouseover : function() {
			$('.validate_tip').hide();
			var requireFlag = $('#' + this.options.id + '').attr('required');
			if ($('#' + this.options.id + '').val()) {// 有值的时候
				this.inputValidate();
			} else {
				if (requireFlag === undefined) {
					this.tip.hide();
				} else {
					this.tip.children().eq(0).text(this.options.tipmsg);
					// this.tip.children().eq(0).text(this.options.reqmsg);
					$('#' + this.options.id + '').attr("required") ? this.tip.show() : this.tip.hide();
					this.cssPosition();
				}
			}
		},
		inputFocus : function() {// 如果有额外focus的事件处理，需要重写该方法
			this.inputMouseover();
		},
		inputBlur : function() {
			this.tip.hide();
		},
		cssPosition : function() {
			var p_y = $('#' + this.options.id + '').offset().top;
			var p_x = $('#' + this.options.id + '').offset().left + $('#' + this.options.id + '').width();
			this.tip.css({
				left : p_x,
				top : p_y
			});
		}
	});
}());
