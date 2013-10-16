var Selection = {
        init:function(input){
        	this.input = input;
        	this.isTA = this.input.nodeName.toLowerCase() == "input";
        },
        isStandard:function(){
        	return "selectionStart" in (document.createElement("input"));
        },
        isSupported:function(){
        	// document.selection 表示当前网页中的选中内容, document.selection.createRange()
			// 根据当前文字选择返回 TextRange 对象，或根据控件选择返回ControlRange 对象。
        	var oo=document.createElement("input");
        	return this.isStandard()||( oo = document.selection) && !!oo.createRange();
        },
        setCaret : function(start, end){
            var o = this.input;
            if(this.isStandard){
            	o.setSelectionRange(start, end);
            }else if(this.isSupported){
                    var t = this.input.createTextRange();
                    end -= start + o.value.slice(start + 1, end).split("\n").length - 1;
                    start -= o.value.slice(0, start).split("\n").length - 1;
                    t.move("character", start), t.moveEnd("character", end), t.select();
            }
        },
        getCaret: function(){
            	var o = this.input, d = document;
            	if(this.isStandard) {
            		return {start: o.selectionStart, end: o.selectionEnd};
            	} else if(this.isSupported){
                    var s = (this.input.focus(), d.selection.createRange()), r, start, end, value;
                    if(s.parentElement() != o) {
						return {start: 0, end: 0};
					}
                    if(this.isTA ? (r = s.duplicate()).moveToElementText(o) : r = o.createTextRange(), !this.isTA) {
						return r.setEndPoint("EndToStart", s), {start: r.text.length, end: r.text.length + s.text.length};
					}
                    for(var $ = "[###]"; (value = o.value).indexOf($) + 1; $ += $) {
						;
					}
                    r.setEndPoint("StartToEnd", s), r.text = $ + r.text, end = o.value.indexOf($);
                    s.text = $, start = o.value.indexOf($);
                    if(d.execCommand && d.queryCommandSupported("Undo")) {
						for(r = 3; --r; d.execCommand("Undo")) {
							;
						}
					}
                    return o.value = value, this.setCaret(start, end), {start: start, end: end};
            }
            return {start: 0, end: 0};
        },
        getText : function(){
        		var o = this.getCaret();
        		return this.input.value.slice(o.start, o.end);
        },
        setText : function(text){
            	var o = this.getCaret(), i = this.input, s = i.value;
            	i.value = s.slice(0, o.start) + text + s.slice(o.end);
            	this.setCaret(o.start += text.length, o.start);
        }	
};     	
	timePickerView = Backbone.View.extend({
		el : $('body'),
		em:null,
		text:null,
		selection:null,
		min:null,
		max:null,
		options:{
			id:null,		
		     showseconds:true,// 初始化时input框中是否有值 默认无false，true初始化为当前系统时间
			 initVal:true,// true初始化为当前系统时间
			 start:null,// 初始化时input框中最小值，默认无，true初始化为当前系统时间
			 over:null// 初始化时input框中最大值，默认无，true初始化为当前系统时间
		},
		initialize : function() {
			_.bindAll(this,'render','addTime','reduceTime');
			this.render();
		},
		formatTime:function(value,type){	
			// console.log(value);
			if(type===0&&value>23){
				value=0;
				}
				if(type===0&&value<0){
				value=23;
				}
			if((type===1||type===2)&&value<0){
				value=59;
				}
			if((type===1||type===2)&&value>59){
				value=0;
				}
			return (value<10?"0"+value:value);	
		},
		setDom:function(){
			this.em=this.options.id+'-spinner-arrow';
			var ele = '<input readonly="readonly" class="spinner-text" id="'+this.em+'" value=""/><span class="spinner-arrow"><span id="'+this.options.id+'_spinner-arrow-up" class="spinner-arrow-up"></span><span id="'+this.options.id+'_spinner-arrow-down" class="spinner-arrow-down"></span></span>';
			
			$('#'+this.options.id+'').append(ele);
		},
		setValue:function(){
			var val="";
			if(this.options.initVal){
				val=this.getThisTime();
			}if(this.options.start){
				this.min=val=this.options.start+":00";
			}if(this.options.over){
				this.max=this.options.over+":00";
			}
			this.text=document.getElementById(this.em);
			Selection.init(this.text);
			this.selection=$.extend(true,{},Selection);// 对象克隆
			if(this.options.initVal){		
				 $('#'+this.em).val(val);
				// this.text.focus();

				}
		},
		render : function() {
			this.setDom();
			this.setValue();	
			$('#'+this.em).unbind("click").bind("click",_(function(){this.getSelect();}).bind(this));
			$('#'+this.options.id+'_spinner-arrow-up').unbind('click').bind('click',this.addTime);
			$('#'+this.options.id+'_spinner-arrow-down').unbind('click').bind('click',this.reduceTime);
			
		},
		parseTime:function(time){
			var arr=time.split(":");
			return parseInt(arr[0]*3600)+parseInt(arr[1])*60+parseInt(arr[2]);
			},
		getThisTime:function(){
			var thisDay=new Date();
			this.hour = thisDay.getHours();// 获取当前小时数(0-23)
			this.minute = thisDay.getMinutes();// 获取当前分钟数(0-59)
			this.second = thisDay.getSeconds();// 获取当前秒数(0-59)
			return	this.formatTime(this.hour)+":"+this.formatTime(this.minute)+":"+this.formatTime(this.second);
			},
		addTime : function(){
			var poz=this.formatPoz(this.selection.getCaret().start);
			this.getSelect(poz);			
			var type=1,sec=60;
			if(poz<3){
				type=0;
				sec=3600;
				}
				if(poz>5){
					type=2;
					sec=1;
					}
				
			var val=this.formatTime(parseInt(this.selection.getText())+1,type);
			var flag=this.max&&(this.parseTime($('#'+this.em).val())+sec)<this.parseTime(this.max);
			if(flag||this.options.initVal){
				this.selection.setText(val);
			}else{
				$('#'+this.em).val(this.max);
			}
		this.selection.setCaret(poz-1,poz+1);
      this.text.focus();
		},
		reduceTime : function(){
			var poz=this.formatPoz(this.selection.getCaret().start);
			this.getSelect(poz);	
			var type=1,sec=60;
			if(poz<3){
				type=0;
				sec=3600;
			}
			if(poz>5){
				type=2;
				sec=1;
			}
		// console.log(parseInt("09",10));
			// console.log("ggg:"+parseInt(this.selection.getText()));
			var val=this.formatTime(parseInt(this.selection.getText(),10)-1,type);
			var flag=this.max&&(this.parseTime($('#'+this.em).val())-sec)>this.parseTime(this.max);
			if(flag||this.options.initVal){
				this.selection.setText(val);
			}else{
				$('#'+this.em).val(this.min);
			}					
			this.selection.setCaret(poz-1,poz+1);
			this.text.focus();
		},
formatPoz:function(poz){
	if(poz<3){
		poz=1;
	}else if(poz>5){
		poz=7;
	}else{
		poz=4;
	}
	return poz;
},
		getSelect : function(poz){			
			if(!poz){
				poz=this.formatPoz(this.selection.getCaret().start);;
			}				
			this.selection.setCaret(poz-1,poz+1);
	        this.text.focus();	
		
        
		}
	});


