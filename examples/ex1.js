const digraph = require('../lib/digraph.js');

ex1();

function ex1() {
	var di = new digraph();

	var n1 = di.addNode('One');
	var n2 = di.addNode('Two');
	var n3 = di.addNode('Three');

	di.addConnection(n1, n2);
	di.addConnection(n1, n3);

	di.setOption('rankdir', 'LR');

	console.log(di.generateDot());
}
