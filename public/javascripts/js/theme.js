$(document).ready(function(){
	$('.sidebar_tab .tab-pane a').click(function(e){
		 
		e.preventDefault();
		var hrefVal = $(this).attr('href');
		$('.sidebar_tab .tab-body').removeClass('show');
		$(hrefVal).addClass('show');
		$('.sidebar_tab .tab-pane a').parent().removeClass('active');
		$(this).parent().addClass('active');
		
	});

	// Tabs

	$('.tab .tab-head .tab-btn a').click(function(e){
		 
		e.preventDefault();
		var hrefVal = $(this).attr('href');

		var parentClass= $(this).parents('.tab');
		
		 parentClass.find('.tab-body').removeClass('show');
		
		parentClass.find(hrefVal).addClass('show');
		
		 
		$('.tab .tab-head .tab-btn').removeClass('active');

		 $(this).parent().addClass('active');
		 
	});

	// Accordion

	var allPanels = $('.accordion .accordion-content');
	$('.accordion .accordion-panel').click(function(){
		$this= $(this);
		var accordionparent= $this.parents('accordion');
	//	accordionparent. find('.accordion-panel').removeClass('active');
	$('.accordion .accordion-panel').removeClass('active');
		$this.addClass('active');
		$target = $this.next();
        if (!$target.hasClass('active')) {
            allPanels.removeClass('active').slideUp();
            $target.addClass('active').slideDown();
        }
        return false;
	});

	// Field button

	$('.field-file input[type="text"]').click(function(){
		$(this).siblings('input[type="file"]').trigger("click");
	});

	$('.field-file input[type="file"]').on('change', function(){
		var valAttr= $(this).val();
		$(this).siblings('input[type="text"]').val(valAttr);
	});

	// toggle button

	/*$('.maintoggle').on('click', function(){
		$('body').toggleClass('side-close')
	});*/
	
	// sidebar scroll
	
	function sidescroll(){
		setTimeout(function(){
			var logobox = $('aside .sidebar .logobox').height();
			var sidebar_tab = $('aside .sidebar .sidebar_tab').height();
			var carepeople_head = $('aside .sidebar .carepeople_head').height();
			
			var asideheight= $('aside').height();
			
			var extraVal;
			
			if($(window).width() < 981){
				extraVal= 80;
				var sidenav_height= asideheight - (sidebar_tab + logobox + carepeople_head + extraVal);
			}else if($(window).width() > 981){
				if($(window).width() > 400){
					extraVal= 0;
					var sidenav_height= asideheight - (sidebar_tab + logobox + carepeople_head + extraVal);
				}else{
					var main_menu = $('aside .sidebar .main_menu').height();
					var sidenav_height= asideheight - (sidebar_tab + main_menu + carepeople_head + extraVal + 10);
					alert('side_tab height' + sidebar_tab + 'main menu height' + main_menu + 'carepeople head' + carepeople_head + 'extra value' + extraVal);
				}
			}
			
			$('.sidebar .nav > div, .sidebar .nav .nav-scroll').css({
				'max-height': sidenav_height
			});
		}, 1000);
	}
	
	 sidescroll();
	 $(window).resize(function(){
		  sidescroll();
		  
	 });
	 
	 $('aside').resize(function(){
		  sidescroll();
	 });
});
