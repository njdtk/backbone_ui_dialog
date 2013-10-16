$(function() {
	selectedBoxView = Backbone.View.extend({
		el : $('body'),
		options : {
			parentElId : null,// 原素ID
			single : false,//true,为单一模式，false,全模式，默认为false
			attrNum:1,//显示元素需要的属性个数，1->只需要显示文字内容；2->需要附加name属性，方便传值；默认为1
			arrowAct:false,//事件响应方式，默认false，点击行响应，true，只有点击箭头才响应
			/*UI相关参数*/
			areaTitle : null,// 左右区域名，数组，显示的title,如果没有title，不填该属性
			areaHeight:null,//框所在区域的高度
			areaWidth:null,//框所在区域宽度
			/*数据相关*/
			leftData:null,//左侧数据，对象数组，渲染每条数据所属要的对象{'showText':xxx,'name':xxx}
			rightData:null,//右侧数据，对象数组，渲染每条数据所属要的对象{'showText':xxx,'name':xxx}
			/*获取数据相关参数*/
			getField:'text'//最终要获取的字段,text->显示字段；name->name属性，前提attrNum为2，即是该属性存在
		},
		initialize : function() {
			_.bindAll(this, 'render','dealClick','dealMouseover','dealMouseout','initData','createDom','uiFormat','reRender','getList');
			this.render();
		},
		render : function() {//初始化页面元素
			
			this.createDom();
			this.uiFormat();
			this.initData();
				
		},
		createDom : function(){//重定义UI
			
			this.select_left_body = $('<div class="select-area select-left-area"></div>');
			this.select_right_body = $('<div class="select-area select-right-area"></div>');
			
			this.select_left_title = $('<div class="select-title"></div>');
			this.select_right_title = $('<div class="select-title"></div>');
			if(this.options.areaTitle){
				if(!this.options.single){
					this.select_left_title.text(this.options.areaTitle[0]);
					this.select_right_title.text(this.options.areaTitle[1]);
					
					this.select_left_body.append(this.select_left_title);
					this.select_right_body.append(this.select_right_title);
				}else{
					this.select_right_title.text(this.options.areaTitle[0]);
					this.select_right_body.append(this.select_right_title);
				}
			}
			this.select_left_content = $('<div class="select-content select-left-content"></div>');
			
			this.select_right_content = $('<div class="select-content select-right-content"></div>');
			this.select_mark = $('<div class="select-mark"></div>');
			this.clear_div = $('<div style="clear:both"></div>');
			
			this.select_left_body.append(this.select_left_content);
			this.select_right_body.append(this.select_right_content);
			$('#'+this.options.parentElId+'').addClass('cs2c-selectbox');
			if(!this.options.single){
				$('#'+this.options.parentElId+'').append(this.select_left_body);
				$('#'+this.options.parentElId+'').append(this.select_mark);
				$('#'+this.options.parentElId+'').append(this.select_right_body);
				$('#'+this.options.parentElId+'').append(this.clear_div);
			}else{
				$('#'+this.options.parentElId+'').append(this.select_right_body);
				$('#'+this.options.parentElId+'').append(this.clear_div);
			}
		},
		uiFormat :function(){
			if(this.options.areaHeight){
				var mark_top = (this.options.areaHeight+12)/2;
				$('.select-content').css('height',this.options.areaHeight);
				$('.select-mark').css('margin-top',mark_top);
			}
			if(this.options.areaWidth){
				$('.select-content').css('width',this.options.areaWidth);
			}
		},
		initData : function(leftDataArray,rightDataArray){//渲染list元素
			var leftData,rightData;
			if(this.options.leftData){
				arguments[0] !== undefined ? leftData = leftDataArray: leftData = this.options.leftData;
				for(var i=0;i<leftData.length;i++){
					
					switch(this.options.attrNum){
					case 1:
						var $leftItem = $('<div class="select-body-item">'+
											'<p>'+leftData[i].showText+'</p>'+
											'<p class="select-left-arrow" style="display:none"></p>'+
										'</div>');
						this.select_left_content.append($leftItem);
					break;
					case 2:
						var $leftItem = $('<div class="select-body-item">'+
											'<p name="'+leftData[i].name+'">'+leftData[i].showText+'</p>'+
											'<p class="select-left-arrow" style="display:none"></p>'+
										'</div>');
						this.select_left_content.append($leftItem);
					break;
					default:break;
					}
						
				}
			}
			if(this.options.rightData){
				arguments[1] !== undefined ? rightData = rightDataArray:rightData = this.options.rightData;
				for(var i=0;i<rightData.length;i++){
					switch(this.options.attrNum){
					case 1:
						var $righItem = $('<div class="select-body-item">'+
											'<p>'+rightData[i].showText+'</p>'+
											'<p class="select-right-arrow" style="display:none"></p>'+
										'</div>');
						this.select_right_content.append($righItem);
					break;
					case 2:
						var $righItem = $('<div class="select-body-item">'+
											'<p name="'+rightData[i].name+'">'+rightData[i].showText+'</p>'+
											'<p class="select-right-arrow" style="display:none"></p>'+
										'</div>');
						this.select_right_content.append($righItem);
					break;
					default:break;
					}
				}
			}
			this.bindEvent();	
		},
		bindEvent : function(){
			$('.select-body-item').unbind('click');
			$('.select-body-item').bind('click',this.dealClick);
			$('.select-body-item').unbind('mouseover');
			$('.select-body-item').bind('mouseover',this.dealMouseover);
			$('.select-body-item').unbind('mouseout');
			$('.select-body-item').bind('mouseout',this.dealMouseout);
		},
		dealClick : function(event){
			event = event || window.event;
			var thisClass = $(event.currentTarget).children().eq(1).attr('class');
			switch(thisClass){
			case 'select-left-arrow':
				$(event.currentTarget).children().eq(1).removeClass('select-left-arrow').addClass('select-right-arrow').hide();
				this.select_right_content.append($(event.currentTarget).clone(true));
				break;
			case 'select-right-arrow':
				$(event.currentTarget).children().eq(1).removeClass('select-right-arrow').addClass('select-left-arrow').hide();
				if(!this.options.single){
					this.select_left_content.append($(event.currentTarget).clone(true));
				}
				break;
			default:break;
			}
			$(event.currentTarget).remove();
		},
		dealMouseover : function(event){
			event = event || window.event;
			$(event.currentTarget).find('.select-left-arrow,.select-right-arrow').css('display','inline');
		},
		dealMouseout : function(event){
			event = event || window.event;
			$(event.currentTarget).find('.select-left-arrow,.select-right-arrow').hide();
		},
		getList : function(){//获取list值，对外接口,返回右侧框中需要所有list的需要字段组成的数组，如有额外需求，使用者需要自己处理该数组达到接口目的
			var rightItems = this.select_right_content.find('.select-body-item');
			var listValue = [];
			switch(this.options.getField){
			case 'text':
				for(var i=0;i<rightItems.length;i++){
					listValue.push(rightItems.eq(i).children().eq(0).text());
				}
			break;
			case 'name':
				for(var i=0;i<rightItems.length;i++){
					listValue.push(rightItems.eq(i).children().eq(0).attr('name'));
				}
			break;
			default:break;
			}
			
			return listValue;
		},
		reRender :function(leftData,rightData){//对外提供接口，重新渲染选区数据
			this.select_right_content.empty();
			if(this.options.leftData && this.options.rightData){
//				console.log("both");
				this.select_left_content.empty();
				this.initData(leftData,rightData);
			
			}else if(this.options.leftData){
//				console.log("left");
				this.select_left_content.empty();
				this.initData(leftData);
		
			}else if(this.options.rightData){
//				console.log('right');
				this.select_left_content.empty();
				this.initData(rightData);
			}
		},
		renderRightData : function(item){
			switch(this.options.attrNum){
			case 1:
				var $righItem = $('<div class="select-body-item">'+
									'<p>'+item.showText+'</p>'+
									'<p class="select-right-arrow" style="display:none"></p>'+
								'</div>');
				this.select_right_content.append($righItem);
			break;
			case 2:
				var $righItem = $('<div class="select-body-item">'+
									'<p name="'+item.name+'">'+item.showText+'</p>'+
									'<p class="select-right-arrow" style="display:none"></p>'+
								'</div>');
				this.select_right_content.append($righItem);
			break;
			default:break;
			}
			this.bindEvent();
		},
		moveAllRightData : function(){
			this.select_right_content.empty();
		}
		
	});
}());