/*! layersnap - v0.1.4 - 2015-10-09
* https://github.com/filamentgroup/layersnap
* Copyright (c) 2015 Filament Group; Licensed MIT */
;(function( $ ) {

	$( document ).bind( "inviewport", function( e ){
		$( e.target ).filter( ".layersnap" ).layersnap();
	});

	$( document ).bind( "enhance", function( e ){
		$( e.target ).find( ".layersnap[data-layersnap-init]" ).layersnap();
	});

})( jQuery );