/*! layersnap - v1.0.3 - 2017-10-09
* https://github.com/filamentgroup/layersnap
* Copyright (c) 2017 Filament Group; Licensed MIT */
(function(w){

	// For CSS targeting
	var svg = !!w.document.createElementNS && !!w.document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect && !!w.document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1") && !(w.opera && w.navigator.userAgent.indexOf('Chrome') === -1) && w.navigator.userAgent.indexOf('Series40') === -1;

	if( svg ){
		w.document.documentElement.className += " svg-supported";
	}

	// set var to note whether reduced motion is preferred (for vestibular disorders, etc)
	var reduceMotion = w.matchMedia && w.matchMedia("(prefers-reduced-motion)").matches === true;


	// constructor
	w.Layersnap = function( elem, options ){
		this.el = elem;
		this.options = {

			// svg selector strings
			svgSelector: "svg",
			groupAttribute: "data-layersnap-group",

			// attr chunker regexps
			regDuration: /(^|\s|_)duration\-([\d]+)/,
			regDelay: /(^|\s|_)delay\-([\d]+)/,
			regToggle: /(^|\s|_)toggle\-([^\s_$]+)/,
			regLoop: /(^|\s|_)loop(\s|_|$)/,
			regLoopDelay: /(^|\s|_)loop-delay\-([\d]+)/,
			regRepeat: /(^|\s|_)repeat(\s|_|$)/,
			regEasing: /(^|\s|_)easing\-([a-z]+)/,
			regAmount: /(^|\s|_)amount\-([\d]+)/,

			// replay and interactive
			replay: false,
			replayAttr: "data-layersnap-replay",
			replayBtnText: "Replay",
			replayBtnClass: "layersnap-replay",
			interact: false,
			interactiveAttr: "data-layersnap-interact",
			activeGroupClass: "layersnap-toggle-active",
			activeGroupSelectorToken: "activegroup",
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

	// get the closest element with an attr (from a child target)
	w.Layersnap.prototype._getClosestAnimateGroup = function( el ){
		var cur = el;
		while( cur && cur.getAttribute( this.options.groupAttribute ) === null ) { //keep going up until you find a match
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

	// loop is for animations that return back to start
	w.Layersnap.prototype._loop = function( settings ){
		var self = this;
		return function(){
			settings.startEnd = settings.startEnd.reverse();
			settings.delay = settings.loopDelay;
			self._runTransition( settings );
		};
	};

	// repeat is for animations that simply play again the same way every time
	w.Layersnap.prototype._repeat = function( settings ){
		var self = this;
		return function(){
			self._runTransition( settings );
		};
	};

	w.Layersnap.prototype._transformTransition = function( settings ){
		if( settings.loop ){
			settings.complete = this._loop( settings );
		}
		// one or the other...
		else if( settings.repeat ){
			settings.complete = this._repeat( settings );
		}
		settings.el.attr( {transform: settings.startEnd[ 0 ] } );
		settings.el.animate({ transform: settings.startEnd[ 1 ] + "," + settings.bbox.cx + ',' + settings.bbox.cy, opacity: 1 }, settings.duration, settings.easing, settings.complete );
	};

	w.Layersnap.prototype.transitions[ "fade" ] = function( settings ){
		// amount is not applicable for fade
		if( settings.amount === null ){
			settings.amount = 100;
		}
		settings.amount = settings.amount / 100;
		settings.amount = Math.min( settings.amount, 1 );
		settings.amount = Math.max( 0, settings.amount );
		settings.amount = 1 - settings.amount;
		if( !settings.startEnd ){
			settings.startEnd = [ settings.amount, 1 ];
		}
		if( settings.loop ){
			settings.complete = this._loop( settings );
		}
		// one or the other...
		else if( settings.repeat ){
			settings.complete = this._repeat( settings );
		}
		settings.el.attr( { opacity: settings.startEnd[ 0 ] } );
		settings.el.animate({ opacity: settings.startEnd[ 1 ] }, settings.duration, mina.easeOut, settings.complete );
	};

	w.Layersnap.prototype.transitions[ "rotate-right"] = function( settings ){
		if( settings.amount === null ){
			// amount is degrees in this case
			settings.amount = 30;
		}
		if( !settings.startEnd ){
			settings.startEnd = [ "rotate(-" + settings.amount +"," + settings.bbox.cx + ',' + settings.bbox.cy + ")", "rotate(0," + settings.bbox.cx + ',' + settings.bbox.cy + ")" ];
		}
		this._transformTransition( settings );
	};

	w.Layersnap.prototype.transitions[ "rotate-left" ] = function( settings ){
		if( settings.amount === null ){
			// amount is degrees in this case
			settings.amount = 30;
		}
		if( !settings.startEnd ){
			settings.startEnd = [ "rotate(" + settings.amount +"," + settings.bbox.cx + ',' + settings.bbox.cy + ")", "rotate(0," + settings.bbox.cx + ',' + settings.bbox.cy + ")" ];
		}
		this._transformTransition( settings );
	};

	w.Layersnap.prototype.transitions[ "scale-up" ] = function( settings ){
		if( settings.amount === null ){
			// amount is scale % in this case
			settings.amount = 30;
		}
		settings.amount = ( 100 - settings.amount ) / 100;
		if( settings.amount > 1 ){
			settings.amount = 1;
		}
		if( settings.amount < 0 ){
			settings.amount = 0;
		}
		if( !settings.startEnd ){
			settings.startEnd = [ "s" + settings.amount + "," + settings.amount + "," + settings.bbox.cx + "," + settings.bbox.cy, "s1" ];
		}
		this._transformTransition( settings );
	};

	w.Layersnap.prototype.transitions[ "scale-down" ] = function( settings ){
		if( settings.amount === null ){
			// amount is start scale % in this case
			settings.amount = 30;
		}
		settings.amount = ( 100 + settings.amount ) / 100;
		if( !settings.startEnd ){
			settings.startEnd = [ "s" + settings.amount + "," + settings.amount + "," + settings.bbox.cx + "," + settings.bbox.cy, "s1" ];
		}
		this._transformTransition( settings );
	};

	w.Layersnap.prototype.transitions[ "pop" ] = function( settings ){
		if( settings.amount === null ){
			// amount is scale % in this case
			settings.amount = 80;
		}
		settings.amount = ( 100 - settings.amount ) / 100;
		settings.easing = mina.elastic;
		if( !settings.startEnd ){
			settings.startEnd = [ "s" + settings.amount + "," + settings.amount + "," + settings.bbox.cx + "," + settings.bbox.cy, "s1" ];
		}
		this._transformTransition( settings );
	};

	w.Layersnap.prototype.transitions[ "move-up" ] = function( settings ){
		if( settings.amount === null ){
			// amount is px distance in this case
			settings.amount = 100;
		}
		if( !settings.startEnd ){
			settings.startEnd = [ "translate(0,"+ settings.amount +")", "translate(0,0)" ];
		}
		this._transformTransition( settings );
	};

	w.Layersnap.prototype.transitions[ "move-down" ] = function( settings ){
		if( settings.amount === null ){
			// amount is px distance in this case
			settings.amount = 100;
		}
		if( !settings.startEnd ){
			settings.startEnd = [ "translate(0,-"+ settings.amount +")", "translate(0,0)" ];
		}
		this._transformTransition( settings );
	};

	w.Layersnap.prototype.transitions[ "move-left" ] = function( settings ){
		if( settings.amount === null ){
			// amount is px distance in this case
			settings.amount = 100;
		}
		if( !settings.startEnd ){
			settings.startEnd = [ "translate("+ settings.amount +",0)", "translate(0,0)" ];
		}
		this._transformTransition( settings );
	};

	w.Layersnap.prototype.transitions[ "move-right" ] = function( settings ){
		if( settings.amount === null ){
			// amount is px distance in this case
			settings.amount = 100;
		}
		if( !settings.startEnd ){
			settings.startEnd = [ "translate(-"+ settings.amount +",0)", "translate(0,0)" ];
		}
		this._transformTransition( settings );
	};

	w.Layersnap.prototype.transitions[ "enter-top" ] = function( settings ){
		// amount is not applicable for enter
		if( !settings.startEnd ){
			settings.startEnd = [ "translate(0," + (-this.el.offsetHeight) + ")", "translate(0,0)" ];
		}
		this._transformTransition( settings );
	};

	w.Layersnap.prototype.transitions[ "enter-bottom" ] = function( settings ){
		// amount is not applicable for enter
		if( !settings.startEnd ){
			settings.startEnd = [ "translate(0," + (this.el.offsetHeight) + ")", "translate(0,0)" ];
		}
		this._transformTransition( settings );
	};

	w.Layersnap.prototype.transitions[ "enter-right" ] = function( settings ){
		// amount is not applicable for enter
		if( !settings.startEnd ){
			settings.startEnd = [ "translate(" + (this.el.offsetWidth) + ",0)", "translate(0,0)" ];
		}
		this._transformTransition( settings );
	};

	w.Layersnap.prototype.transitions[ "enter-left" ] = function( settings ){
		// amount is not applicable for enter
		if( !settings.startEnd ){
			settings.startEnd = [ "translate(" + (-this.el.offsetWidth) + ",0)", "translate(0,0)" ];
		}
		this._transformTransition( settings );
	};

	w.Layersnap.prototype.transitions[ "anvil" ] = function( settings ){
		// amount is not applicable for anvil
		if( !settings.startEnd ){
			settings.startEnd = [ "translate(0," + (-this.el.offsetHeight) + ")", "translate(0,0)" ];
		}
		settings.easing = mina.bounce;
		this._transformTransition( settings );
	};

	w.Layersnap.prototype._runTransition = function( settings ){
		var self = this;
		this._delay( function(){
			self.transitions[ settings.transition ].call( self, settings );
		}, settings.delay );
	};

	w.Layersnap.prototype._getGroups = function(){
		return this.layersnapDiv.selectAll( "svg > g[" + this.options.groupAttribute + "]"  );
	};

	w.Layersnap.prototype.reset = function( groups ){
		( groups || this._getGroups() ).forEach(function(elem){
			elem.attr( { "opacity": 0 } );
		});
		return this;
	};

	// animate the child g elements
	w.Layersnap.prototype.play = function(){
		var self = this;
		var svg = this.layersnapDiv.select( this.options.svgSelector );
		var bbox = svg.getBBox(); //bounding box, get coords and center
		var i = 1;
		var groups = this._getGroups();
		this.reset( groups );

		groups.forEach(function(elem){
			var ret = {
				el: elem,
				duration: 800,
				amount: null,
				bbox: bbox,
				easing: mina.easeOut,
				loop: false,
				loopDelay: 0,
				repeat: false
			};
			// get settings from el attr
			var elID = ret.el.attr( self.options.groupAttribute );
			// override duration if set
			var idDuration = elID.match( self.options.regDuration);
			if( idDuration ){
				ret.duration = parseFloat( idDuration[ 2 ] );
			}
			// override delay if set
			var idDelay = elID.match( self.options.regDelay );
			ret.delay = ( ret.duration * i - ret.duration );
			if( idDelay ){
				ret.delay =  parseFloat( idDelay[ 2 ] );
			}
			// override amount if set
			var idAmount = elID.match( self.options.regAmount );
			if( idAmount ){
				ret.amount =  parseFloat( idAmount[ 2 ] );
			}

			// override easing if set
			var idEasing = elID.match( self.options.regEasing );
			if( idEasing ){
				ret.easing =  mina[ idEasing[ 2 ] ];
			}

			// override loop if set and loop
			if( elID.match( self.options.regLoop ) && !self.replay ){
				ret.loop = true;
			}
			// override repeat if set and replay
			if( elID.match( self.options.regRepeat ) && !self.replay ){
				ret.repeat = true;
			}

			// override loop delay if set
			var idLoopDelay = elID.match( self.options.regLoopDelay );
			if( idLoopDelay ){
				ret.loopDelay =  parseFloat( idLoopDelay[ 2 ] );
			}
			for( var name in self.transitions ){
				if( elID.indexOf( name ) > -1 ){
					ret.transition = name;
				}
			}

			// if reduced motion is preferred, set timing to 0 and disable looping and repeat
			if( reduceMotion ){
				ret.duration = 0;
				ret.delay = 0;
				ret.loop = false;
				ret.repeat = false;
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
			self.toggle( self._getClosestAnimateGroup( e.target ) );
		} );

		this.toggle( this.layersnapDiv.select( "g[" + this.options.groupAttribute + "*='" + this.options.activeGroupSelectorToken + "']" ).node );
	};

	// apply interactive toggle
	w.Layersnap.prototype.toggle = function( el ){
		var self = this;
		var elID = el.getAttribute( this.options.groupAttribute );
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
