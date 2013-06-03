$(function () {
	validateBoxView = Backbone.View.extend({
		el : $('body'),
		options:{
			id:null,//页面input输入框的id
			tipmsg:null,//提示信息
			reqmsg:null,//必填项提示信息
			reg_exp:null//正则表达式,如果可以用正则表达式解决的，直接给出匹配的正则表达式，如果不能，此属性不定义，需要重写validateFunc方法。
		},
		initialize : function() {
			_.bindAll(this,'render','inputValidate','inputFocus','inputBlur');
			$('#'+this.options.id+'').bind('input',this.inputValidate);
			$('#'+this.options.id+'').bind('focus',this.inputFocus);
			$('#'+this.options.id+'').bind('blur',this.inputBlur);
			$('#'+this.options.id+'').bind('mouseover',this.inputFocus);
			$('#'+this.options.id+'').bind('mouseout',this.inputBlur);
			this.render();
		},
		render : function() {//tip的页面元素
			var $tip = $('<span class="validate_tip"></span>');
			$tip.append('<p></p><span class="validate_tip_arrow_border"></span><span class="validate_tip_arrow"></span>');
			$('#' + this.options.id + '').after($tip);
		},
		inputValidate:function(){
			this.content = $('#'+this.options.id+'').val();
			$('#'+this.options.id+'').next().children().eq(0).text(this.options.tipmsg);
			console.log(this.options.reg_exp);
			if(this.options.reg_exp){
				this.options.reg_exp.test(this.content)?$('#'+this.options.id+'').next().hide():$('#'+this.options.id+'').next().show();
				return this.options.reg_exp.test(this.content);
						
			}else{
				console.log(this.validateFunc());
				this.validateFunc()?$('#'+this.options.id+'').next().hide():$('#'+this.options.id+'').next().show();
				return this.validateFunc();
			}
			this.cssPosition();
		},
		validateFunc:function(){//如果正则表达式搞不定，需要重写该方法，校验通过return true;否则return false
//			return false;
		},
		inputFocus:function(){
			if($('#'+this.options.id+'').val()){//有值的时候
				this.inputValidate();
			}else{
				$('#'+this.options.id+'').next().children().eq(0).text(this.options.reqmsg);
			    	$('#'+this.options.id+'').attr("required")?$('#'+this.options.id+'').next().show():$('#'+this.options.id+'').next().hide();
			    	this.cssPosition();	
			}
		},
		inputBlur:function(){
			$('#'+this.options.id+'').next().hide();
		},
		cssPosition:function(){
			var p_y = $('#' + this.options.id + '').offset().top;
			var p_x = $('#' + this.options.id + '').offset().left + $('#' + this.options.id + '').width() + 5;
			$('#' + this.options.id + '').next().css({
				left : p_x,
				top : p_y
			});
		}
	});
}());
