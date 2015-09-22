/*! porthole - v1.0.4 - 2015-09-22
* https://github.com/filamentgroup/porthole
* Copyright (c) 2015 Filament Group; Licensed MIT */
;(function( $ ) {

	var selector = "[data-scroll-activate]";

	$( document ).bind("enhance",function(){
		$( selector ).porthole();
	} );

})( jQuery );