$(window).load(function() {
	
		// IE detect
	function iedetect(v) {

		var r = RegExp('msie' + (!isNaN(v) ? ('\\s' + v) : ''), 'i');
		return r.test(navigator.userAgent);
			
	}

	// For mobile screens, just show an image called 'poster.jpg'. Mobile
	// screens don't support autoplaying videos, or for IE.
	if(screen.width < 600 || iedetect(8) || iedetect(7) || 'ontouchstart' in window) {
	
		(adjSize = function() { // Create function called adjSize
			
			$width = $(window).width(); // Width of the screen
			$height = $(window).height(); // Height of the screen
			
			// Resize image accordingly
			$('#container').css({
				'background-image' : 'url(images/poster.jpg)', 
				'background-size' : 'cover', 
				'width' : $width+'px', 
				'height' : $height+'px'
			});
			
			// Hide video
			$('video').hide();
			
		})(); // Run instantly
		
		// Run on resize too
		$(window).resize(adjSize);
		
	}
	
	$('.loader').hide();

});

$(function() {
		
	// Wait until the video meta data has loaded
	$('#container video').on('loadedmetadata', function() {
		
		var $width, $height, // Width and height of screen
			$vidwidth = this.videoWidth, // Width of video (actual width)
			$vidheight = this.videoHeight, // Height of video (actual height)
			$aspectRatio = $vidwidth / $vidheight; // The ratio the video's height and width are in
					
		(adjSize = function() { // Create function called adjSize
						
			$width = $(window).width(); // Width of the screen
			$height = $(window).height(); // Height of the screen
						
			$boxRatio = $width / $height; // The ratio the screen is in
						
			$adjRatio = $aspectRatio / $boxRatio; // The ratio of the video divided by the screen size
						
			// Set the container to be the width and height of the screen
			$('#container').css({'width' : $width+'px', 'height' : $height }); 
			$('#container .content ').css({'width' : $width+'px', 'height' : $height }); 
			$('.wrapper').css({'top': $height });
						
			if($boxRatio < $aspectRatio) { // If the screen ratio is less than the aspect ratio..
				// Set the width of the video to the screen size multiplied by $adjRatio
				$vid = $('#container video').css({'width' : $width*$adjRatio+'px'}); 
			} else {
				// Else just set the video to the width of the screen/container
				$vid = $('#container video').css({'width' : $width+'px'});
			}
							 
		})(); // Run function <immediately></immediately>
					
		// Run function also on window resize.
		$(window).resize(adjSize);
					
	});

	$.stellar({
		scrollProperty: 'scroll',
		responsive: true,
		hideDistantElements: true
	});
	
	$('.data').on('click', function(e){
		
		e.preventDefault();
		$('.terms').show();

	});
	
	$('.terms .close').on('click', function(e){
		
		e.preventDefault();
		$('.terms').hide();

	});
	
	$('.topbar .burger').on('click', function(e){
		
		e.preventDefault();
		if($(this).hasClass('open')){
			$(this).children('img').attr('src', 'images/closed.png');
			$(this).removeClass('open');
			$('.menubar').show();
			TweenLite.fromTo($('.menubar'), 0.5, {opacity:0}, {opacity: 1});			
		} else {
			$(this).children('img').attr('src', 'images/bars.png');   
			$(this).addClass('open');
			TweenLite.fromTo($('.menubar'), 0.5, {opacity:1}, {opacity: 0});
			$('.menubar').hide();			
		}
	
	});
	
	$('.scrollmenu .burger').on('click', function(e){
		
		e.preventDefault();
		if($(this).hasClass('open')){
			$(this).children('img').attr('src', 'images/closed.png');   
			$(this).removeClass('open');
			$('.floatmenubar').show();
			TweenLite.fromTo($('.floatmenubar'), 0.5, {opacity:0}, {opacity: 1});			
		} else {
			$(this).children('img').attr('src', 'images/bars.png');   
			$(this).addClass('open');
			TweenLite.fromTo($('.floatmenubar'), 0.5, {opacity:1}, {opacity: 0});
			$('.floatmenubar').hide();			
		}
	
	});
	
	jQuery.fn.center = function () {
		this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +  $(window).scrollTop()) + "px");
		return this;
	}

	$('.centerer').center();

	$( window ).resize(function() {
		$('.centerer').center();
	});

	$(window).scroll(function()
	{
		if ($(window).scrollTop() > 500 )
		{
			TweenLite.fromTo( $('.scrollmenu:not(.shown)'), 0.5, { top: '-60px', opacity: 0 }, {top:0, opacity:1});
			$('.scrollmenu').show().addClass('shown');
		}
		else
		{
			$('.scrollmenu').hide().removeClass('shown');
			TweenLite.fromTo( $('.scrollmenu'), 0.5, { top:0, opacity: 1 }, {top:'-60px', opacity:0});
		}
		
	});
	
	$('#nav').onePageNav({
		currentClass: 'current',
		changeHash: false,
		scrollOffset: 90,
		scrollSpeed: 750,
		filter: ':not(.external)'
	});
	
	$('#nav2').onePageNav({
		currentClass: 'current',
		changeHash: false,
		scrollOffset: 90,
		scrollSpeed: 750,
		filter: ':not(.external)',
		easing: 'swing'
	});
	
	$('#nav3').onePageNav({
		currentClass: 'current',
		changeHash: false,
		scrollOffset: 90,
		scrollSpeed: 750,
		filter: ':not(.external)',
		easing: 'swing'
	});
	
	$('#nav a').on('click', function(e){
		
		e.preventDefault();
		$('.burger').children('img').attr('src', 'images/bars.png');   
		$('.burger').addClass('open');  
		TweenLite.fromTo($('.floatmenubar'), 0.5, {opacity:1}, {opacity: 0});
		$('.floatmenubar').hide();	
		
	});
	
	$('a.takepart').hover(function() {
		TweenMax.to( $(this).children('span'), 0.3, {clip:"rect(0px 350px 175px 0px)"});
		TweenMax.to( $(this).children('em'), 0.5, {clip:"rect(0px 350px 175px 0px)", delay: 0.5, ease:Power2.easeOut});
	}, function() {
		TweenMax.to( $(this).children('em'), 0.3, {clip:"rect(0px 0px 175px 0px)"});
		TweenMax.to( $(this).children('span'), 0.3, {clip:"rect(0px 175px 175px 175px)", delay: 0.3});
	});
	
	$('.bookload').hover(function() {
		TweenLite.to( $(this).children('img'), 0.5, {top: '5px'});
	}, function() {
		TweenLite.to( $(this).children('img'), 0.5, {top: '0px'});
	});

});