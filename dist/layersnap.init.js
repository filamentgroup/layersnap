/*! layersnap - v0.1.7 - 2016-08-16
* https://github.com/filamentgroup/layersnap
* Copyright (c) 2016 Filament Group; Licensed MIT */
;(function( $ ) {

	$( document ).bind( "inviewport", function( e ){
		$( e.target ).filter( ".layersnap" ).layersnap();
	});

	$( document ).bind( "enhance", function( e ){
		$( e.target ).find( ".layersnap[data-layersnap-init]" ).layersnap();
	});

})( jQuery );