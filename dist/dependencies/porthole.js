/*! porthole - v1.0.4 - 2015-09-22
* https://github.com/filamentgroup/porthole
* Copyright (c) 2015 Filament Group; Licensed MIT */
(function($){

	var queue = [];
	var listening;
	var deActivateSelector = "[data-scroll-deactivate]";
	var activeClass = "inviewport";
	var viewportSize;
	var options = {
		removeClass: false //remove class when out of viewport? default false
	};

	// polyfill raf if needed
	var raf = (function(){
		return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			function( callback ){
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	var getViewportSize = function(){
		if( !viewportSize ){
			var test = document.createElement( "div" );
			test.style.cssText = "position: fixed;top: 0;left: 0;bottom: 0;right: 0;";
			document.documentElement.insertBefore( test, document.documentElement.firstChild );
			viewportSize = { width: test.offsetWidth, height: test.offsetHeight };
			document.documentElement.removeChild( test );
		}
		return viewportSize;
	};

	$( window ).bind( "resize", function(){
		viewportSize = null;
	});

	var checkActivateElems = function(){
		var viewportHeight = getViewportSize().height;
		$( queue ).each(function(){
			var isActive = $( this ).is( "." + activeClass );
			var thisTop = this.getBoundingClientRect().top;
			var thisBottom = thisTop + this.offsetHeight;
			var thisOptions = $.extend( options, {
				removeClass: $( this ).is( deActivateSelector ) || false
			});
			if( thisTop  >= 0 && thisTop <= viewportHeight ||
				thisTop <= 0 && thisBottom >= viewportHeight ||
				thisBottom >= 0 && thisBottom  <= viewportHeight ){
				if( !isActive ){
					$( this )
						.addClass( activeClass )
						.trigger( "inviewport" );
				}
			}
			else if( isActive && thisOptions.removeClass === true ){
				$( this )
					.removeClass( activeClass )
					.trigger( "outviewport" );
			}
		});
	};

	var listen = function(){
		raf( checkActivateElems );
		listening = true;
		$( window ).bind( "scroll", function(){
			raf( checkActivateElems );
		} );
	};

	$.fn.porthole = function(){
		return this.each(function(){
			queue.push( this );
			if( !listening ){
				listen();
			}
		});
	};


}(jQuery));