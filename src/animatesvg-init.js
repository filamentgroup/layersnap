/*
* animatesvg
* Copyright (c) 2015 Filament Group, Inc.
* MIT License
*/

;(function( $ ) {

	$( document ).bind( "inviewport", function( e ){
		$( e.target ).filter( ".animate-svg" ).animateSVG();
	});

	$( document ).bind( "enhance", function( e ){
		$( e.target ).find( ".animate-svg[data-animatesvg-init]" ).animateSVG();
	});

})( jQuery );