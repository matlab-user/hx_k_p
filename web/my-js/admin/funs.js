/*
	user.name
		.type
		.key
		.valid
*/
var user = new Object();

function init() {
	$('#user_add').click( function() { user_add();} );
	$('#user_search').click( function() { user_search();} );
	
}

function get_user_info() {
	user.name = $('#user_name').val();
	user.type = $('#user_type').val();
	user.key = $('#user_key').val();
	user.valid = $('#user_valid')[0].checked;
}

function user_add() {
	get_user_info();
	
	if( user.name==='' || user.key==='' )
		return;

	$.post('my-php/admin/add_user.php',{'name':user.name,'type':user.type,'key':user.key,'valid':user.valid},function(data) {
		//console.log( data );
		switch( data ) {
			case 'ok':
				$('#user_res').html('添加成功！');
				break;
			default:
				$('#user_res').html('添加失败！');
				break;
		}			
	} ).fail( function() { $('#user_res').html('添加失败！'); } );	
}

function user_search() {
	get_user_info();
	
	if( user.name==='' )
		return;
	
	$.post('my-php/admin/search_user.php',{'name':user.name},function(data) {
		//console.log( data );
		if( data!='no' ) {
			var obj = $.parseJSON( data );
			user.type = obj.type;
			user.valid = obj.valid;
			
			if( user.valid=="1" )
				$('#user_valid')[0].checked = true;
			if( user.valid=="0" )
				$('#user_valid')[0].checked = false;
			
			if( user.type=='admin' )
				$("#user_type")[0].options[0].selected = true;
			if( user.type=='normal' )
				$("#user_type")[0].options[1].selected = true;
		}
	} );
	
}
