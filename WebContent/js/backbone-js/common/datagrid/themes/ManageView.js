/**
 * 表格控件和分页控件管理视图对象，用于根据用户参数初始化datagridView或pagerView
 * @author peiqiong.yan
 */

var TableManageView = Backbone.View.extend({
	el : 'body',
	options : {
		parentEl : 'body', //指定控件显示位置（“#eleId”,".eleClass","div[name='eleName']" 均可）
		code : false, //指定是否显示序号列
		checkbox : false, //指定是否显示checkbox列
		columns : [], //指定列表内容显示列
		emptyContent : 'no entries', //指定当无数据项时的提示信息
		onItemClick : Backbone.UI.noop,	//指定单击列表行时的处理函数
		sortable : false,	//指定是否排序
		onSort : null,
		itemView : null,
		maxHeight : null,	//指定最大高度
		url : null,	//指定获取远程数据的url
		pagerModel : null	//定义用于存储分页信息的对象model
	},
	tableView : null, //表示表格控件
	pagerView : null, //表示分页控件
	
	/**
	 * 根据参数options初始化pagerView对象和tableView对象
	 * pagerView、tableView以及ManageView共享一个数据对象options
	 * 其中一个View改变options中的值，则其他的View也会相应得进行重新渲染
	 * 由此完成pagerView和tableView的一致性渲染
	 */
	initialize : function() {
		
		
		
		//定义pagerModel
		this.options.pagerModel = new PagerModel();
		
		//如果需要显示分页控件，则初始化pagerModel
		if (this.options.pager) {
			this.options.pagerModel.set({
				//url : this.options.url,
				pageNo : this.options.pager.pageNo,
				pageSize : this.options.pager.pageSize,
				pageList : this.options.pager.pageList,
				parentEl : this.options.parentEl
			});
		}

		//根据用户指定元素外包一个div
		$(this.options.parentEl).wrap("<div class='cs2c_datagrid'></div>");
		
		//根据options参数定义tableView对象
		if (this.tableView) {
			this.tableView.undelegateEvents();
		}
		this.tableView = new DatagridView(this.options);
		
		//根据options参数定义pagerView对象
		if (this.options.pager) {
			if (this.pagerView) {
				this.pagerView.undelegateEvents();
			}
			this.pagerView = new PagerView(this.options.pagerModel);
		}
		
		//绑定事件
		this.bindEvents();
		commonOpt.createDatagridScrollBar();//渲染表格滚动条(xiran)

	},
	
	/**
	 * 事件绑定
	 */
	bindEvents : function(){
		
		//分页控件上操作扭（如“上一步”、“下一步”、“首页”、“最后一页”、“刷新”）的事件处理绑定
		$("a.clickabled").unbind("click").bind("click", _(function(e) {			
			this.doPage(e);
			}).bind(this));
		
		//分页控件上的pageSize改变时的事件处理绑定
		$(this.options.parentEl).next().find('select[class="pager_list"]')
				.unbind("change").bind("change", _(function() {
					this.autoRefresh();
				}).bind(this));
	},

	/**
	 * 分页控件操作按钮处理函数：通过调用pagerView的同名函数doPage来完成
	 */ 
	doPage : function(e) {
		//重新计算pagerModel的各项属性值，并重新渲染分页控件
		
		this.pagerView.doPage(e);

		// 后端数据已经分好页了，执行该分支
		// 根据pagerModel重新获取数据，重置tableView.allModels
		// this.options.pagerModel.set({{total:tal}});
		
		this.updateTable();
		//console.log("freshffff")
		//相应样式添加
		if ($(this.options.parentEl).next().find(".pager_loading")) {
			$(this.options.parentEl).next().find(".pager_loading").removeClass(
					"pager_loading");
		}
		
	},

	/**
	 * 分页控件pageSize更改处理函数：通过调用pagerView的同名函数autoRefresh来完成
	 */ 
	autoRefresh : function() {
		//重新计算pagerModel的各项属性值，并重新渲染分页控件
		this.pagerView.autoRefresh();

		// 后端数据已经分好页了，执行该分支
		// 根据pagerModel重新获取数据，重置tableView.allModels
		// this.options.pagerModel.set({{total:tal}});
		this.updateTable();
		commonOpt.createDatagridScrollBar();//渲染表格滚动条(xiran)
		
	},
	
	/**
	 * 获取选中的model列表
	 * @returns 返回一个model数组
	 */
	getSelectedModels:function(){
		return this.tableView.getSelectedModels();
	},
	
	/**
	 * 调用tableView中的getData()和setCollection()方法重新获取数据并渲染表格
	 */
	updateTable:function(){
		//if(this.options.pagination){
			this.tableView.getData();		
		//}
		this.tableView.setCollection();
		this.bindEvents();
	},
	
	/**
	 * 判断当前页是否为最后一页
	 * @returns
	 */
	isLastPage:function(){
		return this.pagerView.isLastPage();
	}

	
});