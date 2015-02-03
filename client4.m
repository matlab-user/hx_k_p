function client4()

    %host = '192.168.1.24';
    host = 'www.swaytech.biz';
    port = 1024;

    u = udp( host, port );
    fopen( u );    
    fwrite( u, 'I[s001]' );
    disp('send I ok');
    
    buf = '';
    while 1
        mid = fread( u, 30 );
        if size(mid,1)==0
            break;
        else
            buf = [buf mid'];
            if(mid(end)==']')
                break;
            end
        end
    end
    
    char( buf )
    
    fwrite( u, 'OK' );
    fclose( u );
    delete( u );
