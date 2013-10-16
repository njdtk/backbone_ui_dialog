/**
 * 
 * this is a manage view which user to initialize datagrid component and pager
 * component according the options
 * 
 * @author peiqiong.yan
 * 
 */

var TableManageView = Backbone.View.extend({

	el : 'body',

	options : {

		parentEl : 'body', // specify the position where the datagrid render
		// （such as
		// “#eleId”,".eleClass","div[name='eleName']" etc.）

		code : false, // specify whether to show the serial number column

		checkbox : false, // specify whether to show the checkbox column

		columns : [], // specify the content columns

		emptyContent : '暂无数据', // the prompt message when there are no data in
		// datagrid

		onItemClick : Backbone.UI.noop, // specify the processing function when
		// one item is clicked

		onCheckboxClick : Backbone.UI.noop, // specify the processing function
		// when one checkbox is clicked

		sortable : false, // specify whether to sort

		onSort : null,

		itemView : null, // refer to the element type and style of one item

		maxHeight : null, // refer to the maximum height

		url : null, // refer to the url which access to remote data

		pagerModel : null
	// refer to the object which stores pager information

	},

	tableView : null, // refer to the datagrid component

	pagerView : null, // refer to the pager component

	/**
	 * 
	 * 根据参数options初始化pagerView对象和tableView对象
	 * 
	 * pagerView、tableView以及ManageView共享一个数据对象options
	 * 
	 * 其中一个View改变options中的值，则其他的View也会相应得进行重新渲染
	 * 
	 * 由此完成pagerView和tableView的一致性渲染
	 * 
	 */

	initialize : function() {

		// 如果需要显示分页控件，则初始化pagerModel

		if (this.options.pager) {

			// define pagerModel according to this.options.pager
			// 根据用户指定参数初始化pagerModel

			this.options.pagerModel = new PagerModel();

			this.options.pagerModel.set({

				// url : this.options.url,

				pageNo : this.options.pager.pageNo,

				pageSize : this.options.pager.pageSize,

				pageList : this.options.pager.pageList,

				parentEl : this.options.parentEl

			});

		}

		// wrapped a div based on the element which specified by user

		$(this.options.parentEl).wrap("<div class='cs2c_datagrid'></div>");

		// initialize tableView with "options"

		if (this.tableView) {

			this.tableView.undelegateEvents();

		}

		this.tableView = new DatagridView(this.options);

		if (this.options.pager) {

			if (this.pagerView) {

				this.pagerView.undelegateEvents();

			}

			this.pagerView = new PagerView(this.options.pagerModel);

		}

		// 绑定事件

		this.bindEvents();

		// commonOpt.createDatagridScrollBar();//渲染表格滚动条(xiran)

	},

	/**
	 * 
	 * 事件绑定
	 * 
	 */

	bindEvents : function() {

		if (this.options.pager) {

			// 分页控件上操作扭（如“上一步”、“下一步”、“首页”、“最后一页”、“刷新”）的事件处理绑定
			// console.log($(this.options.parentEl).next().find("a.clickabled"));
			$(this.options.parentEl).next().find("a.disabled").unbind("click");
			$(this.options.parentEl).next().find("a.clickabled").unbind("click").bind("click", _(function(e) {
				 //console.log("dopage")
				this.doPage(e);

			}).bind(this));

			// 分页控件上的pageSize改变时的事件处理绑定

			$(this.options.parentEl).next().find('select[class="pager_list"]').unbind("change").bind("change",
					_(function() {

						this.autoRefresh();

					}).bind(this));

		}

	},

	/**
	 * 
	 * 分页控件操作按钮处理函数：通过调用pagerView的同名函数doPage来完成
	 * 
	 */

	doPage : function(e) {

		// 重新计算pagerModel的各项属性值，并重新渲染分页控件
		// console.log($(e.currentTarget))
		this.pagerView.doPage(e);

		// 后端数据已经分好页了，执行该分支

		// 根据pagerModel重新获取数据，重置tableView.allModels

		// this.options.pagerModel.set({{total:tal}});

		this.updateTable();

		// 相应样式添加

		// console.log($(this.options.parentEl).parent().next())
		if ($(this.options.parentEl).next().find(".pager_loading")) {

			$(this.options.parentEl).next().find(".pager_loading").removeClass("pager_loading");

		}

	},

	/**
	 * 
	 * 分页控件pageSize更改处理函数：通过调用pagerView的同名函数autoRefresh来完成
	 * 
	 */

	autoRefresh : function() {

		// 重新计算pagerModel的各项属性值，并重新渲染分页控件

		this.pagerView.autoRefresh();

		// 后端数据已经分好页了，执行该分支

		// 根据pagerModel重新获取数据，重置tableView.allModels

		// this.options.pagerModel.set({{total:tal}});

		this.updateTable();

		// commonOpt.createDatagridScrollBar();//渲染表格滚动条(xiran)

	},

	/**
	 * 
	 * 获取选中的model列表
	 * 
	 * @returns 返回一个model数组
	 * 
	 */

	getSelectedModels : function() {

		return this.tableView.getSelectedModels();

	},

	/**
	 * 
	 * 调用tableView中的getData()和setCollection()方法重新获取数据并渲染表格
	 * 
	 */

	updateTable : function() {

		// if(this.options.pagination){

		this.tableView.getData();

		// }

		this.tableView.setCollection();

		this.tableView.resizeTable();

		this.bindEvents();

	},

	/**
	 * 
	 * 判断当前页是否为最后一页
	 * 
	 * @returns
	 * 
	 */

	isLastPage : function() {

		return this.pagerView.isLastPage();

	}

});