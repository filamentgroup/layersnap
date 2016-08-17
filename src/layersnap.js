/*
SVG Build Animations
*/

(function(w){

	// For CSS targeting
	var svg = !!w.document.createElementNS && !!w.document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect && !!w.document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1") && !(w.opera && w.navigator.userAgent.indexOf('Chrome') === -1) && w.navigator.userAgent.indexOf('Series40') === -1;

	if( svg ){
		w.document.documentElement.className += " svg-supported";
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


	// constructor
	w.Layersnap = function( elem, options ){
		this.el = elem;
		this.options = {
			replay: false,
			interactive: false
		};
		// override defaults
		if( options ){
			for( var i in options ){
				this.options[ i ] = options[ i ];
			}
		}

		var thisReplayAttr = this.el.getAttribute( replayAttr );
		if( thisReplayAttr !== null ){
			this.options.replay = true;
		}
		var thisInteractiveAttr = this.el.getAttribute( interactiveAttr );
		if( thisInteractiveAttr !== null && thisInteractiveAttr !== interactivitySet ){
			this.options.interactive = true;
		}
	};

	// more transitions can be added here
	w.Layersnap.prototype.transitions = {};

	w.Layersnap.prototype.transitions[ "rotate-right"] = function( el, duration, bbox ){
		el.attr( {transform: "r-30"} );
		el.animate({ transform: "r0," + bbox.cx + ',' + bbox.cy, opacity: 1 }, duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "rotate-left" ] = function( el, duration, bbox ){
		el.attr( {transform: "r30"} );
		el.animate({ transform: "r0," + bbox.cx + ',' + bbox.cy, opacity: 1 }, duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "fade" ] = function( el, duration ){
		el.animate({ opacity: 1 }, duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "scale-up" ] = function( el, duration, bbox ){
		el.attr( {transform: "s.7"} );
		el.animate({ opacity: 1, transform: "s1," + bbox.cx + ',' + bbox.cy }, duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "scale-down" ] = function( el, duration, bbox ){
		el.attr( {transform: "s1.3"} );
		el.animate({ opacity: 1, transform: "s1," + bbox.cx + ',' + bbox.cy }, duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "pop" ] = function( el, duration, bbox ){
		el.attr( {transform: "s.7"} );
		el.animate({ opacity: 1, transform: "s1," + bbox.cx + ',' + bbox.cy }, duration, mina.elastic );
	};

	w.Layersnap.prototype.transitions[ "drift-up" ] = function( el, duration ){
		el.attr( {transform: "translate(0,30)"} );
		el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "drift-down" ] = function( el, duration ){
		el.attr( {transform: "translate(0,-30)"} );
		el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "drift-left" ] = function( el, duration ){
		el.attr( {transform: "translate(30,0)"} );
		el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "drift-right" ] = function( el, duration ){
		el.attr( {transform: "translate(-30,0)"} );
		el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "slide-up" ] = function( el, duration, bbox ){
		el.attr( {transform: "translate(0," + bbox.height + ")"} );
		el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "slide-down" ] = function( el, duration, bbox ){
		el.attr( {transform: "translate(0," + -bbox.height + ")"} );
		el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "slide-left" ] = function( el, duration, bbox ){
		el.attr( {transform: "translate(" + bbox.width + ",0)"} );
		el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
	};

	w.Layersnap.prototype.transitions[ "slide-right" ] = function( el, duration, bbox ){
		el.attr( {transform: "translate(" + -bbox.width + ",0)"} );
		el.animate({ opacity: 1, transform: "translate(0,0)" }, duration, mina.easeOut );
	};

	w.Layersnap.prototype.runTransition = function( settings ){
		var self = this;
		setTimeout( function(){
			self.transitions[ settings.transition ]( settings.el, settings.duration, settings.bbox );
		}, settings.delay );
	};

	w.Layersnap.prototype.init = function(){
		var self = this;
		var i = 1;
		var layersnapDiv = new Snap( this.el );
		self.layersnapDiv = layersnapDiv;
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
			for( var name in self.transitions ){
				if( elID.indexOf( name ) > -1 ){
					ret.transition = name;
				}
			}
			if( ret.transition ){
				self.runTransition( ret );
			}
			i++;
		});

		// replay button
		if( self.options.replay ){
			self.addReplayButton();
		}

		// interactivity
		if( self.options.interactive ){
			self.addInteractivity();
		}
	};

	w.Layersnap.prototype.addReplayButton = function(){
		var self = this;
		var btn = w.document.createElement( "button" );
		btn.className = replayBtnClass;
		btn.title = replayBtnText;
		btn.innerText = replayBtnText;
		btn.onclick = function( e ){
			e.preventDefault();
			self.init();
		};
		self.el.appendChild( btn );
		this.el.removeAttribute( replayAttr );
	};

	w.Layersnap.prototype._getClosestID = function( el ){
		var cur = el;
    while( cur && cur.getAttribute( "id" ) === null ) { //keep going up until you find a match
        cur = cur.parentNode; //go up
    }
    return cur;
	};

	w.Layersnap.prototype._triggerEvent = function( elem, evt ){
		var event = document.createEvent('Event');
		event.initEvent( evt, true, true);
		elem.dispatchEvent( event );
	};

	w.Layersnap.prototype.toggle = function( e ){
		var self = this;
		var el = this._getClosestID( e.target );
		var elID = el.getAttribute( "id" );
		if( elID ){
			var toggleID = elID.match( regToggle );
			if( toggleID.length ){
				var toggle = w.document.querySelector( "#" + toggleID[ 2 ] );

				var $el = new Snap( el );

				// deactivate/activate toggle elements
				self.layersnapDiv.selectAll( "." + toggleTriggerElementClass ).forEach( function( elem ){
						if( elem.node.className.indexOf( toggleClass ) === -1 ){
							elem.node.className += " " + toggleClass;
						}
				} );

				toggle.className = toggle.className.replace( toggleClass, " " );

				// trigger layersnap on a toggle'd element that has a layersnap class
				if( toggle.className.match( /[\s^]layersnap[$\s]/ ) ){
					new w.Layersnap( toggle ).init();
				}

				// activate svg group
				self.layersnapDiv.selectAll( "g." + activeGroupClass ).forEach(function(elem){
					elem.removeClass( activeGroupClass );
				});
				$el.addClass( activeGroupClass );
			}
		}
	};

	w.Layersnap.prototype.addInteractivity = function(){
		var self = this;
		this.layersnapDiv.attr( interactiveAttr, interactivitySet );

		this.el.addEventListener( "click", function( e ){
			self.toggle( e );
		} );
		this.el.addEventListener( "layersnaptoggle", function( e ){
			self.toggle( e );
		} );


		// hide all .layersnap-toggle elems
		this.layersnapDiv.selectAll( "." + activeGroupClass ).forEach( function( elem ){
			elem.addClass( toggleClass );
		});

		// trigger initial toggle if specified
		this._triggerEvent( this.layersnapDiv.select( activeGroupSel ).node, "layersnaptoggle" );
	};

}(this));
