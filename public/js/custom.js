/*-------------------------------------------------------------------------
 * IPRESSUM - Custom jQuery Scripts
 * ------------------------------------------------------------------------

	1.	Plugins Init
	2.	Site Specific Functions
	3.	Shortcodes
	4.      Other Need Scripts (Plugins config, themes and etc)
	
-------------------------------------------------------------------------*/


jQuery(document).ready(function($){
	
	
/*------------------------------------------------------------------------*/
/*	1.	Plugins Init
/*------------------------------------------------------------------------*/

/*-----------SUPERFISH INIT-------------*/

	function initSuperFish(){
		
		$("ul.sf-menu").superfish({
			 delay:  50,
			 autoArrows: true,
			 animation:   {opacity:'show'}
			 //cssArrows: true
		});
		
		// Replace SuperFish CSS Arrows to Font Awesome Icons
		$('nav > ul.sf-menu > li').each(function(){
			$(this).find('.sf-with-ul').append('<i class="fa fa-angle-down"></i>');
		});
	}
	
	

/*-----------FLEXSLIDER INIT-------------*/

	function initFlexSlider() {
		$('.introduction-slider').flexslider({
			animation: "fade",
			controlNav: false,
			directionNav: false,
			start: function(slider){
			$('body').removeClass('loading');
			}
		});
		
		// Set a custom flexslider previous control
		$('.slide-prev').on('click', function(){
			$('.introduction-slider').flexslider('prev')
			return false;
		});
		
		// Set a custom flexslider next control
		$('.slide-next').on('click', function(){
			$('.introduction-slider').flexslider('next')
			return false;
		});
		
		// Testimonials Slide
		$('.testimonials-slider').flexslider({
			animation: "fade",
			controlNav: true,
			directionNav: false,
			start: function(slider){
			$('body').removeClass('loading');
			}
		});

	}
	
/*-----------SCROLLTO INIT-------------*/
        function initLocalScroll() {
                
		jQuery('ul.main-navigation, ul.mobile-navigation').localScroll({
			offset: -112,
			duration: 1000,
			easing:'easeInOutExpo'
		});


        }
        
	
/*-----------PARALLAX INIT-------------*/
	function initParallax() {
		$('#counter').parallax("100%", 0.3);
		$('#partners').parallax("100%", 0.3);
		$('#testimonials').parallax("100%", 0.1);

	}
	




/*-----------NICESCROLL INIT-------------*/
 
function niceScrollInit() {
    $("html").niceScroll({
	autohidemode: false,
	cursorcolor: '#e04d47',
	zindex: 9999,
	cursorwidth: 6,
	cursorborder: "0px solid #e04d47",
	background: "#000000",
	scrollspeed: 60,
	mousescrollstep: 40
	});
}


	
/*-----------SUPERFISH INIT-------------*/

	function toolTipInit() {
	
		$('.partner-logo img').tooltip({
			placement: 'bottom'
		});
	}
	
	
 
/*-----------ISOTOPE INIT-------------*/

	function isotopeInit() {
		var $container = $('#folio-container');
		// init
		$container.isotope({
		// options
		itemSelector: '.folio-item',
		animationOptions: {
				duration: 750,
				easing: 'linear',
				queue: false
			},
		});
		
		
		
		// filter items when filter link is clicked
		jQuery('#filters a').click(function(){
			var selector = $(this).attr('data-filter');
			$container.isotope({ filter: selector });
			return false;
		});
		
		jQuery('#filters li a').click(function(){
			
			jQuery('#filters li').removeClass('current');
			jQuery(this).parent().addClass('current');
		});
	}	
	

	// Portfolio window
		/*jQuery('.folio-desc a').click(function() {
			var target_portfolio = jQuery(this).attr('href');
			$.ajax({
				url: target_portfolio,
				success: function(data) {
					jQuery("#folio-content").html(data);
					jQuery('#load-folio').fadeIn(400);
					var top_window = jQuery(document).scrollTop() + 20;
					jQuery('#folio-content').css('top',top_window);
					jQuery('#folio-content').css('display', 'block');			
				}
			});
			return false;
		});
		
		jQuery('.portfolio-close').live('click', function() {
			jQuery('#window').html('');
			jQuery('#bg-fade').css('display','none');
		});*/

/***************** Magnific Popup *********************/

	function initMagnificPopup() {
		
		$('.folio-zoom').magnificPopup({
				type: 'image',
				closeOnContentClick: true,
				closeBtnInside: false,
				fixedContentPos: true,
				mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
				gallery: {
					enabled: true
				},
				image: {
				    verticalFit: true
				},
				zoom: {
				enabled: false,
				duration: 300 // don't foget to change the duration also in CSS
				}
		
		});
	}


/*------------------------------------------------------------------------*/
/*	2.	Site Specific Functions
/*------------------------------------------------------------------------*/

//$("#header").sticky({ topSpacing: 0 });

//var main_menu = jQuery('#header');
		
		
		
		
		/*jQuery(window).scroll(function() {
			if(jQuery('.is-sticky').length > 0) {
				main_menu.css('height', '80px');
			}
			else {
				main_menu.css('height', '130px');
			}
		});*/

/*-----------SETUP ANIMATIONS-------------*/

$('.animated-item').each(function() {
		var timeDelay = $(this).attr('data-delay');
		$(this).appear(function() {
		var $that = $(this);
		setTimeout(function () {
		$that.addClass('animated');
		}, timeDelay);
		},{accX: 0, accY: -150});

		});


/*-----------COUNTDOWN FOR OUR TEAM-------------*/


	jQuery('.counter-item').appear(function() {
		jQuery('.counter-number').countTo();
		jQuery(this).addClass('funcionando');
		console.log('funcionando');
	});

/*-----------PAGE PRELOADER-------------*/

$(window).load(function() {
	$("#page-preloader").fadeOut(300, function(){
		$(this).remove();	
	});
	
});

function triggerMobileMenu() {
	
	$(".mobile-menu-trigger").click(function () {
		
		
		
		if ($("#mobile-menu").hasClass('hide-nav')) {
			setTimeout(function(){
			$("#mobile-menu").removeClass('hide-nav').addClass('show-nav');
			}, 100);	
		
		}else {
			
			setTimeout(function(){
			$("#mobile-menu").removeClass('show-nav').addClass('hide-nav');
			}, 100);
			
			}
		return false;
	});
	
	$(".mobile-nav .close").click(function () {
		setTimeout(function(){
			$("#mobile-menu").addClass('hide-nav');
			}, 100);
		});
	
}


/*-----------SKILL ANIMATION-------------*/
	jQuery('.skillbar').each(function() {
		
		var percent = jQuery(this).attr('data-percent');
		console.log(percent);
		if (jQuery(this).hasClass( "anim" )) {} 
		
			var randomval = Math.floor(Math.random() * (300 - 50 + 1)) + 50;
			jQuery(this).find('.skillbar-bar').animate({'width': percent+'%',}, 2000, 'easeInOutQuart', function(){
				jQuery('.skillbar-percent').delay(randomval).animate({'top':'-28px','opacity':1,'left': percent+'%'}, 500);	
			});
		
	});

/* when numPerPage is not provided the page is arranged according to the page number, otherwise by numPerPage, 
 * numPerPage must in [1, 2, 4, 8]
 */
function initPage(canditates, pageNum, numPerPage) {
	if (!candidates || candidates.length < 1) {
		console.log('err: no candidates');
		return;
	}
	
	var number = candidates.length;

	var rowNum = 1;
	var columNum = 1;

	var candidate = $('<div></div>');

	if (numPerPage > number) {
		number = numPerPage;
	}

	if (number <= 1) {
		rowNum = 1;
		columNum = 1;	
	}
	else if (number <= 2) {
		rowNum = 1;
		columNum = 2;
	}
	else if (number <= 4) {
		rowNum = 2;
		columNum = 2;
	}
	else if (number <= 8) {
		rowNum = 2;
		columNum = 4;
	}
	else {
		// no more than 8 pics
		console.log('err: more then 8 pics');
		rowNum = 2;
		columNum = 4;
	}

	var row = $('<div class="row"></div>');

	$.each(canditates, function (i, d){
		row.append('<div class="col-xs-12 col-md-' + (12 / columNum) + '">
					<div class="embed-responsive embed-responsive-4by3 detail">
						<iframe class="full" src="http://10.99.73.184:7042/index-200px.html" scrolling="no"></iframe>
					</div>
					<div>
						<button class="btn btn-success" id="btn_vote">投他一票</button>
						<button class="btn btn-primary" id="btn_origin">查看原稿</button>
					</div>
				</div>');	


	});
	

	var container = $('#exhibition .container').append(row);


}

function initExhibition(theme) {
	if (!theme || (theme.candidates.length < 1)) {
		console.log('err: no candidates');
		return;
	}

	var pageNo = Math.ceil(theme.candidates.length / 8);
	var lis = [];

	for (var i = 0; i <= pageNo; i++) {
		initPage(theme.candidates, i + 1, 8);
	};

	if (pageNo > 1) {
		
		for (i = 0; i < pageNo; i++) {
			lis[i] = $('<li></li>').text(pageNo + 1);
		};
	}

	if (pageNo > 1) {
		//show pagination
		

	$('<div class="pagination"><ul class="nav"></ul></div>').append(lis);
}



}

	function initVoting(theme) {
	}

	/*-----------GET THEMES ON VOTING-------------*/
	function initTheme() {
	  	var jsonData = {
			"themes":    "all",
		};

		sendJsonData('/', 'GET', jsonData, function (themes) {
	      	// console.log(data);

	      	/*-----------VOTE THEME INIT-------------*/
	      	$.each(themes, function (i, d) {
	      		var slide = $(' <li> '+
	      			'			<div class="flex-caption section-overlay slide-caption">'+
	      			'			    <div class="container">'+
	      			'				<div class="row">'+
	      			'				    <div class="col-md-12">'+
	      			'					<h2>'+ d.description +						
	      			'					</h2>'+
	      			'					<a class="slide-button" id="btn-theme-'+ d.id +'">' + d.name + '评选</a>'+
	      			'				    </div>'+
	      			'				</div>'+
	      			'			    </div>'+
	      			'			</div> '+
	      			'			<img src="' + d.imgUrl + '" alt="slide-"' +  d.id + '>  '+
	      			'		    </li>');	

	      		$('#introduction .slides').append(slide);
	      	});

	      	if (themes.length > 1) {
	      		$(".slide-navigation").show();
	      	}

	      	$('.slide-button').click(function(){
	      		var id = $(this).attr("id").replace(/[^0-9]/ig, "");
	      	});


			$('#btn_vote').click(function(e){		
				var jsonData = {
					"theme":    "uis",
					"no":       "1",
					"title":    "200px",
					"comments": "test"
				};				

				var jsonStr = JSON.stringify(jsonData);

				if ($.cookie('vote')) {
					var cookieData = JSON.parse($.cookie('vote'));

					if (jsonData.no != cookieData.no) {
						if (!confirm("您已经投过票了，重新投票的话上次投票会作废，确定要重新投票吗？")){
							return false;
						};
					}
				}

				sendJsonData('user_vote/', 'POST', jsonData, function (data) {
		          	console.log(data);
		        	alert("您投了 " + jsonData.no + "# 作品" + (jsonData.title ? " :《" + jsonData.title + "》":"") + "一票，感谢您的参与，现在您可以查看投票结果！");

		        	$.cookie('vote', jsonStr);
		        });

				return false;

			});

		initSuperFish();
		initFlexSlider();
		initLocalScroll();
		initParallax();
		niceScrollInit();
		toolTipInit();
		isotopeInit();
		initMagnificPopup();
		triggerMobileMenu();

		initVoting(theme);

	    });

	}

	initTheme();


});