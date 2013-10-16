var libMathod = {
	/**
	 * 判断是否是闰年 year int型 return 1->是;0->否;
	 */
	'isLeapYear' : function(year) {
		if (year % 4 === 0) {
			if (year % 100 === 0) {
				return year % 400 === 0 ? 1 : 0;
			} else {
				return 1;
			}
		} else {
			return 0;
		}
	},
	/**
	 * 判断星期 parm string '2013-06-25' return 0-6;
	 */
	'chkWeek' : function(parm) {
		var year = parseInt(parm.substring(0, 5)), c = parseInt(parm.substring(0, 2)), y = parseInt(parm
				.substring(2, 4)), m = parseInt(parm.substring(5, 7)), flag = 0;
		if (m < 3) {
			year = year - 1;
			c = parseInt(year.toString().substring(0, 2));
			y = parseInt(year.toString().substring(2, 4));
			switch (m) {
			case 1:
				m = 13;
				break;
			case 2:
				m = 14;
				break;
			default:
				break;
			}
		}
		d = parseInt(parm.substring(8, 10));
		flag = (y + parseInt(y / 4) + parseInt(c / 4) - 2 * c + parseInt(26 * (m + 1) / 10) + d - 1) % 7;
		return flag < 0 ? flag + 7 : flag;
	},
	/**
	 * 判断一个月有多少天 parm string '2013-06-25' return 这个月的天数;
	 */
	'mouthDays' : function(parm) {
		var m = parseInt(parm.substring(6, 8)), year = parseInt(parm.substring(0, 5));
		if (m === 1 || m === 3 || m === 5 || m === 7 || m === 8 || m === 10 || m === 12) {
			return 31;
		} else if (m === 4 || m === 6 || m === 9 || m === 11) {
			return 30;
		} else {
			return this.isLeapYear(year) ? 29 : 28;
		}
	},
	'formCalendar' : function(parm) {
		var calendar = new Array(), // 先声明一维
		modifydate = parm.substring(0, 8) + '01', week = this.chkWeek(modifydate), // 判断输入月的第一天是周几
		days = this.mouthDays(parm), // 判断输入月有多少天
		daytemp = 0, daytempbefore = days, daytempafter = 1;
		for ( var i = 0; i < 6; i++) { // 一维长度为7
			calendar[i] = new Array(); // 在声明二维
			for ( var j = 0; j < 7; j++) { // 二维长度为6
				calendar[i][j] = 0;
			}
		}
		for (i = 0; i < 6; i++) {
			for (j = 0; j < 7; j++) {
				if (i * 7 + j >= week && i * 7 + j < days + week) {
					calendar[i][j] = ++daytemp;
				}
			}
		}
		return calendar;
	}

};

