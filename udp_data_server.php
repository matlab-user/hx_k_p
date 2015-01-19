<?php

	set_time_limit( 0 );
	ob_implicit_flush();
	
START:
	$socket = socket_create( AF_INET, SOCK_DGRAM, SOL_UDP );
	if( $socket===false ) {
		echo "socket_create() failed:reason:" . socket_strerror( socket_last_error() ) . "\n";
		exit;
	}

	$rval = socket_get_option($socket, SOL_SOCKET, SO_REUSEADDR);
	if( $rval===false )
		echo 'Unable to get socket option: '. socket_strerror(socket_last_error()).PHP_EOL;
	elseif( $rval!==0 )
		echo 'SO_REUSEADDR is set on socket !'.PHP_EOL;

	$ok = socket_bind( $socket, '0.0.0.0', 1024 );
	if( $ok===false ) {
		echo "false  \r\n";
		echo "socket_bind() failed:reason:" . socket_strerror( socket_last_error( $socket ) )."\r\n";
		exit;
	}
	
	while( true ) {
		
		$r = array( $socket );

		$num = socket_select( $r, $w=NULL, $e=NULL, 16 );
		if( $num===false ) {
			echo "socket_select() failed, reason: ".socket_strerror(socket_last_error())."\n";
			socket_close( $socket );
			sleep( 20 );
			goto START;
		}
		elseif( $num>0 ) {
				socket_recvfrom( $socket, $buf, 1000, 0, $to_ip, $to_port );
				echo "op_res---".$buf."\n";
				parse_data( $buf );
		}
		//parse_data( "[dev_gid,start,timestamp,p,t,f,r]" );
	}
	
//--------------------------------------------------------------------------------------------------------
//			sub_funs 
//--------------------------------------------------------------------------------------------------------
// [dev_gid,start,timestamp,p,t,f,r]
	function parse_data( $data_str ) {
		$mid_str = explode( "[", $data_str );
		$mid_str = explode( "]", $mid_str[1] );
		if( count($mid_str)>0 ) {
			$segs = explode(",", $mid_str[0] );
			echo count($segs)."\n";
			var_dump( $segs );
			echo "\n";
		}
	}	
?>