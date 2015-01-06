/*
	dev[i]	.gid
			.name
			.valid
*/
function data_info_xml_parser( responseTxt ) {
			
	var xml = $(responseTxt);
	if ( xml.length<=0 )
		return false;
	
	var ds = xml.find('d');
	$.each( ds, function(i,value) {
		var v = $(value);
		dev.data[i] = new Object();
		dev.data[i].gid = parseInt( v.attr('id') );
		dev.data[i].name = v.children('name').text();
		dev.data[i].valid = parseInt(v.children('valid').text());
	} );

	return true;
}

 function get_devs_info() {
	
	$.post( 'my-php/devs_list/get_devs.php', function( data ) {
		
		var sig = data_info_xml_parser( data );
		if (sig==true) {
	
		};
		
	} );
	
 }