$(function() {
	datePickerView = Backbone.View.extend({
		el : $('body'),
		options : {
			id : null,// input id
			dateFormatter : 1,// 格式化日期 1->yyyy-mm-dd; 2->yyyy/mm/dd;//
			// 3->m/d/yyyy
			initInput : false,// 初始化时input框中是否有值 默认无false，true初始化为当前系统时间
			timePicker : false
		},
		initialize : function() {
			_.bindAll(this, 'render', 'showCalendar');

			this.year = new Date().getFullYear();
			this.mouth = new Date().getMonth() + 1;
			this.day = new Date().getDate();
			$('#' + this.options.id + '').unbind('focus');
			$('#' + this.options.id + '').bind('focus', this.showCalendar);
			this.render();
		},
		render : function() {
			this.mainView = new mainPickerView(this.year, this.mouth, this.day, this.options);
			if (this.options.timePicker) {
				this.timeView = new timePickerView({
					'id' : '' + this.options.id + '_time_body'
				});
			}
		},
		showCalendar : function() {
			// if ($('.date_mouth_body').length > 0 || $('#' + this.options.id +
			// '').val() === "") {
			// if ($('#' + this.options.id + '').val() === "") {
			// $('#'+this.options.id+'_calendar_body').find('td').removeClass('date_selected');
			// }
			// this.mainView.render(this.year, this.mouth);
			// }
			this.mainView.calendarUIDom.show();
			if (!$('#' + this.options.id + '').val()) {
				this.mainView.showCalendar(this.year, this.mouth, this.day.toString(), this.options);
				if (this.timeView) {
					this.timeView.setValue();
				}
			} else {
				this.mainView.calendarUIDom.show();
			}

		}
	});

	mainPickerView = Backbone.View
			.extend({
				el : $('body'),
				initialize : function(year, mouth, day, options) {
					_.bindAll(this, 'render', 'calendarBodyForm', 'mainEventBind', 'hideCalendar', 'showCalendar',
							'dayClickDeal', 'todayBtnClickDeal', 'okBtnClickDeal', 'titleMove', 'formatterDate',
							'CalendarUI', 'yearSelected', 'cssPosition');
					this.options = options;
					this.year = this.yearTemp = year || new Date().getFullYear();
					this.mouth = this.mouthTemp = mouth || new Date().getMonth() + 1;
					this.day = this.dayTemp = day || new Date().getDate();
					this.dateParm = this.dateParmTemp = this.options.initInput ? this.formatterDate(this.yearTemp,
							this.mouthTemp, this.dayTemp, 1) : this.formatterDate(this.yearTemp, this.mouthTemp,
							this.dayTemp, 0);

					this.render();
				},
				render : function(year, mouth, dateParm) {
					var renderyear = year || this.yearTemp, rendermouth = mouth || this.mouthTemp, renderdateParm = dateParm
							|| this.dateParm;
					if ($('#' + this.options.id + '_date_body').length === 0) {
						this.calendarUIDom = $('<div class="cs2c_date_picker"></div>');
						this.calendarUIDom.append('<div class="date_title">' + '<div id="' + this.options.id
								+ '_date_move_left" class="date_move_left"></div>' + '<div id="' + this.options.id
								+ '_date_title_content" class="date_title_content"></div>' + '<div id="'
								+ this.options.id
								+ '_date_move_right" class="date_move_right" style="float:right"></div>' + '</div>'
								+ '<div id="' + this.options.id + '_date_body" class="date_body">'
								+ '<div class="date_table_title"></div>' + '<div class="date_table_content"></div>'
								+ '</div>' + '<span id="' + this.options.id + '_time_body" class="spinner"></span>'
								+ '<div class="date_button">' + '<button id="' + this.options.id
								+ '_date_button_today">今天</button>' + '<button id="' + this.options.id
								+ '_date_button_ok" style="margin-left:10px">确定</button>' + '<button id="'
								+ this.options.id + '_date_button_off" style="margin-left:10px">关闭</button>' + '</div>'
								+ '<div style="clear:both"></div>');
					} else {
						this.calendarUIDom = $('#' + this.options.id + '_date_body').parent();
					}
					$('#' + this.options.id + '').parent().append(this.calendarUIDom);
					this.showCalendar(renderyear, rendermouth, renderdateParm, this.options);
				},
				calendarBodyForm : function(year, mouth, dateParm, options) {
					var $dateTitle = $('<span><span id="' + options.id
							+ '_cs2c_datepicker_year">2013</span>年<span id="' + this.options.id
							+ '_cs2c_datepicker_mouth">6</span>月</span>'), $dateBody = $('<div class="date_table_title">'
							+ '<table>'
							+ '<tr>'
							+ '<td>日</td>'
							+ '<td>一</td>'
							+ '<td>二</td>'
							+ '<td>三</td>'
							+ '<td>四</td>'
							+ '<td>五</td>'
							+ '<td>六</td>'
							+ '</tr>'
							+ '</table>'
							+ '</div>'
							+ '<div class="date_table_content">'
							+ '<table id="'
							+ options.id
							+ '_calendar_body"></table>' + '</div>');
					$('#' + this.options.id + '_date_title_content').empty().append($dateTitle);
					$('#' + this.options.id + '_date_body').empty().append($dateBody);
					$('#' + this.options.id + '_cs2c_datepicker_year').text(year);
					$('#' + this.options.id + '_cs2c_datepicker_mouth').text(mouth);
					this.CalendarUI(dateParm);
					// $('#'+this.options.id+'_date_title_content').unbind('click',
					// this.yearSelected);
					// $('#'+this.options.id+'_date_title_content').bind('click',
					// this.yearSelected);
					$('#' + this.options.id + '_calendar_body').find('td').unbind('click');
					$('#' + this.options.id + '_calendar_body').find('td').bind('click', this.dayClickDeal);
				},
				/**
				 * 主体事件绑定函数
				 */
				mainEventBind : function() {
					$('#' + this.options.id + '_date_button_today').unbind('click');
					$('#' + this.options.id + '_date_button_today').bind('click', this.todayBtnClickDeal);
					$('#' + this.options.id + '_date_button_ok').unbind('click');
					$('#' + this.options.id + '_date_button_ok').bind('click', this.okBtnClickDeal);
					$('#' + this.options.id + '_date_button_off').unbind('click');
					$('#' + this.options.id + '_date_button_off').bind('click', this.hideCalendar);
					$('#' + this.options.id + '_date_move_left,#' + this.options.id + '_date_move_right').unbind(
							'click');
					$('#' + this.options.id + '_date_move_left,#' + this.options.id + '_date_move_right').bind('click',
							this.titleMove);
				},
				/**
				 * 格式化日期， 1、例'2013-06-25' 2、例'2013/06/05' 3、例'6/5/2013' 4、flag
				 * 1:input框中显示日期；0:input框不显示日期 显示在input框里并且从日期控件中取值的格式 返回日期
				 */
				formatterDate : function(year, mouth, day, flag) {
					switch (this.options.dateFormatter) {
					case 1:
						if (mouth < 10) {
							if (day < 10) {
								showDate = '' + year + '-0' + mouth + '-0' + day + '';
							} else {
								showDate = '' + year + '-0' + mouth + '-' + day + '';
							}
						} else {
							if (day < 10) {
								showDate = '' + year + '-' + mouth + '-0' + day + '';
							} else {
								showDate = '' + year + '-' + mouth + '-' + day + '';
							}
						}
						break;
					case 2:
						mouth < 10 ? showDate = '' + year + '-0' + mouth + '/' + day + '' : showDate = '' + year + '/'
								+ mouth + '/' + day + '';
						break;
					case 3:
						showDate = '' + mouth + '/' + day + '/' + year + '';
						break;
					default:
						break;
					}
					flag ? $('#' + this.options.id + '').val(showDate) : $('#' + this.options.id + '').val("");
					return showDate;
				},
				CalendarUI : function(parm) {
					var calendar = libMathod.formCalendar(parm), mouth = parseInt(parm.substring(5, 7));

					$('#' + this.options.id + '_calendar_body').empty();

					for ( var i = 0; i < 6; i++) {
						var $tr = $('<tr></tr>');
						for ( var j = 0; j < 7; j++) {
							var $td = $('<td></td>');
							if (calendar[i][j] !== 0) {
								$td.addClass('calendar_item').html(calendar[i][j]);
								if (mouth === this.mouth && calendar[i][j] === this.day) {
									$td.addClass('date_today').addClass('date_selected');
								}
							}
							$tr.append($td);
						}
						$('#' + this.options.id + '_calendar_body').append($tr);
					}
				},
				hideCalendar : function() {
					this.calendarUIDom.hide();
				},
				showCalendar : function(year, mouth, dateParm, options) {
					var parm;
					if (dateParm.length < 3) {
						parm = options.initInput ? this.formatterDate(year, mouth, dateParm, 1) : this.formatterDate(
								year, mouth, dateParm, 0);
					} else {
						parm = dateParm;
					}
					this.cssPosition();
					this.calendarBodyForm(year, mouth, parm, options);
					this.mainEventBind();
				},
				dayClickDeal : function(event) {
					event = event || window.event;
					this.dayTemp = $(event.currentTarget).text();
					$(event.currentTarget).parent().parent().parent().find('td').removeClass('date_selected');
					$(event.currentTarget).addClass('date_selected');

				},
				todayBtnClickDeal : function() {
					this.options.timePicker ? this.formatterDate(this.year, this.mouth, this.day, 0) : this
							.formatterDate(this.year, this.mouth, this.day, 1);
					this.calendarBodyForm(this.year, this.mouth, this.dateParm, this.options);
				},
				okBtnClickDeal : function() {
					$('#' + this.options.id + '').val("");
					this.formatterDate(this.yearTemp, this.mouthTemp, this.dayTemp, 1);
					var val1 = $('#' + this.options.id + '').val();
					if (this.options.timePicker) {
						var val2 = $('#' + this.options.id + '_time_body-spinner-arrow').val();
						$('#' + this.options.id + '').val(val1 + " " + val2);
					} else {
						$('#' + this.options.id + '').val(val1);
					}
					this.hideCalendar();
				},
				titleMove : function(event) {
					event = event || window.event;
					var moveFlag = $(event.currentTarget).attr('class');
					var mouthTemp = this.mouthTemp, yearTemp = this.yearTemp;
					switch (moveFlag) {
					case 'date_move_left':
						mouthTemp--;
						if (mouthTemp === 0) {
							mouthTemp = 12;
							yearTemp--;
						}
						break;
					case 'date_move_right':
						mouthTemp++;
						if (mouthTemp === 13) {
							mouthTemp = 1;
							yearTemp++;
						}
						break;
					default:
						break;
					}
					this.yearTemp = yearTemp;
					this.mouthTemp = mouthTemp;
					this.dayTemp = 1;
					this.dateParmTemp = this.options.timePicker ? this.formatterDate(this.yearTemp, this.mouthTemp,
							this.dayTemp, 0) : this.formatterDate(this.yearTemp, this.mouthTemp, this.dayTemp, 1);
					this.calendarBodyForm(this.yearTemp, this.mouthTemp, this.dateParmTemp, this.options);
					if (this.yearTemp !== this.year || this.mouthTemp !== this.mouth) {
						$('#' + this.options.id + '_calendar_body').find('td').removeClass('date_today');
						$('#' + this.options.id + '_calendar_body').find('.calendar_item').eq(0).addClass(
								'date_selected');
					}
				},
				yearSelected : function() {
					new mouthSelectView(this.yearTemp, this.options);
				},
				cssPosition : function() {
					// var p_y = $('#' + this.options.id + '').offset().top +
					// $('#' + this.options.id + '').height();
					// var p_x = $('#' + this.options.id + '').offset().left ;
					var p_y = $('#' + this.options.id + '').position().top + $('#' + this.options.id + '').height();
					var p_x = $('#' + this.options.id + '').position().left;
					// console.log(p_y);
					// console.log(p_x);
					this.calendarUIDom.css({
						left : p_x,
						top : p_y
					});
				}
			});

	mouthSelectView = Backbone.View.extend({
		el : $('body'),
		initialize : function(year, options) {
			this.datePickerOptions = options;
			_.bindAll(this, 'render', 'mouthBodyForm', 'titleMove', 'mouthSelectedDeal');
			this.year = new Date().getFullYear();
			this.mouth = new Date().getMonth() + 1;
			this.yearTemp = year || new Date().getFullYear();
			this.render(year);
		},
		render : function(year) {
			var $yearTitle = $('<span><span id="' + this.datePickerOptions.id + '_mouthview_year">' + year
					+ '</span>年</span>');
			$('#' + this.datePickerOptions.id + '_date_title_content').empty().append($yearTitle);
			this.mouthBodyForm(year);
			// $('.date_move_left,.date_move_right').unbind('click');
			// $('.date_move_left,.date_move_right').bind('click',
			// this.titleMove);
		},
		mouthBodyForm : function(year) {
			var $mouthTable = $('<table id="' + this.datePickerOptions.id
					+ '_date_mouth_body" class="date_mouth_body">' + '<tr>' + '<td>1月</td>' + '<td>2月</td>'
					+ '<td>3月</td>' + '<td>4月</td>' + '</tr>' + '<tr>' + '<td>5月</td>' + '<td>6月</td>' + '<td>7月</td>'
					+ '<td>8月</td>' + '</tr>' + '<tr>' + '<td>9月</td>' + '<td>10月</td>' + '<td>11月</td>'
					+ '<td>12月</td>' + '</tr>' + '</table>');
			$('#' + this.datePickerOptions.id + '_date_body').empty().append($mouthTable);
			if (year === this.year) {
				$('#' + this.datePickerOptions.id + '_date_mouth_body').find('td').eq(this.mouth - 1).addClass(
						'mouth_current').addClass('mouth_selected');
			} else {
				$('#' + this.datePickerOptions.id + '_date_mouth_body').find('td').eq(0).addClass('mouth_current')
						.addClass('mouth_selected');
			}
			$('#' + this.datePickerOptions.id + '_date_mouth_body').find('td').unbind('click');
			$('#' + this.datePickerOptions.id + '_date_mouth_body').find('td').bind('click', this.mouthSelectedDeal);
		},
		titleMove : function(event) {
			event = event || window.event;
			var moveFlag = $(event.currentTarget).attr('class');
			var yearTemp = this.yearTemp;
			switch (moveFlag) {
			case 'date_move_left':
				yearTemp--;
				break;
			case 'date_move_right':
				yearTemp++;
				break;
			default:
				break;
			}
			this.yearTemp = yearTemp;
			$('#' + this.datePickerOptions.id + '_mouthview_year').text(this.yearTemp);
			this.mouthBodyForm(this.yearTemp);
		},
		mouthSelectedDeal : function(event) {
			event = event || window.event;
			var strlength = $(event.currentTarget).text().length;
			this.mouthSelected = $(event.currentTarget).text().substring(0, strlength - 1);
			// new mainPickerView(this.yearTemp, this.mouthSelected, '',
			// this.datePickerOptions);
		}

	});

}());
