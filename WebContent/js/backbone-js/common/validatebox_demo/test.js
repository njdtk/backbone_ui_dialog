$(function(){
		testview = Backbone.View.extend({
			el : $('body'),
			initialize : function() {
			_.bindAll(this,'render');
			this.render();
		},
		render : function() {//tip的页面元素
			this.testdemo = new validateBoxView({
						'id':'validatebox',
						'tipmsg':'请勿输入除英文字母',
						'reqmsg':'必填项',
						'reg_exp':/^[1-9]d*$/
						});
			/*this.testdemo.validateFunc = function(){
				if($('#validatebox').val() ==="abc"){
					return true;
				}else{
					return false;
				}
			}*/
		}
		});
		
		var start = new testview();
		$('button').click(function(){
			start.testdemo.inputValidate();
		});
	});
