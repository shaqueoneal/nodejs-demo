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
function initPage(candidates, pageNum, numPerPage) {
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

	$('#exhibition .container').html(
			'<div class="row"> \
			    <div class="col-md-12"> \
				<h2 class="section-title left">作品展示</h2> \
			    </div> \
			</div>');

	var k = 0;
	for (var i = 0; i < rowNum; i++) {
		var row = $('<div class="row"></div>');

		for (var j = 0; j < columNum; j++) {
			var colum = $('<div class="col-xs-12 col-md-' + (12 / columNum) + '"></div>');
			var iframe = $('<iframe class="full" scrolling="no"></iframe>');
			// console.log(colum.get(0).outerHTML);

			iframe.attr("src", candidates[k].url);  
			iframe.attr("id", candidates[k].id);  

			colum.append('<div class="embed-responsive embed-responsive-4by3 detail">'+ iframe.get(0).outerHTML +'</div>');
			row.append(colum);

			if (++k >= candidates.length) {
				break;
			}
		};

		$('#exhibition .container').append(row).append('<br/>');
	};
}

function initExhibition(theme) {
	if (!theme || (theme.candidates.length < 1)) {
		console.log('err: no candidates');
		return;
	}

	var pageNo = Math.ceil(theme.candidates.length / 8);
	var lis = [];

	//pageNo starts with 1
	for (var i = 0; i < pageNo; i++) {
		initPage(theme.candidates, i + 1);
	}

	if (pageNo > 1) {		
		for (i = 0; i < pageNo; i++) {
			lis[i] = $('<li></li>').text(pageNo + 1);
		}
	}

	if (pageNo > 1) {
		//show pagination
		lis.each(appendTO($('<div class="pagination"><ul class="nav"></ul></div>')));
	}

	$('a[href="#exhibition"]').parent().fadeIn(1000);
	$('a[href="#exhibition"]').click();
}

	// must be called after initExhibition, show voting buttons
	function initVoting(canditates) {
		var btn_vote = $('<button class="btn btn-success">投他一票</button>');
		var btn_origin = $('<button class="btn btn-primary">查看原稿</button>');
		var btn_info = $('<button class="btn btn-warning">作品介绍</button>');

		$('.embed-responsive').each(function (){
			var id = $(this).children('iframe').attr("id");  

			btn_vote.attr("id", "btn_vote_" + id);  
			btn_origin.attr("id", "btn_origin_" + id);
			btn_info.attr("id", "btn_info_" + id);

			$(this).after("<div align='center'><div class='btn-group'>" + 
				btn_vote.get(0).outerHTML + btn_origin.get(0).outerHTML +  btn_info.get(0).outerHTML + 
				"</div></div>");
		});

		$("button[id^='btn_vote']").click(function(e){		
			var id =  $(this).attr("id").replace(/[^0-9]/ig, "");
			var jsonData = {
				"method":   "vote",
				"theme":    g_theme.id,
				"no":       id,
				"userId" :  undefined,	// will be added when user module is ok
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

			var candidate;	          	

			$.each(canditates, function(i, d){
				if (id === d.id) {
					candidate = d;
					return false;
				}
			});

			sendJsonData('/user_vote', 'POST', jsonData, function (data) {
	          	console.log(data);

	        	if (confirm("您投了 " + candidate.id + "# 作品" + 
	        		(candidate.name ? " :《" + candidate.name + "》":"") + 
	        		"一票，感谢您的参与，现在您可以点击确定查看投票结果！")) {

					showResult(g_theme.id);
					$('a[href="#outcome"]').click();
	        	}	        	

	        	$.cookie('vote', jsonStr);
	        });

			return false;

		});
  	
  		$("button[id^='btn_origin']").click(function(e){		
			var height =  (768 < screen.availHeight) ? 768 : (screen.availHeight - 120);
			var width = height * 16 / 10;
			var id =  $(this).attr("id").replace(/[^0-9]/ig, "");

			$.each(canditates, function(i, d){
				if (id === d.id) {
					popWin.showWin(width, height ,"通用的iframe弹层插件", d.url);
					return false;
				}
			});			
		});

  		$("button[id^='btn_info']").click(function(e){		
			var id =  $(this).attr("id").replace(/[^0-9]/ig, "");

			$.each(canditates, function(i, d){
				if (id === d.id) {
					alert("编号：#"+ d.id + "\n" + 
						  "名称:《" + d.name + "》\n" +
						  "作者: " + d.author + " \n" +
						  "介绍：" + d.description);
					return false;
				}
			});			
		});

	}

  function drawBar(id, dataList, legendId, barNumber) {
    var data = {
      labels: [''],
      datasets: [{data: []}],
    };

    $.each(dataList, function(i, d) {
      // if (i >= barNumber) {
      //   return false;
      // }      

      data.labels[i] = d.label;

      if (getStringWidth(d.label) > 8) {
        data.labels[i] = setStringWidth(d.label, 8);
      }

      data.datasets[0].data[i]         = d.value;
      data.datasets[0].fillColor       = getColor(0);
      data.datasets[0].highlightFill   = getHighlightColor(getColor(0));
      data.datasets[0].highlightStroke = "rgba(220,220,220,1)";
      data.datasets[0].strokeColor     = "rgba(220,220,220,0.8)";  
    });    

    console.log(data);

    ctx = $("#" + id).get(0).getContext("2d");
    var chart =  new Chart(ctx).Bar(data, {responsive: false, barValueSpacing:10, scaleFontColor: "#222", barDatasetSpacing:30, scaleLineColor: "#FFF",});

    // $.each(dataList, function(i, d) {
    //   if (i >= barNumber) {
    //     return false;
    //   }
      
    //   chart.datasets[0].bars[i].fillColor = getBarColor(dataList[i].value); 
    //   chart.datasets[0].bars[i].highlightFill = getColorHighlight(getBarColor(dataList[i].value));    
    // });    

    // chart.update();

    return chart;
  }

	function drawPie(id, dataList, legendId) {
		var ctx = $('#' + id).get(0).getContext("2d");
		var data = [];

		$.each(dataList, function(i, d) {
			var dataItem = {};
			dataItem.value = d.value;
			dataItem.label = d.label;
			dataItem.color = getColor(i);
			dataItem.highlight = getHighlightColor(getColor(i)),

			data.push(dataItem);
		});

		var option = {
			animationEasing : "linear",
			percentageInnerCutout: 0
		};

		var pie = new Chart(ctx).Doughnut(data, option);

		if (legendId) {
			option.legendTemplate = "<ul class=\"<%=name.toLowerCase()%>-legend\"> \
				<% for (var i=0; i<segments.length; i++){%> \<li><span style=\"background-color:<%=segments[i].fillColor%>\"></span> \
				<% console.log(segments[i]); if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>";

			$("#" + legendId).append(pie.generateLegend());
		}
		 
	}

	function showResultDetail(themeId) {
		var jsonData = {
			"method":   "getResultDetail",
			"themeId":  themeId,
		};	

		//{userId: , votedWorkNo: , votedWorkName: , workAuthor:, vateDate:}
		var voteDetailRecords = [];

		sendJsonData('/user_vote', 'POST', jsonData, function (votes) {
			console.log(votes);

			$.each(votes, function(index, data) {
				if (data) {
					var detailRecord = {};

					detailRecord.userId = data.userId;

					$.each(data.votes, function (i, d) {
						detailRecord.workNo = d.no;
						detailRecord.workName = g_theme.candidates[d.no - 1].name;
						detailRecord.voteDate = d.date;
						voteDetailRecords.push(detailRecord);
					});
					
				}
			});
		});
	}

	function showResult(themeId) {
		$('#outcome').show();

		$('a[href="#outcome"]').parent().fadeIn(1000);

		var jsonData = {
			"method":   "getResult",
			"themeId":  themeId,
		};	

		sendJsonData('/user_vote', 'POST', jsonData, function (voteCounts) {
			console.log(voteCounts);

			//{workId, workName, votesCount}
			var voteRecords = [];

			$.each(voteCounts, function(i, d) {
				var vote = {};
				vote.label = g_theme.candidates[i].name;
				vote.value = d;

				voteRecords.push(vote);
			});

			drawBar('cvs_votes_bar', voteRecords);
			drawPie('cvs_votes_pie', voteRecords, 'legend');

		});	
	}

var g_theme = {}; 	//contains current theme data

	/*-----------GET THEMES ON VOTING-------------*/
	function initTheme() {
	  	var jsonData = {
	  		"method":    "getActiveThemes",
			"themes":    "all",
		};

		sendJsonData('/user_vote', 'GET', jsonData, function (themes) {
	      	// console.log(themes);

	      	/*-----------VOTE THEME INIT-------------*/
	      	$.each(themes, function (i, d) {
	      		// console.log(d);

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
	      			'			<img src="' + d.imgUrl + '" alt="slide-' +  d.id + '">  '+
	      			'		    </li>');	

	      		$('#introduction .slides').append(slide);

		      	$('.slide-button').click(function(){
		      		g_theme = d;

		      		var themeId = $(this).attr("id").replace(/[^0-9]/ig, "");

		      		$('#exhibition').show();

		      		if (d.candidates.length) {
		      			initExhibition(d);
						initVoting(d.candidates);
					}

		      		// already voted
					if ($.cookie('vote')) {
			      		showResult(themeId);	      		
		      		}

		      	});
	      	});

	      	if (themes.length > 1) {
	      		$(".slide-navigation").show();
	      	}



		initSuperFish();
		initFlexSlider();
		initLocalScroll();
		initParallax();
		niceScrollInit();
		toolTipInit();
		isotopeInit();
		initMagnificPopup();
		triggerMobileMenu();


	    });

	}

	initTheme();

});