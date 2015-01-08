function client()

    host = '192.168.1.24';
    port = 1091;
    obj = tcpip( host, port );
    fopen( obj );
    disp( 'get a conn' );
    [ A, count ] = fread( obj, 8, 'char' );
    char( A' )
    fclose( obj );