/*
 * cs2c_rightMenuV0.1
 * @author peiqiong.yan
 * started on 2013.04.17 
 * completed on 2013.04.18
 *
 */
 
 var RightMenuView ={
 
	initialize:function(paramObj){
		this.e=paramObj.e;
		this.model=paramObj.model;
		this.options=paramObj.options.list;
		this.optFunc=paramObj.options.optFunc;
		//console.log(this.optFunc)
		if(paramObj.prevId){
			this.prevId=paramObj.prevId;
		}
		this.el="#"+this.prevId+"_"+"rightMenu";
		//console.log(this.model);
		//console.log(this.options);
		this.render();
	},
	
	render:function(){
		//do something here
		
		this.createMenu();
		
		
		this.bindEvents();
		this.showMenu();
	},
	
	createMenu:function(){
		$(this.el).remove();
		$("body").append("<div id='"+this.prevId+"_rightMenu"+"' class='cs2c_rightMenu'></div>");
		$(this.el).hide();
		
		//$(this.el).append("<ul class='ul_rightMenu'></ul>");
		
		
		for(var i=0; i<this.options.length; i++){
			if(i!=0){
				$(this.el).append("<span class='li_right_nline'>---------------</span><br>");
			}
			for(var j=0; j<this.options[i].length; j++){
				var curData = this.options[i][j];
				$(this.el).append(this.eletmpl(curData));
			}
		}
	},
	
	/**
	 *事件绑定：
	 *1）左击时隐藏右键菜单
	 */
	bindEvents:function(){
		
		$("#"+this.prevId).unbind("click");
		
		$("#"+this.prevId).bind("click",_(function(e){
			$(this.el).hide();
		}).bind(this));
			
		
		$(".li_right_rline").bind("mouseover",_(function(e){
			$(e.currentTarget).addClass("node_mouseover");
			
		}).bind(this));
		
		$(".li_right_rline").bind("mouseout",_(function(e){
			$(e.currentTarget).removeClass("node_mouseover");
			
		}).bind(this));
	},
	/*
	var strAppend="<span onclick='javascript: del("+JSON.stringify({"name":"noyes"})+")' style='cursor:pointer'>"
				+"<img src='img/plus.gif'/>"
				+"<img src='img/page.gif'/>"
				+"</span><br>"

	
	$("#cs2c_dtree").append(strAppend);
    });
	*/
	eletmpl:function(data){
		//this.model.optParam=data.optFunc;
		var returnVal = "<span class='li_right_rline' name='li_"+data.optParam+"' onclick='javascript:"
					+"RightMenuView.optFunc("+JSON.stringify(data.optParam)+","+JSON.stringify(this.model)+")' >"+data.optName+"</span><br>";
		return returnVal;
	},
	
	showMenu:function(){
		var e= this.e || window.event;
		var pos={};
		//console.log(e.button);
		if(e.button == "2"){
			document.oncontextmenu=false;
			pos.x=e.clientX+1;
			pos.y=e.clientY+1;			
			
			$(this.el)[0].style.left = pos.x+'px';
			$(this.el)[0].style.top = pos.y+'px';
			//PopMenu.style.top="0px";
			$(this.el).show();
			//prevent the default behavior
			if (document.all) {
				window.event.returnValue = false;
			}// for IE
			else {
				e.preventDefault();
			}
		}
	}
 
 };