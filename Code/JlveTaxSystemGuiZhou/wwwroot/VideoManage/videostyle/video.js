$(function(){
	$('#video_float_btn').bind('click',function(){
		var mr = $('div.video_menu_area').css('margin-right');
		var set = '';
		var file = '';
		var rw = $('div.video_main_area').width();
		if (mr == '-290px') {
			set = '0px';
			file = 'btn_right';
			rw -= 290;
		}else{
			set = '-290px';
			file = 'btn_left';
		}
		$('div.video_menu_area').animate({
			'margin-right': set,
		});
		$('#video_float_btn').removeClass('btn_left').removeClass('btn_right').addClass(file);
		$('div.video_player').animate({'width': rw.toString()+'px',});
	});
	$(window).resize(function() {
		var rw = $('div.video_main_area').width();
		var mr = $('div.video_menu_area').css('margin-right');
		if (mr != '-290px') {
			rw -= 290;
		}
		$('div.video_player').animate({'width': rw.toString()+'px',});
	});
	
	var rw = $('div.video_main_area').width()-290;
	$('div.video_player').css('width',rw.toString()+'px');
});