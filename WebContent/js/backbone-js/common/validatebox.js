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
			_.bindAll(this,'render','inputValidate','inputFocus','inputBlur','inputMouseover','validateFunc');
			$('#'+this.options.id+'').bind('input',this.inputValidate);
			$('#'+this.options.id+'').bind('focus',this.inputFocus);
			$('#'+this.options.id+'').bind('blur',this.inputBlur);
			$('#'+this.options.id+'').bind('mouseover',this.inputMouseover);
			$('#'+this.options.id+'').bind('mouseout',this.inputBlur);
			this.render();
		},
		render : function() {//tip的页面元素
			var $tip = $('<span class="validate_tip"></span>');
			$tip.append('<p></p><span class="validate_tip_arrow_border"></span><span class="validate_tip_arrow"></span>');
			$('#' + this.options.id + '').after($tip);
		},
		inputValidate:function(){
//			console.log('here');
			this.content = $('#'+this.options.id+'').val();
			$('#'+this.options.id+'').next().children().eq(0).text(this.options.tipmsg);
			$('.validate_tip').hide();
			if(this.options.reg_exp){
				this.options.reg_exp.test(this.content)?$('#'+this.options.id+'').next().hide():$('#'+this.options.id+'').next().show();
				return this.options.reg_exp.test(this.content);
						
			}else{
//				console.log("func");
				this.validateFunc()?$('#'+this.options.id+'').next().hide():$('#'+this.options.id+'').next().show();
				return this.validateFunc();
			}
			this.cssPosition();
		},
		validateFunc:function(){//如果正则表达式搞不定，需要重写该方法，校验通过return true;否则return false
//			return false;
		},
		inputMouseover:function(){
			$('.validate_tip').hide();
			if($('#'+this.options.id+'').val()){//有值的时候
				this.inputValidate();
			}else{
				$('#'+this.options.id+'').next().children().eq(0).text(this.options.reqmsg);
			    	$('#'+this.options.id+'').attr("required")?$('#'+this.options.id+'').next().show():$('#'+this.options.id+'').next().hide();
			    	this.cssPosition();	
			}
		},
		inputFocus:function(){//如果有额外focus的事件处理，需要重写该方法
			if($('#'+this.options.id+'').val() === '填写用户名'){
				$('#'+this.options.id+'').val("");
			}
			this.inputMouseover();
		},
		inputBlur:function(){
			$('#'+this.options.id+'').next().hide();
		},
		cssPosition:function(){
			var p_y = $('#' + this.options.id + '').position().top;
			var p_x = $('#' + this.options.id + '').position().left + $('#' + this.options.id + '').width() + 5;
			$('#' + this.options.id + '').next().position({
				left : p_x,
				top : p_y
			});
		}
	});
}());
