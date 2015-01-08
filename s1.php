<?php

set_time_limit(0); 
ob_implicit_flush(); 

/* handle signals */
pcntl_signal(SIGTERM, 'sig_handler'); 
pcntl_signal(SIGINT, 'sig_handler'); 
pcntl_signal(SIGCHLD, 'sig_handler'); 

/* change this to your own host / port */ 
$__server_listening = true; 
server_loop( "192.168.1.24", 1091 ); 

//--------------------------------------------------------------------------------------------
// 					funs
//--------------------------------------------------------------------------------------------
function interact($socket) { 
    /* TALK TO YOUR CLIENT */ 
	echo "wwwwwwwwwwwwwwww\n";
} 

/** 
  * Creates a server socket and listens for incoming client connections 
  * @param string $address The address to listen on 
  * @param int $port The port to listen on 
  */ 
function server_loop($address, $port) { 

    GLOBAL $__server_listening; 

    if( ($sock=socket_create(AF_INET, SOCK_STREAM, 0))<0 ) { 
        echo "failed to create socket: ".socket_strerror($sock)."\n"; 
        exit(); 
    } 

    if( ($ret=socket_bind($sock, $address, $port))<0 ) { 
        echo "failed to bind socket: ".socket_strerror($ret)."\n"; 
        exit(); 
    } 

    if( ($ret = socket_listen( $sock, 0 ))<0 )  { 
        echo "failed to listen to socket: ".socket_strerror($ret)."\n"; 
        exit(); 
    } 

    socket_set_nonblock( $sock ); 
    
    echo "waiting for clients to connect\n"; 

    while( $__server_listening ) { 
        $connection = @socket_accept( $sock ); 
        if( $connection===false ) { 
            usleep(100); 
			
        }elseif( $connection>0 ) { 
            handle_client( $sock, $connection ); 
        }else { 
            echo "error: ".socket_strerror($connection); 
            die; 
        } 
    } 
} 

/** 
  * Signal handler 
  */ 
function sig_handler( $sig )  { 
    switch($sig) { 
        case SIGTERM: 
        case SIGINT:
            exit(); 
        break; 

        case SIGCHLD: 
            pcntl_waitpid (-1, $status ); 
        break; 
    } 
} 

/** 
  * Handle a new client connection 
  */ 
function handle_client( $ssock, $csock ) { 
    GLOBAL $__server_listening; 

    $pid = pcntl_fork();
	
    if( $pid==-1 ) { 
        /* fork failed */ 
        echo "fork failure!\n"; 
        die; 
    }elseif( $pid==0 ) { 
        /* child process */ 
        $__server_listening = false; 
        socket_close( $ssoc ); 
        interact ( $csock ); 
        socket_close( $csock ); 
    }else { 
        socket_close( $csock ); 
    } 
} 
?>