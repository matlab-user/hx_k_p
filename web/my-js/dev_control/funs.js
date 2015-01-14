function init() {	
	$('#open_a').click( function() { open(); } );
	$('#close_a').click( function() { close(); } );
	$('#p_set_a').click( function() { p_set(); } );
	$('#t_set_a').click( function() { t_set(); } );
	$('#f_set_a').click( function() { f_set(); } );
}

function open() {
	send_order( 'open', val );	
}

function close() {
	send_order( 'close', val );
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
	最终指令为：[guid,utc_sec,order,para]
*/
function send_order( order, para ) {
	
	var num_args = arguments.length;
	var d = new Date();

	var order_str = '['+dev.gid+','+Math.round(d.getTime()/1000)+',';

	switch( order ) {
		case 'open':
			order_str = order_str + 'open]';
			break;	
		case 'close':
			order_str = order_str + 'close]';
			break;	
		case 'p_set':
			order_str += 'p_set,' + arguments[1]+']';
			break;
		case 't_set':
			order_str += 't_set,' + arguments[1]+']';
			break;	
		case 'f_set':
			order_str += 'f_set,' + arguments[1]+']';
			break;
	}
	
	$.post( 'my-php/dev_control/send_order.php',{'dev':dev.gid,'order':order_str},function(data) {
		
		
	} );
	
}