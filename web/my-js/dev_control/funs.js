function init() {	
	$('#open_a').click( function() { open(); } );
	$('#close_a').click( function() { close(); } );
	$('#p_set_a').click( function() { p_set(); } );
	$('#t_set_a').click( function() { t_set(); } );
	$('#f_set_a').click( function() { f_set(); } );
}

function open() {
	send_order( 'open', '' );	
}

function close() {
	send_order( 'close', '' );
}

function p_set() {
	var val = $('#p_val').val();
	if( val.length>0 ) {
		send_order( 'p_set', val );
	}	
}

function t_set() {
	var val = $('#t_val').val();
	if( val.length>0 ) {
		send_order( 't_set', val );
	}
}

function f_set() {
	var val = $('#f_val').val();
	if( val.length>0 ) {
		send_order( 'f_set', val );
	}
}

/*
	order - open, close, p_set, f_set, t_set
	最终指令为：S[guid,order,para]
*/
function send_order( order, para ) {
	
	var num_args = arguments.length;
	var d = new Date();

	//var order_str = 'S['+dev.gid+','+Math.round(d.getTime()/1000)+',';
	var order_str = 'S['+dev.gid+',';
	var res_h;
	
	switch( order ) {
		case 'open':
			order_str = order_str + 'open]';
			res_h = $('#open_res');
			break;	
		case 'close':
			order_str = order_str + 'close]';
			res_h = $('#close_res');
			break;	
		case 'p_set':
			order_str += 'p_set,' + arguments[1]+']';
			res_h = $('#p_res');
			break;
		case 't_set':
			order_str += 't_set,' + arguments[1]+']';
			res_h = $('#t_res');
			break;	
		case 'f_set':
			order_str += 'f_set,' + arguments[1]+']';
			res_h = $('#f_res');
			break;
	}
	
	$.post( 'my-php/dev_control/send_order.php',{'dev':dev.gid,'order':order_str},function(data) {
		switch( data ) {
			case'OK':
				res_h.text('成功');
				res_h.delay(3000).fadeIn(function(){$(this).text('');});
				break;
			default:
				res_h.text('失败');
				res_h.delay(3000).fadeIn(function(){$(this).text('');});
				break;
		}
	}).fail(function() {
			res_h.text('失败');
			res_h.delay(3000).fadeIn(function(){$(this).text('');});
		});
	
}