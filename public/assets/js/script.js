$(document).ready(function(){
	
    /* nice scroll */
    $( 'html' ).niceScroll({
        cursorcolor: '#434a54',
        cursorwidth: '13px',
        cursorborder: '1px solid #434a54',
        cursoropacitymax: 0.9,                
        scrollspeed: 110,
        autohidemode: false,
        horizrailenabled: false,
        cursorborderradius: 4,
        zindex: 1060
    });

    /* carousel testimony */
    $('#testislider').carousel({
        interval: 6000
    })

	/* carousel partner */
	var jcarousel = $('.jcarousel');

    jcarousel
        .on('jcarousel:reload jcarousel:create', function () {
            var width = jcarousel.innerWidth();

            if(width >= 992){
            	width = width / 5;
            } else if (width >= 768) {
                width = width / 4;
            } else if (width >= 480) {
                width = width / 3;
            } else if(width >= 350){
            	width = width / 2;
            }

            jcarousel.jcarousel('items').css('width', width + 'px');
        })
        .jcarousel({
            wrap: 'circular'
        });

    $('.jcarousel-control-prev')
        .jcarouselControl({
            target: '-=1'
        });

    $('.jcarousel-control-next')
        .jcarouselControl({
            target: '+=1'
    	});

    $('.jcarousel-pagination')
        .on('jcarouselpagination:active', 'a', function() {
            $(this).addClass('active');
        })
        .on('jcarouselpagination:inactive', 'a', function() {
            $(this).removeClass('active');
        })
        .on('click', function(e) {
            e.preventDefault();
        })
        .jcarouselPagination({
            perPage: 1,
            item: function(page) {
                return '<a href="#' + page + '">' + page + '</a>';
        }
    });


    /* scrolltop */
    $('.scroltop').on('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });


    /* masonry layout */
    var $container = $('.container-realestate');
    $container.imagesLoaded( function(){
        $container.masonry();
    });


    /* modal */
	function alignModal(){
        var modalDialog = $(this).find(".modal-dialog");
        /* Applying the top margin on modal dialog to align it vertically center */
        modalDialog.css("margin-top", Math.max(0, ($(window).height() - modalDialog.height()) / 2));
		
    }
    // Align modal when it is displayed
    //$(".modal").on("shown.bs.modal", alignModal);
    
    // Align modal when user resize the window
    $(window).on("resize", function(){
        $(".modal:visible").each(alignModal);
    });  
    
	$("body").on("shown.bs.modal", ".modal", function() {
    var curModal = this;
        $('.modal').each(function(){
            if(this != curModal){
                $(this).modal('hide');
            }
        });
		var modalDialog = $(this).find(".modal-dialog");
        /* Applying the top margin on modal dialog to align it vertically center */
        modalDialog.css("margin-top", Math.max(0, ($(window).height() - modalDialog.height()) / 2));
		$('.modal').find(':input','#myform')
		  .not(':button, :submit, :reset,:radio,:hidden')
		  .val('')
		  .removeClass('error')
		  .removeAttr('checked')		  
		  .removeAttr('selected');
		  $('.modal').find('.errlabelsignin','.errlabelforget','.errlabel') .html('');
		  $('.modal label.error').remove();
		  //$('.modal input:text').eq(0).focus();
});

    /* tooltip */
    $('[rel="tooltip"]').tooltip();
	$("[data-toggle=tooltip]").tooltip();


    /* map contact */
    $("#map").gmap3({
        map: {
            options: {
              center: [-7.866315,110.389574],
              zoom: 12,
              scrollwheel: false
            }  
         },
        marker:{
            latLng: [-7.866315,110.389574],
            options: {
             icon: new google.maps.MarkerImage(
               "https://dl.dropboxusercontent.com/u/29545616/Preview/location.png",
               new google.maps.Size(48, 48, "px", "px")
             )
            }
         }
    });


    /* carousel single */
    $('#slider-property').carousel({
        interval: 6500
    })


    /* map property */
    $('a[href="#maplocation"]').on('shown.bs.tab', function(){
		
        $("#map-property").gmap3({
            map: {
                options: {
                  center: [parseFloat($("#property_lat").val()),parseFloat($("#property_lon").val())],
                  zoom: 16,
                  scrollwheel: false
                }  
             },
            marker:{
                latLng: [parseFloat($("#property_lat").val()),parseFloat($("#property_lon").val())],
                options: {
                 icon: new google.maps.MarkerImage(
                   "https://dl.dropboxusercontent.com/u/29545616/Preview/location.png",
                   new google.maps.Size(48, 48, "px", "px")
                 )
                }
             }
        });
		
    });
	
});