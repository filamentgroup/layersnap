/*! layersnap - v0.1.7 - 2016-09-08
* https://github.com/filamentgroup/layersnap
* Copyright (c) 2016 Filament Group; Licensed MIT */
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
