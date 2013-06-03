$(function() {
	var aa = new slideBtn({
		'id' : 'aaa',
		'value' : true,
		"action" : function() {
			console.log(aa.val);
		}
	});

	$('button').click(function() {
		alert(aa.val);

	});
});
