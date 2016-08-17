(function($) {
	/*
		======== A Handy Little QUnit Reference ========
		http://api.qunitjs.com/

		Test methods:
			module(name, {[setup][ ,teardown]})
			test(name, callback)
			expect(numberOfAssertions)
			stop(increment)
			start(decrement)
		Test assertions:
			ok(value, [message])
			equal(actual, expected, [message])
			notEqual(actual, expected, [message])
			deepEqual(actual, expected, [message])
			notDeepEqual(actual, expected, [message])
			strictEqual(actual, expected, [message])
			notStrictEqual(actual, expected, [message])
			throws(block, [expected], [message])
	*/


	var optionDefaults = {

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
		interactive: false,
		interactiveAttr: "data-layersnap-interact",
		interactivitySetValue: "bound",
		activeGroupClass: "layersnap-toggle-active",
		activeGroupSel: "g[id*=activegroup]",
		toggleClass: "layersnap-toggle-hide",
		toggleTriggerElementClass: "layersnap-toggle"
	};

	var optionOverrides = {

		// svg selector strings
		svgSelector: 1,
		childGroupsSelector: 1,

		// ID chunker regexps
		regDuration: /1/,
		regDelay: /1/,
		regToggle: /1/,

		// replay and interactive
		replay: 1,
		replayAttr:1 ,
		replayBtnText: 1,
		replayBtnClass: 1,
		interactive: 1,
		interactiveAttr: 1,
		interactivitySetValue: 1,
		activeGroupClass: 1,
		activeGroupSel: 1,
		toggleClass: 1,
		toggleTriggerElementClass: 1
	};


	test( 'layersnap global defined.', function() {
		expect(1);
		ok( window.Layersnap );
	});

	test( 'layersnap constructor type is function.', function() {
		expect(1);
		equal( typeof window.Layersnap, "function" );
	});

	test( 'new instance properties ', function() {
		expect(5 );
		var exampleelem = document.getElementById( "test1" );
		var ls = new window.Layersnap( exampleelem );
		equal( typeof ls, "object", 'layersnap instance type is object.' );
		ok( ls.el, "el property exists");
		equal( typeof ls.el, "object", "el prop is an object" );
		ok( ls.options, "options property exists");
		equal( typeof ls.options, "object", "options prop is an object" );


	});

	test( 'new instance option defaults', function() {
		expect(Object.keys(optionDefaults).length);
		var exampleelem = document.getElementById( "test1" );
		var ls = new window.Layersnap( exampleelem );
		for( var i in optionDefaults ){
			equal( ls.options[ i ].toString(), optionDefaults[ i ].toString(), "Value of " + i + " option is " + optionDefaults[ i ] );
		}
	});

	test( 'new instance options overrideable', function() {
		expect(Object.keys(optionOverrides).length);
		var exampleelem = document.getElementById( "test1" );
		var ls = new window.Layersnap( exampleelem, optionOverrides );
		for( var i in optionOverrides ){
			equal( ls.options[ i ].toString(), optionOverrides[ i ].toString(), "Value of " + i + " option is now overridden to " + optionOverrides[ i ] );
		}
	});











	test( 'jQuery function exists', function() {
		expect(1);
		ok( $.fn.layersnap, 'layersnap jQuery plugin defined.' );
	});


}(jQuery));
