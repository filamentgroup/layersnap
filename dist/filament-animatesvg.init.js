/*! animatesvg - v0.1.0 - 2015-09-22
* https://github.com/filamentgroup/animatesvg
* Copyright (c) 2015 Filament Group; Licensed MIT */
;(function( $ ) {

	$( document ).bind( "inviewport", function( e ){
		$( e.target ).filter( ".animate-svg" ).animateSVG();
	});

	$( document ).bind( "enhance", function( e ){
		$( e.target ).find( ".animate-svg[data-animatesvg-init]" ).animateSVG();
	});

})( jQuery );