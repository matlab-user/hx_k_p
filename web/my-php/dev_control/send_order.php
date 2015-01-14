<?php

	session_start();
	
//	$_POST['dev'] = 's001';
//	$_POST['order'] = 'wangdehui';
	
	if( !isset($_POST['dev']) || !isset($_POST['order']) )
		exit;
	
	$con = mysql_connect( "localhost", "root", "blue" );
	if ( !$con )
		die( 'Could not connect: ' . mysql_error() );

	mysql_query("SET NAMES 'utf8'", $con);
	
	$res = mysql_query( "SELECT d_ip, d_port, l_ip, l_port FROM hx_k_db.dev_t WHERE gid='".$_POST['dev']."'", $con );
	$row = mysql_fetch_array( $res );
	
	$d_ip = $row[0];
	$d_port = $row[1];
	$l_ip = $row[2];
	$l_port = $row[3];
	
	mysql_free_result ( $res );
	mysql_close( $con );
	
//	echo $d_ip."  ".$d_port."  ".$l_ip."  ".$l_port."\n";
?>