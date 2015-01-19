function client2()

    host = '192.168.1.24';
    %host = 'www.swaytech.biz';
    port = 1024;

for j = 1 : 400
    u = udp( host, port );
    fopen( u );    
    fwrite( u, '[123,2,10,12,23,24.5,45.6]' );
    j
    fclose( u );
    delete( u );   
    %pause(1);
end