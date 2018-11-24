const digraph = require('../lib/digraph.js');

ex2();

function ex2() {
	var di = new digraph();

	addPascal(di, 0, 0, 3);

	console.log(di.generateDot());
}

function addPascal(di, a, b, max_depth) {
	var label = '(' + a + ' ' + b + ')';
	var us = di.findOrAddNode(label);

	if (--max_depth) {
		var left = addPascal(di, a+1, b, max_depth);
		var right = addPascal(di, a+1, b+1, max_depth);
		di.addConnection(us, left);
		di.addConnection(us, right);
	}

	return us;
}
