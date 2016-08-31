/*! layersnap - v0.1.7 - 2016-08-31
* https://github.com/filamentgroup/layersnap
* Copyright (c) 2016 Filament Group; Licensed MIT */
(function(w){

	// For CSS targeting
	var svg = !!w.document.createElementNS && !!w.document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect && !!w.document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1") && !(w.opera && w.navigator.userAgent.indexOf('Chrome') === -1) && w.navigator.userAgent.indexOf('Series40') === -1;

	if( svg ){
		w.document.documentElement.className += " svg-supported";
	}

	// constructor
	w.Layersnap = function( elem, options ){
		this.el = elem;
		this.options = {

			// svg selector strings
			svgSelector: "svg",
			childGroupsSelector: "svg > g[id]",

			// ID chunker regexps
			regDuration: /(^|\s|_)duration[\-_]+([\d]+)/,
			regDelay: /(^|\s|_)delay[\-_]+([\d]+)/,
			regToggle: /(^|\s|_)toggle\-([^\s_$]+)/,

			// replay and interactive
			replay: false,
			replayAttr: "data-layersnap-replay",
			replayBtnText: "Replay",
			replayBtnClass: "layersnap-replay",
			interact: false,
			interactiveAttr: "data-layersnap-interact",
			activeGroupClass: "layersnap-toggle-active",
			activeGroupSel: "g[id*=activegroup]",
			toggleClass: "layersnap-toggle-hide",
			toggleTriggerElementClass: "layersnap-toggle"
		};

		// override defaults
		for( var i in this.options ){
			if( options && options[ i ] !== undefined ){
				this.options[ i ] = options[ i ];
			}

			// allow element data attrs to have last word
			var value = this.el.getAttribute( "data-layersnap-" + i.replace( /[A-Z]/g, this._dashAndLowercase ) );
			if ( value !== null ) {
				if( value === "true" || value === "false" ){
					this.options[ i ] = value === "true";
				}
				else if( value.toString().length > 0 ){
					this.options[ i ] = value;
				}
				else {
					this.options[ i ] = true;
				}
			}
		}
	};

	// polyfill raf if needed
	var raf = (function(){
		return w.requestAnimationFrame       ||
			w.webkitRequestAnimationFrame ||
			w.mozRequestAnimationFrame    ||
			function( callback ){
				w.setTimeout(callback, 1000 / 60);
			};
	})();

	w.Layersnap.prototype._delay = function( cb, time ){
		var start = new Date().getTime();
		var checkrun = function(){
			var current = new Date().getTime();
			if( current - start >= time ){
				cb();
			}
			else {
				raf( checkrun );
			}
		};
		checkrun();
	};

	// helper for prefixing a value with a dash and lowercasing it. Used for converting options to data-attributes
	w.Layersnap.prototype._dashAndLowercase = function( c ) {
		return "-" + c.toLowerCase();
	};

	// get the closest element with an ID (from a child target)
	w.Layersnap.prototype._getClosestID = function( el ){
		var cur = el;
		while( cur && cur.getAttribute( "id" ) === null ) { //keep going up until you find a match
				cur = cur.parentNode; //go up
		}
		return cur;
	};

	// init the
	w.Layersnap.prototype.init = function(){
		this.layersnapDiv = new Snap( this.el );

		// replay button
		if( this.options.replay ){
			this.addReplayButton();
		}

		// interactivity
		if( this.options.interact ){
			this.addInteractivity();
		}

		// play the animation
		this.play();
	};

	// more transitions can be added here
	w.Layersnap.prototype.transitions = {};

	w.Layersnap.prototype.transitions[ "rotate-right"] = function( settings ){
		settings.el.attr( {transform: "r-30"} );
		settings.el.animate({ transform: "r0," + settings.bbox.cx + ',' + settings.bbox.cy, opacity: 1 }, settings.duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "rotate-left" ] = function( settings ){
		settings.el.attr( {transform: "r30"} );
		settings.el.animate({ transform: "r0," + settings.bbox.cx + ',' + settings.bbox.cy, opacity: 1 }, settings.duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "fade" ] = function( settings ){
		settings.el.animate({ opacity: 1 }, settings.duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "scale-up" ] = function( settings ){
		settings.el.attr( {transform: "s.7"} );
		settings.el.animate({ opacity: 1, transform: "s1," + settings.bbox.cx + ',' + settings.bbox.cy }, settings.duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "scale-down" ] = function( settings ){
		settings.el.attr( {transform: "s1.3"} );
		settings.el.animate({ opacity: 1, transform: "s1," + settings.bbox.cx + ',' + settings.bbox.cy }, settings.duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "pop" ] = function( settings ){
		settings.el.attr( {transform: "s.7"} );
		settings.el.animate({ opacity: 1, transform: "s1," + settings.bbox.cx + ',' + settings.bbox.cy }, settings.duration, mina.elastic );
	};

	w.Layersnap.prototype.transitions[ "drift-up" ] = function( settings ){
		settings.el.attr( {transform: "translate(0,30)"} );
		settings.el.animate({ opacity: 1, transform: "translate(0,0)" }, settings.duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "drift-down" ] = function( settings ){
		settings.el.attr( {transform: "translate(0,-30)"} );
		settings.el.animate({ opacity: 1, transform: "translate(0,0)" }, settings.duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "drift-left" ] = function( settings ){
		settings.el.attr( {transform: "translate(30,0)"} );
		settings.el.animate({ opacity: 1, transform: "translate(0,0)" }, settings.duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "drift-right" ] = function( settings ){
		settings.el.attr( {transform: "translate(-30,0)"} );
		settings.el.animate({ opacity: 1, transform: "translate(0,0)" }, settings.duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "slide-up" ] = function( settings ){
		settings.el.attr( {transform: "translate(0," + settings.bbox.height + ")"} );
		settings.el.animate({ opacity: 1, transform: "translate(0,0)" }, settings.duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "slide-down" ] = function( settings ){
		settings.el.attr( {transform: "translate(0," + -settings.bbox.height + ")"} );
		settings.el.animate({ opacity: 1, transform: "translate(0,0)" }, settings.duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "slide-left" ] = function( settings ){
		settings.el.attr( {transform: "translate(" + settings.bbox.width + ",0)"} );
		settings.el.animate({ opacity: 1, transform: "translate(0,0)" }, settings.duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "slide-right" ] = function( settings ){
		settings.el.attr( {transform: "translate(" + -settings.bbox.width + ",0)"} );
		settings.el.animate({ opacity: 1, transform: "translate(0,0)" }, settings.duration, mina.easeOut );
	};

	w.Layersnap.prototype._runTransition = function( settings ){
		var self = this;
		this._delay( function(){
			self.transitions[ settings.transition ]( settings );
		}, settings.delay );
	};

	// animate the child g elements
	w.Layersnap.prototype.play = function(){
		var self = this;
		var svg = this.layersnapDiv.select( this.options.svgSelector );
		var bbox = svg.getBBox(); //bounding box, get coords and center
		var i = 1;

		this.layersnapDiv.selectAll( this.options.childGroupsSelector ).forEach(function(elem){
			var ret = {
				el: elem,
				duration: 800,
				bbox: bbox
			};
			// get settings from el ID
			var elID = ret.el.attr( "id" );
			ret.el.attr( { "opacity": 0 } );
			// override duration if set
			var idDuration = elID.match( self.options.regDuration);
			if( idDuration ){
				ret.duration = parseFloat( idDuration[ 2 ] );
			}
			// override duration if set
			var idDelay = elID.match( self.options.regDelay );
			ret.delay = ( ret.duration * i - ret.duration );
			if( idDelay ){
				ret.delay =  parseFloat( idDelay[ 2 ] );
			}
			for( var name in self.transitions ){
				if( elID.indexOf( name ) > -1 ){
					ret.transition = name;
				}
			}
			if( ret.transition ){
				self._runTransition( ret );
			}
			i++;
		});
	};

	// add replay button and bind click event for it to replay animation on click
	w.Layersnap.prototype.addReplayButton = function(){
		var self = this;
		if( this.replayBound ){
			return;
		}
		else {
			this.replayBound = true;
		}
		var btn = w.document.createElement( "button" );
		btn.className = self.options.replayBtnClass;
		btn.title = self.options.replayBtnText;
		btn.innerText = self.options.replayBtnText;
		btn.onclick = function( e ){
			e.preventDefault();
			self.play();
		};
		self.el.appendChild( btn );
	};

	// adds the ability to toggle classes between svg group triggers and related elements
	w.Layersnap.prototype.addInteractivity = function(){
		if( this.interactivityBound ){
			return;
		}
		else {
			this.interactivityBound = true;
		}
		var self = this;
		this.el.addEventListener( "click", function( e ){
			self.toggle( self._getClosestID( e.target ) );
		} );

		this.toggle( this.layersnapDiv.select( this.options.activeGroupSel ).node );
	};

	// apply interactive toggle
	w.Layersnap.prototype.toggle = function( el ){
		var self = this;
		var elID = el.getAttribute( "id" );
		if( elID ){
			var toggleID = elID.match( self.options.regToggle );
			if( toggleID.length ){
				var toggle = w.document.querySelector( "#" + toggleID[ 2 ] );

				var $el = new Snap( el );

				// deactivate/activate toggle elements
				self.layersnapDiv.selectAll( "." + self.options.toggleTriggerElementClass ).forEach( function( elem ){
						if( elem.node.className.indexOf( self.options.toggleClass ) === -1 ){
							elem.node.className += " " + self.options.toggleClass;
						}
				} );

				toggle.className = toggle.className.replace( self.options.toggleClass, " " );

				// trigger layersnap on a toggle'd element that has a layersnap class
				if( toggle.className.match( /[\s^]layersnap[$\s]/ ) ){
					new w.Layersnap( toggle ).init();
				}

				// activate svg group
				self.layersnapDiv.selectAll( "g." + self.options.activeGroupClass ).forEach(function(elem){
					elem.removeClass( self.options.activeGroupClass );
				});
				$el.addClass( self.options.activeGroupClass );
			}
		}
	};

}(this));
