/*! layersnap - v1.2.0 - 2020-04-27
* https://github.com/filamentgroup/layersnap
* Copyright (c) 2020 Filament Group; Licensed MIT */
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
