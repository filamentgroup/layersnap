/*
* layersnap
* Copyright (c) 2015 Filament Group, Inc.
* MIT License
*/
/* global Layersnap:true */

;(function( $ ) {

	$.fn.layersnap = function( options ){
		return this.each(function(){
			return new Layersnap( this, options ).init();
		});
	};

	$( document ).bind( "inviewport", function( e ){
		$( e.target ).filter( ".layersnap" ).layersnap();
	});

	$( document ).bind( "enhance", function( e ){
		$( e.target ).find( ".layersnap[data-layersnap-init]" ).layersnap();
	});

})( jQuery );
