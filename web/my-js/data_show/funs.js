/*
	dev	.gid
		.name
		.p   	// 压力 
		.f		// 流量 
		.temp	// 温度
		.r		// 阻力
		.t		// 时间
		.p_plot
		.f_plot
		.temp_plot
		.r_plot
	
	user.name
		.type  1-admin
	注： 设备默认是按照 东八区 时区显示数据
*/
function init() {
	
	if( $('#tooltip').length<=0 ) {
		$('body').append( $('<div id="tooltip"></div>') );
		$('#tooltip').hide();
	}
	
	var p_flot = $('.fdiv');
	p_flot.css( {'outerWidth':'100%'} );
	p_flot.height( p_flot.width()*0.52 );
	
	dev.p_plot = add_flot( 'p_flot' );
	dev.f_plot = add_flot( 'temp_flot' );
	dev.temp_plot = add_flot( 'f_flot' );
	dev.r_plot = add_flot( 'r_flot' );
	
	$(".fdiv").bind("plothover", function (event, pos, item) {
		if (item) {
			var x = item.datapoint[0],
				y = item.datapoint[1].toFixed(2);
			
			var d = new Date( x );   
			var hour = d.getUTCHours();     
			var minute = d.getUTCMinutes();     
			var date_str = hour+':'+minute+':'+d.getUTCSeconds();
			
			$("#tooltip").html( 'x= ' + date_str + " y= " + y)
				.css({top: item.pageY+5, left: item.pageX+5}).show();
		} else
			$("#tooltip").hide();
	});
	
	update();
}

function update() {
	var lt = dev.t[dev.t.length-1];
	$.post( 'my-php/data_show/get_data.php',{'g1':dev.gid,'t':lt}, function( data ) {
		if( parse_xml(data) ) {
			update_latest_value();
			
			update_flot( dev.p_plot, dev.p, dev.t );
			dev.p = [];
			
			update_flot( dev.temp_plot, dev.temp, dev.t );
			dev.temp = [];
			
			update_flot( dev.f_plot, dev.f, dev.t );
			dev.f = [];
			
			update_flot( dev.r_plot, dev.r, dev.t );	
			dev.r = [];
			
			var lt = dev.t[dev.t.length-1];
			dev.t = [];
			dev.t[0] = lt;
		}
	} );
	
	setTimeout( "update()", 30*1000 );
}

function add_flot( flot_holder ) {

	var flot_color = new Array();
	flot_color[0] = '#0011FF';
	flot_color[1] = '#FF0000';
	flot_color[2] = '#00AA00';
	flot_color[3] = '#00AAFF';

	var label_str = '';
	var c_id = 0;
	
	switch( flot_holder ) {
		case 'p_flot':
			label_str = "压力";
			c_id = 0;
			break;
		case 'temp_flot':
			label_str = "温度";
			c_id = 1;
			break;
		case 'f_flot':
			label_str = "流量";
			c_id = 2;
			break;
		case 'r_flot':
			label_str = "阻力";
			c_id = 3;
			break;
	}
	
	var d = new Date();
	var st = d.getTime()/1000 + dev.tz*3600;	// 当前电站本地时间，秒为单位
	d.setTime( st*1000 );
	var now_UTC_day = d.getUTCDate();
	var now_UTC_month = d.getUTCMonth();
	var now_UTC_year = d.getUTCFullYear();
	
	var plot = $.plot( '#'+flot_holder, [ 
		{ data:[], label: label_str } 
	], {
		series: {
			lines: {
				show: true,
				lineWidth: 2,
			}
		},
		yaxis: {
			tickDecimals: 1
		},
		xaxis: {
			tickLength: 0,
			mode: "time",
			timeformat: "%m-%d %H:%M",
			minTickSize: [30, 'minute'],
			//min: Date.UTC(now_UTC_year,now_UTC_month,now_UTC_day,0,0),
			//max: Date.UTC(now_UTC_year,now_UTC_month,now_UTC_day,23,59),
		},
		shadowSize: 0,
		colors: [ flot_color[c_id] ],
		grid: {
			borderWidth: {
				top: 0,
				right: 0,
				bottom: 2,
				left: 2
			},
			hoverable: true,
			clickable: true
		}
	});
	
	return plot;
}

/*
	<xml>
		<d>
			<n>name</n>
			<v t='t1'>××</v>
			<v t='t2'>××</v>
			<v t='t3'>××</v>
			<v t='t4'>××</v>
		</d>
		<d>
			<n>name</n>
			<v t='t1'>××</v>
			<v t='t2'>××</v>
			<v t='t3'>××</v>
			<v t='t4'>××</v>
		</d>
	</xml>
*/
function parse_xml( responseTxt ) {

	var xml = $(responseTxt);
	if ( xml.length<=0 )
		return false;
	
	var ds = xml.find('d');
	$.each( ds, function(i,value) {
		var v = $(value);
		var sp = new Array();
		var vn = '';
		
		var mid = v.children();
		$.each( mid, function(index, dom) {
			var v1 = $( dom );
			if( index==0 )
				vn = v1.text();
			else {
				if(i==0)
					dev.t[index-1] = parseInt( v1.attr('t') );
				sp[index-1] = parseFloat( v1.text() );
			}
		} );
		
		switch( vn ) {
			case '压力':
				dev.p = sp;
				break;
			case '温度':
				dev.temp = sp;
				break;
			case '流量':
				dev.f = sp;
				break;
			case '阻力':
				dev.r = sp;
				break;
		}
	} );
	return true;
}

function update_flot( plot, data, t ) {

	var dataset = plot.getData();
	var series = dataset[0];
	var i = t.length, loop = data.length;
	
	if( i>loop )
		var mt = t.slice(i-loop, i-1);
	else
		var mt = t.slice(0);
	
	if ( loop>0 ) {
		for (i=0; i<loop; i++)
			series.data.push( [(mt[i]+dev.tz*3600)*1000,data[i]] );	
		plot.setData( [series] );
		plot.setupGrid();
		plot.draw();
	}
}

function update_latest_value() {
	var t = dev.t[dev.t.length-1];	
	var t_str = formatDate( t+dev.tz*3600 );
	
	var vl = dev.p.length;
	if( vl>0 ) {
		$('#pv').html( dev.p[vl-1].toFixed(2) );
		$('#pvt').html( t_str );
	}
		
	vl = dev.f.length;
	if( vl>0 ) {
		$('#fv').html( dev.f[vl-1].toFixed(2) );
		$('#fvt').html( t_str );
	}
		
	vl = dev.temp.length;
	if( vl>0 ) {
		$('#tv').html( dev.temp[vl-1].toFixed(2) );
		$('#tvt').html( t_str );
	}
		
	vl = dev.r.length;
	if( vl>0 ) {
		$('#rv').html( dev.r[vl-1].toFixed(2) );
		$('#rvt').html( t_str );
	}
}

// UTC - 单位为: 秒
function formatDate( UTC ) {
	var d = new Date( UTC*1000 );
	var year = d.getUTCFullYear();     
	var month = d.getUTCMonth() + 1;     
	var date = d.getUTCDate();     
	var hour = d.getUTCHours();     
	var minute = d.getUTCMinutes();     
	var second = d.getUTCSeconds();     
	return   year+"-"+month+"-"+date+"   "+hour+":"+minute+":"+second;     
}