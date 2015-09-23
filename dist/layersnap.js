/*! layersnap - v0.1.0 - 2015-09-23
* https://github.com/filamentgroup/layersnap
* Copyright (c) 2015 Filament Group; Licensed MIT */
(function($,w){

	// For CSS targeting
	var svg = !!w.document.createElementNS && !!w.document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect && !!w.document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1") && !(w.opera && w.navigator.userAgent.indexOf('Chrome') === -1) && w.navigator.userAgent.indexOf('Series40') === -1;

	if( svg ){
		$( w.document.documentElement ).addClass( "svg-supported" );
	}

	$.fn.layersnap = function(){
		return this.each(function(){
			var i = 1;
			var layersnapDiv = new Snap( this );
			var svg = layersnapDiv.select( "svg" );
			var bbox = svg.getBBox(); //bounding box, get coords and centre

			layersnapDiv.selectAll( "svg > g[id]" ).forEach(function(elem){
				var el = elem;
				el.attr( "opacity", 0 );
				var elID = el.attr( "id" );
				var idDuration = elID.match( /(^|\s|_)duration[\-_]+([\d]+)/ );
				var duration = 800;
				if( idDuration ){
					duration = parseFloat( idDuration[ 2 ] );
				}
				var idDelay = elID.match( /(^|\s|_)delay[\-_]+([\d]+)/ );
				var delay = ( duration * i - duration );
				if( idDelay ){
					delay =  parseFloat( idDelay[ 2 ] );
				}
				setTimeout(function(){
					if( elID.indexOf( "rotate-right" ) > -1 ){
						el.attr( {transform: "r-30"} );
						el.animate({ transform: "r0," + bbox.cx + ',' + bbox.cy, opacity: 1 }, duration, mina.easeOut );
					}
					if( elID.indexOf( "rotate-left" ) > -1 ){
						el.attr( {transform: "r30"} );
						el.animate({ transform: "r0," + bbox.cx + ',' + bbox.cy, opacity: 1 }, duration, mina.easeOut );
					}
					if( elID.indexOf( "fade" ) > -1 ){
						el.animate({ opacity: 1 }, duration, mina.easeOut );
					}
					if( elID.indexOf( "scale-up" ) > -1 ){
						el.attr( {transform: "s.7"} );
						el.animate({ opacity: 1, transform: "s1," + bbox.cx + ',' + bbox.cy }, duration, mina.easeOut );
					}
					if( elID.indexOf( "scale-down" ) > -1 ){
						el.attr( {transform: "s1.3"} );
						el.animate({ opacity: 1, transform: "s1," + bbox.cx + ',' + bbox.cy }, duration, mina.easeOut );
					}
					if( elID.indexOf( "pop" ) > -1 ){
						el.attr( {transform: "s.7"} );
						el.animate({ opacity: 1, transform: "s1," + bbox.cx + ',' + bbox.cy }, duration, mina.elastic );
					}
					if( elID.indexOf( "drift-up"  ) > -1){
						el.attr( {transform: "translate(0,30)"} );
						el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
					}
					if( elID.indexOf( "drift-down"  ) > -1){
						el.attr( {transform: "translate(0,-30)"} );
						el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
					}
					if( elID.indexOf( "drift-left"  ) > -1){
						el.attr( {transform: "translate(30,0)"} );
						el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
					}
					if( elID.indexOf( "drift-right"  ) > -1){
						el.attr( {transform: "translate(-30,0)"} );
						el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
					}
					if( elID.indexOf( "slide-up"  ) > -1){
						el.attr( {transform: "translate(0," + bbox.height + ")"} );
						el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
					}
					if( elID.indexOf( "slide-down"  ) > -1){
						el.attr( {transform: "translate(0," + -bbox.height + ")"} );
						el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
					}
					if( elID.indexOf( "slide-left"  ) > -1){
						el.attr( {transform: "translate(" + bbox.width + ",0)"} );
						el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
					}
					if( elID.indexOf( "slide-right"  ) > -1){
						el.attr( {transform: "translate(" + -bbox.width + ",0)"} );
						el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
					}
				}, delay );
				i++;
			});

			// interactivity
			var interactiveAttr = "data-layersnap-interact";
			var activeGroupClass = "layersnap-toggle-active";
			var activeGroupID = "activegroup";
			var toggleClass = "layersnap-toggle-hide";
			var toggleTriggerElementClass = "layersnap-toggle";
			if( $( this ).is( "[" + interactiveAttr + "]" ) && $( this ).attr( interactiveAttr ) !== "bound" ){

				var $svgParent = $( this );
				$svgParent
					.attr( interactiveAttr, "bound" )
					.bind( "tap", function( e ){
						var $el = $( e.target ).closest( "g[id]" );
						var elID = $el.attr( "id" );
						if( elID ){
							var toggleID = elID.match( /(^|\s|_)toggle\-([^\s_$]+)/ );
							if( toggleID.length ){
								var $toggle = $( "#" + toggleID[ 2 ] );

								// deactivate/activate toggle elements
								$toggle.removeClass( toggleClass );
								$toggle.siblings().filter( "." + toggleTriggerElementClass ).addClass( toggleClass );

								// activate svg group
								$el.attr( "class", activeGroupClass );
								$el.siblings().attr( "class", "" );
							}
						}
					} );

				// hide all .layersnap-toggle elems
				$svgParent.find( "." + activeGroupClass ).addClass( toggleClass );

				// trigger initial toggle if specified
				$svgParent
					.find( "g[id*='" + activeGroupID + "'" )
					.trigger( "tap" );
			}

		});
	};

}(jQuery,this));