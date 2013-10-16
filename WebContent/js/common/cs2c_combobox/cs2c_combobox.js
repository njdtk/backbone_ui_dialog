
$(function () {
	comboBoxView = Backbone.View.extend({
		el : $('body'),
		options:{
			parentElId:null,//div的 id
			multiple:true,// 是否多选，默认为是，false，单选
		    listData:null,//静态对象数组[{'showText':显示字段,'name':传值字段}]
		    required:null,//是否必填
		   
//		    initInput:'--请选择--',//初始化时input框中是否有提示，默认“--请选择--”，可以自定义，如果没有，给false
			url:null,//请求地址
			url_param:null,//请求参数
			list:null,//返回值的list字段
			name:null,
			showText:null,
		    more:true,//是否分页获取数据，默认false，不分页，要是分页，给true
		    pageSize:5//每页显示的条数
		     
		},
		initialize : function() {
			_.bindAll(this,'render','comboUI','comboListForm','eventBind');
			
			$('#'+this.options.parentElId+'').addClass('cs2c_combobox');
			
			this.comboPager = 1;
			this.inputShowArray = [];
			this.inputDataArray = [];
			
			this.render();
		},
		render : function() {
			this.comboUI();
			this.comboListForm();
			this.eventBind();
			
			$(document).bind('click',_(function(event) {// 点击输入框以外任意区域下拉框消失
				event = event || window.event;
					
				var x_left = this.comboInput.offset().left;
				var x_right = x_left + this.comboInput.width() + this.comboArrow.width();
				var y_top = this.comboInput.offset().top;
				var y_bottom = y_top + this.comboInput.height() + this.comboList.height();
					
				if (event.clientX < x_left || event.clientX > x_right|| event.clientY < y_top|| event.clientY > y_bottom) {
					this.comboList.hide();
				}
			}).bind(this));
			
		},
		comboUI : function(){
//			if(this.options.more){
				this.comboList = this.options.multiple?$('<div class="combobox_list"><div class="item_list"></div><div class="more_multiple"></div></div>'):
					$('<div class="combobox_list"><div class="item_list"></div><div class="more_singal"></div></div>');
//			}else{
//				this.comboList = $('<div class="combobox_list"><div class="item_list"></div></div>');
//			}	
			
			this.comboArrow = $('<div class="combobox_arrow"><img src="res/common/cs2c_combobox/img/combo-arrow.png"></div>');//
			this.comboInput = $('<input type="text" class="combobox_input"> readonly="readonly"');
				
			$('#'+this.options.parentElId+'').append(this.comboInput);
			$('#'+this.options.parentElId+'').append(this.comboArrow);
			$('body').append(this.comboList);
			
		},
		
		/**
		 * list渲染函数
		 */
		comboListForm :function(){
			var listData = "",
				listTempArray = [];
			if(this.options.listData){
				listData = this.comboListData? this.comboListData:this.options.listData;
			}else{
				listData = this.comboListData? this.comboListData:"";
			}
			
			if(listData){
				for(var i=0;i<listData.list.length;i++){
					var listItem = '<div class="combobox_list_item" name="'+listData.list[i].name+'">'+listData.list[i].showText+'</div>';
				       listTempArray.push(listItem);
				} 
			}
			
//			if(this.options.initInput){
//				this.comboList.append('<div class="combobox_list_item" style="text-align:center">-- 请选择 --</div>');
//			}
				
			this.comboList.find('.item_list').append(listTempArray.join(''));
			
			if(listData && listData.list.length>0 ){
				if(this.comboPager <= listData.count/5 && this.options.more){
					if(this.options.multiple){
						this.comboList.find('.more_multiple').empty().append('<span class="combo_select_all">全选</span><span class="combo_more" style="margin-left:40px">更多</span><span class="combo_select_clear" style="margin-left:40px">全不选</span>');
					}else{
						this.comboList.find('.more_singal').length>0 ? this.comboList.find('.more_singal').empty().append('<span class="combo_more">更多</span>'):
																		this.comboList.append('<div class="more_singal"><span class="combo_more">更多</span></div>');
					}
				}else {
					if(this.options.multiple){
						this.comboList.find('.more_multiple').empty().append('<span class="combo_select_all" style="float:left">全选</span><span class="combo_select_clear" style="float:right">全不选</span>');
					}else{
						this.comboList.find('.more_singal').remove();
					}
				}
			}
		},
		
		/**
		 * list定位
		 */
		cssPosition : function(){
			var p_y = this.comboInput.offset().top + this.comboInput.height()+2;
			var p_x = this.comboInput.offset().left;
			this.comboList.css({
						left:p_x,
						top:p_y
					});
		},
		
		/**
		 * 事件绑定函数
		 */
		eventBind : function(){
			$('#'+this.options.parentElId+'').find('.combobox_arrow').unbind('click');
			this.comboList.find('.combobox_list_item').unbind('click');
			this.comboList.find('.combobox_list_item').unbind('mouseover');
			this.comboList.find('.combobox_list_item').unbind('mouseout');	
			this.comboList.find('.combo_more').unbind('click');
			this.comboList.find('.combo_select_all').unbind('click');
			this.comboList.find('.combo_select_clear').unbind('click');
			
			$('#'+this.options.parentElId+'').find('.combobox_arrow').bind('click',_(function(event){
				this.cssPosition();
				this.comboList.find('.combobox_list_item').removeClass('list_item_hover');
				if(this.comboList.is(':hidden')){
					this.comboList.show();
				}else{
					this.comboList.hide();
				}
				
			}).bind(this));
			
			this.comboList.find('.combobox_list_item').bind('click',_(function(event){this.clickAction(event);}).bind(this));
	   		
			this.comboList.find('.combobox_list_item').bind('mouseover',_(function(event){
				if(!$(event.currentTarget).hasClass('list_item_cover')){
					$(event.currentTarget).addClass('list_item_hover');
				}	
			}).bind(this));
			
			this.comboList.bind('mouseout',_(function(event){
				this.comboList.find('.combobox_list_item').removeClass('list_item_hover');
			}).bind(this));	
			
			this.comboList.find('.combo_more').bind('click',_(function(event){this.comboPager ++;this.moreAction();}).bind(this));
			this.comboList.find('.combo_select_all').bind('click',_(function(event){this.selectAll();}).bind(this));
			this.comboList.find('.combo_select_clear').bind('click',_(function(event){this.clearAll();}).bind(this));
			
		},
		
		/**
		 * listitem点击处理管理函数
		 * @param event
		 */
		clickAction : function(event){
			
			if(this.options.multiple){
				this.multipleClick(event);
			}else{
				this.singleClick(event);
			}
		},
		
		/**
		 * 单选模式点击处理函数
		 * @param event
		 */
		singleClick : function(event){
			this.comboList.find('.combobox_list_item').removeClass('list_item_cover');
			$(event.currentTarget).addClass('list_item_cover');
			
			this.inputShowArray.pop();
			this.inputShowArray.push($(event.currentTarget).text());
			
			this.inputDataArray.pop();
			this.inputDataArray.push($(event.currentTarget).attr('name'));
			
			this.comboInput.val($(event.currentTarget).text());
			
			this.comboList.hide();
		},
		
		/**
		 * 多选模式点击处理函数
		 * @param event
		 */
		multipleClick :function(event){
			if($(event.currentTarget).hasClass('list_item_cover')){
				$(event.currentTarget).removeClass('list_item_cover');
			}else{
				$(event.currentTarget).addClass('list_item_cover');
			}
			//判断数组中是否已经包含选择的内容，如果没有，添加，如果有，删除
			if(this.inputShowArray.indexOf($(event.currentTarget).text())<0){
				this.inputShowArray.push($(event.currentTarget).text());
				this.inputDataArray.push($(event.currentTarget).attr('name'));
			}else{
				this.inputShowArray = this.inputShowArray.slice(0,this.inputShowArray.indexOf($(event.currentTarget).text()))
					.concat(this.inputShowArray.slice(this.inputShowArray.indexOf($(event.currentTarget).text())+1,this.inputShowArray.length));
				this.inputDataArray = this.inputDataArray.slice(0,this.inputDataArray.indexOf($(event.currentTarget).attr('name')))
				.concat(this.inputDataArray.slice(this.inputDataArray.indexOf($(event.currentTarget).attr('name'))+1,this.inputDataArray.length));
			}
			
			this.comboInput.val(this.inputShowArray.join('，'));
		    		       
		},
		
		/**
		 * 重新渲染list
		 */
		reRenderComboList : function(){
			this.comboPager = 1;
			this.comboInput.val('');
			this.comboList.find('.item_list').empty();
			
			if(this.options.url){
				this.dataAjax();
			}
	
			this.comboListForm();
			this.eventBind();
		},
		
		/**
		 * 数据渲染函数
		 * 重新包装一下需要的字段
		 */
		dataAjax : function(){
			this.comboListData = {
					'count':null,
					'list':[]
			};
			//判断是否分页
			if(this.options.more){
				this.options.url_param.pageNo = this.comboPager;
				this.options.url_param.pageSize = this.options.pageSize;
			}
			
			$.getJSON(this.options.url,this.options.url_param, _(function(data) {
				this.comboListData.count = data.count;
				$.each(data[this.options.list], _(function(i, list) {
						
					var itemObj = {
							'name':list[this.options.name],
							'showText':list[this.options.showText]
					};
					
						
					this.comboListData.list.push(itemObj);
						
				}).bind(this));
			}).bind(this)).error(function(data) {
				cs2c_Message(commonOpt.cs2c_error(data).errCode + commonOpt.cs2c_error(data).errMsg);
			});
		},
		
		/**
		 * 更多的处理函数
		 */
		moreAction : function(){
			this.dataAjax();
			this.comboListForm();
			this.eventBind();
		},
		
		/**
		 * 全选的处理函数
		 */
		selectAll : function(){
			var itemList = this.comboList.find('.combobox_list_item');
			$.each(itemList,_(function(i,item){
				$(item).addClass('list_item_cover');
				//判断数组中是否已经包含选择的内容，如果没有，添加
				if(this.inputShowArray.indexOf($(item).text())<0){
					this.inputShowArray.push($(item).text());
					this.inputDataArray.push($(item).attr('name'));
				}
				
			}).bind(this));
			this.comboInput.val(this.inputShowArray.join('，'));
		},
		
		/**
		 *全部选的处理函数 
		 */
		clearAll : function(){
			var itemList = this.comboList.find('.combobox_list_item');
			$.each(itemList,_(function(i,item){
				$(item).removeClass('list_item_cover');
				
			}).bind(this));
			//清空数组
			this.inputShowArray = [];
			this.inputDataArray = [];
			
			this.comboInput.val('');
		},
		
		/**
		 * 获取combobox的值
		 * @returns：逗号分隔的字符串
		 */
		getComboVal : function(){
			return this.inputDataArray.join(',');	      
		},
		getPageNo : function(){
			return this.comboPager;//获取点击请求页数
		}
		
	});

}());


