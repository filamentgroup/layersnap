/*! layersnap - v0.1.6 - 2015-10-12
* https://github.com/filamentgroup/layersnap
* Copyright (c) 2015 Filament Group; Licensed MIT */
(function($,w){

	// For CSS targeting
	var svg = !!w.document.createElementNS && !!w.document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect && !!w.document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1") && !(w.opera && w.navigator.userAgent.indexOf('Chrome') === -1) && w.navigator.userAgent.indexOf('Series40') === -1;

	if( svg ){
		$( w.document.documentElement ).addClass( "svg-supported" );
	}

	// strings
	var svgEl = "svg";
	var childGroups = svgEl + " > g[id]";
	var replayAttr = "data-layersnap-replay";
	var replayBtnText = "Replay";
	var replayBtnClass = "layersnap-replay";

	// ID chunker regexps
	var regDuration = /(^|\s|_)duration[\-_]+([\d]+)/;
	var regDelay = /(^|\s|_)delay[\-_]+([\d]+)/;
	var regToggle = /(^|\s|_)toggle\-([^\s_$]+)/;

	// interactivity
	var interactiveAttr = "data-layersnap-interact";
	var activeGroupClass = "layersnap-toggle-active";
	var activeGroupID = "activegroup";
	var activeGroupSel = "g[id*=" + activeGroupID + "]";
	var toggleClass = "layersnap-toggle-hide";
	var toggleTriggerElementClass = "layersnap-toggle";
	var interactivitySet = "bound";

	var transitions = {
		"rotate-right": function( el, duration, bbox ){
			el.attr( {transform: "r-30"} );
			el.animate({ transform: "r0," + bbox.cx + ',' + bbox.cy, opacity: 1 }, duration, mina.easeOut );
		},
		"rotate-left": function( el, duration, bbox ){
			el.attr( {transform: "r30"} );
			el.animate({ transform: "r0," + bbox.cx + ',' + bbox.cy, opacity: 1 }, duration, mina.easeOut );
		},
		"fade": function( el, duration ){
			el.animate({ opacity: 1 }, duration, mina.easeOut );
		},
		"scale-up": function( el, duration, bbox ){
			el.attr( {transform: "s.7"} );
			el.animate({ opacity: 1, transform: "s1," + bbox.cx + ',' + bbox.cy }, duration, mina.easeOut );
		},
		"scale-down": function( el, duration, bbox ){
			el.attr( {transform: "s1.3"} );
			el.animate({ opacity: 1, transform: "s1," + bbox.cx + ',' + bbox.cy }, duration, mina.easeOut );
		},
		"pop": function( el, duration, bbox ){
			el.attr( {transform: "s.7"} );
			el.animate({ opacity: 1, transform: "s1," + bbox.cx + ',' + bbox.cy }, duration, mina.elastic );
		},
		"drift-up": function( el, duration ){
			el.attr( {transform: "translate(0,30)"} );
			el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
		},
		"drift-down": function( el, duration ){
			el.attr( {transform: "translate(0,-30)"} );
			el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
		},
		"drift-left": function( el, duration ){
			el.attr( {transform: "translate(30,0)"} );
			el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
		},
		"drift-right": function( el, duration ){
			el.attr( {transform: "translate(-30,0)"} );
			el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
		},
		"slide-up": function( el, duration, bbox ){
			el.attr( {transform: "translate(0," + bbox.height + ")"} );
			el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
		},
		"slide-down": function( el, duration, bbox ){
			el.attr( {transform: "translate(0," + -bbox.height + ")"} );
			el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
		},
		"slide-left": function( el, duration, bbox ){
			el.attr( {transform: "translate(" + bbox.width + ",0)"} );
			el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
		},
		"slide-right": function( el, duration, bbox ){
			el.attr( {transform: "translate(" + -bbox.width + ",0)"} );
			el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
		}
	};

	var runTransition = function( settings ){
		setTimeout( function(){
			transitions[ settings.transition ]( settings.el, settings.duration, settings.bbox );
		}, settings.delay );
	};

	$.fn.layersnap = function(){

		return this.each(function(){
			var i = 1;
			var $svgParent = $( this );
			var layersnapDiv = new Snap( this );
			var svg = layersnapDiv.select( svgEl );
			var bbox = svg.getBBox(); //bounding box, get coords and center

			layersnapDiv.selectAll( childGroups ).forEach(function(elem){
				var ret = {
					el: elem,
					duration: 800,
					bbox: bbox
				};
				// get settings from el ID
				var elID = ret.el.attr( "id" );
				ret.el.attr( { "opacity": 0 } );
				// override duration if set
				var idDuration = elID.match( regDuration);
				if( idDuration ){
					ret.duration = parseFloat( idDuration[ 2 ] );
				}
				// override duration if set
				var idDelay = elID.match( regDelay );
				ret.delay = ( ret.duration * i - ret.duration );
				if( idDelay ){
					ret.delay =  parseFloat( idDelay[ 2 ] );
				}
				for( var name in transitions ){
					if( transitions.hasOwnProperty( name ) && elID.indexOf( name ) > -1 ){
						ret.transition = name;
					}
				}
				if( ret.transition ){
					runTransition( ret );
				}
				i++;
			});

			// replay button
			if( $svgParent.is( "[" + replayAttr + "]" ) ){
				$( "<button class='" + replayBtnClass + "' title='" + replayBtnText + "'>" + replayBtnText + "</button>" )
					.bind( "click", function( e ){
						$svgParent.layersnap();
						e.preventDefault();
					})
					.appendTo( $svgParent );

				$svgParent.removeAttr( replayAttr );
			}

			// interactivity
			if( $svgParent.is( "[" + interactiveAttr + "]" ) && $svgParent.attr( interactiveAttr ) !== interactivitySet ){

				$svgParent
					.attr( interactiveAttr, interactivitySet )
					.bind( "click toggleElem", function( e ){
						var $el = $( e.target ).closest( "g[id]" );
						var elID = $el.attr( "id" );
						if( elID ){
							var toggleID = elID.match( regToggle );
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
					.find( activeGroupSel )
					.trigger( "toggleElem" );
			}

		});
	};

}(jQuery,this));
