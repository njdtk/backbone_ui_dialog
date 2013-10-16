var PagerModel = Backbone.Model.extend({

	defaults : function() {
		return {
			pageNo : 1,
			pageSize : 10,
			pageList : [ 10, 20, 30 ],
			total : 45
		};

	},
	get : function(attr) {
		if (attr == "total") {
			return this.attributes[attr] < 1 ? 0 : this.attributes[attr];

		} else {
			return this.attributes[attr] < 1 ? 1 : this.attributes[attr];
		}

	}
});

var PagerView = Backbone.View
		.extend({
			// 指定el,外层为div标签，id为"pager"
			tagName : 'div',
			className : 'datagrid_pager',
			// 初始化该对象属性值
			model : null,
			// datagridEl:null,
			url : null,

			// 根据参数pager初始化对象
			initialize : function(pagerModel) {
				this.model = pagerModel;
				
				this.render();
				
				this.model.bind('change', this.reRender, this);

			},
			events : {
			// "click a.clickabled" : "doPage",
			// 'change select[class="pagination-page-list"]':"autoRefresh"
			// "click #fresh" : "doPage"
			},

			// 初次渲染处理函数
			render : function() {
				//console.log(this.model);
				//console.log("page render")
				$(this.model.get("parentEl")).after($(this.el).html(this.template(this.model)));
				this.doPageCss();
				//return this;
			},

			/**
			 * 当this.model数据有改动时，重新渲染分页控件
			 */
			reRender : function() {
				//console.log("rerender")
				//console.log(this.model)
				
				var pageSize = this.model.get("pageSize");
				
				var pageNo = this.model.get("pageNo");
				
				var pageList = this.model.get("pageList");
				
				var total = this.model.get("total");

				// var pageCount = this.model.get("pageCount");
				var pageCount = Math.ceil(total / pageSize)===0?1:Math.ceil(total / pageSize);
				
				var startNo = (total == 0) ? 0 : (pageNo - 1) * pageSize + 1;
				
				var endNo = (pageCount == pageNo || pageCount===0) ? total : pageNo * pageSize;
				
				this.model.set({
					"pageCount" : pageCount
				});

				$(this.model.get("parentEl")).next().find("input.pager_num").val(pageNo);
				
				$(this.model.get("parentEl")).next().find("span#pageCount").html(pageCount);
				
				$(this.model.get("parentEl")).next().find("span#startNo").html(startNo);
				
				$(this.model.get("parentEl")).next().find("span#endNo").html(endNo);
				
				$(this.model.get("parentEl")).next().find("span#total").html(total);

				this.doPageCss();

			},

			/**
			 * 初次渲染
			 */
			doPageCss : function() {

				$(this.model.get("parentEl")).next().find("a").removeClass("clickabled").addClass("disabled");
				
				$(this.model.get("parentEl")).next().find("#fresh").removeClass("disabled").addClass("clickabled");
				
				var pageCount = this.model.get("pageCount");
				
				var pageNo = this.model.get("pageNo");				
				
				if (pageCount > 1) {
				
					if (pageNo < pageCount && pageNo > 1) {
						$(this.model.get("parentEl")).next().find("a").removeClass("disabled").addClass("clickabled");
					}
					
					if (pageNo == 1) {
						$(this.model.get("parentEl")).next().find("#last").removeClass("disabled").addClass("clickabled");
						$(this.model.get("parentEl")).next().find("#next").removeClass("disabled").addClass("clickabled");
					}
					
					if (pageNo == pageCount) {
						$(this.model.get("parentEl")).next().find("#prev").removeClass("disabled").addClass("clickabled");
						$(this.model.get("parentEl")).next().find("#fir").removeClass("disabled").addClass("clickabled");
					}
					
				}
				
			},
			
			/**
			 * 点击pager控件上的操作按钮时，执行该函数
			 */
			doPage : function(e) {
				
				var elem = $(e.currentTarget).attr("id");
				
				var pageNo = this.model.get("pageNo");
				
				var pageCount = this.model.get("pageCount");
				
				if (elem === "prev") {
				
					this.model.set({
						"pageNo" : pageNo > 1 ? (pageNo - 1) : 1
					});
					
				}
				
				if (elem === "next") {
					
					this.model.set({
						"pageNo" : pageNo < pageCount ? (pageNo + 1): pageCount
					});
					
				}
				
				if (elem === "fresh") {
				
					$(this.model.get("parentEl")).next().find(".pager_load").addClass("pager_loading");
					
					var pageNo_val = $(this.model.get("parentEl")).next().find(".pager_num").val();
					
					var patternNum = /^[0-9][0-9]*/;
					
					if (patternNum.test(pageNo_val)) {
						pageNo_val = Number(pageNo_val) > pageCount ? pageCount: (Number(pageNo_val) < 1 ? 1: Number(pageNo_val));
					} else {

						pageNo_val = 1;
					}
					
					this.model.set({
						"pageSize" : Number($(this.model.get("parentEl")).next().find(".pager_list option:selected").val()),
						"pageNo" : 0
					});
					
					this.model.set({
						"pageSize" : Number($(this.model.get("parentEl")).next().find(".pager_list option:selected").val()),
						"pageNo" : pageNo_val
					});
				}
				
				if (elem === "fir") {
					this.model.set({
						"pageNo" : 1
					});
				}
				
				if (elem === "last") {
					this.model.set({
						"pageNo" : pageCount
					});
				}

			},
			
			/**
			 * 修改pageSize时调用该函数
			 */
			autoRefresh : function() {
			
				//console.log(this.model.get("parentEl"));
				this.model.set({
					"pageSize" : Number($(this.model.get("parentEl")).next().find(".pager_list option:selected").val()),
					"pageNo" : 1
				});
				
			},
			
			/**
			 * 初次渲染pager控件
			 * @param model
			 * @returns {String}
			 */
			template : function(model) {

				var pageSize = model.get("pageSize");
				
				var pageNo = model.get("pageNo");
				
				var pageList = model.get("pageList");
				
				var total = model.get("total");
				
				var pageOpts = '';

				var pageCount = Math.ceil(total / pageSize)===0?1:Math.ceil(total / pageSize);
				//console.log(pageCount)
				var startNo = (total == 0) ? 0 : (pageNo - 1) * pageSize + 1;
				
				var endNo = (pageCount == pageNo || pageCount===0) ? total : pageNo * pageSize;
				
				this.model.set({
					"pageCount" : pageCount
				});

				if (pageList && _(pageList).size() > 0) {
				
					var pageSizeIndex = 0;
					
					for ( var i = 0; i < _(pageList).size(); i++) {
						if (pageList[i] == pageSize) {
							pageSizeIndex = i;
							break;
						}
					}
					
					for ( var i = 0; i < _(pageList).size(); i++) {
						pageOpts += (i == pageSizeIndex) ? '<option selected="selected" value="'
								+ pageList[i]
								+ '">'
								+ pageList[i]
								+ '</option>'
								: '<option value="' + pageList[i] + '">'
										+ pageList[i] + '</option>';
					}
				}
				// '<div class="datagrid-pager pagination" id="pager">'+
				return '<div class="pager_left">'
						+ '<select class="pager_list">'
						+ pageOpts
						+ '</select>'
						+ '</div><div class="pager_separator"></div>'
						+ '<a id="fir" class="pager_btn disabled"><span class="pager_first"></span></a>'
						+ '<a id="prev" class="pager_btn disabled"><span class="pager_prev"></span></a>'
						+ '<div class="pager_separator"></div><div class="pager_left">&nbsp;第&nbsp;'
						+ '<input class="pager_num" size="2" value="'
						+ pageNo
						+ '">&nbsp;页，共&nbsp;<span id="pageCount">'
						+ pageCount
						+ '</span>&nbsp;页&nbsp;'
						+ ' </div><div class="pager_separator"></div>'
						+ '<a id="next" class="pager_btn disabled"><span class="pager_next"></span></a>'
						+ '<a id="last" class="pager_btn disabled"><span class="pager_last"></span></a>'
						+ '<div class="pager_separator"></div><a id="fresh" class="pager_btn clickabled"><span class="pager_load"></span></a>'
						+ '<div class="pager_info">显示从<span id="startNo">'
						+ startNo
						+ '</span> 到 <span id="endNo">'
						+ endNo
						+ '</span> ，共<span id="total">'
						+ total
						+ '</span>条记录</div>';
			},
			
			/**
			 * 判断当前页是不是最后一页
			 */
			isLastPage:function(){
				var returnVal=false;
				var pageCount = Math.ceil(this.model.get("total") /this.model.get("pageSize"));
				if(pageCount===this.model.get("pageNo")){
					returnVal=true;
				}
				
				return returnVal;
			}
		});