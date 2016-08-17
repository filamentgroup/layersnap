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


	test( 'layersnap global defined.', function() {
		expect(1);
		ok( window.Layersnap );
	});

	test( 'layersnap constructor type is function.', function() {
		expect(1);
		equal( typeof window.Layersnap, "function" );
	});

	test( 'new instance test', function() {
		expect(1);
		var exampleelem = document.getElementById( "test1" );
		var ls = new Layersnap( exampleelem );
		equal( typeof ls, "object", 'layersnap instance type is object.' );

	});











	test( 'jQuery function exists', function() {
		expect(1);
		ok( $.fn.layersnap, 'layersnap jQuery plugin defined.' );
	});


}(jQuery));
