const digraph = require('../lib/digraph.js');

ex3();

function ex3() {
  var di = new digraph();
  di.traverse({a:1,b:1}, {max_depth:5}, cbhandler)
  .then(function() {
    console.log(di.generateDot());  
  })
}

function cbhandler(ref, userdata, handler) {
  var label = '(' + ref.a + ' ' + ref.b + ')';
  var us = handler.findOrAddNode(label); // in this case there is a 1:1 mapping between the label and its contents

  if (userdata.max_depth) {
    handler.request({a:ref.a+1, b:ref.b}, {max_depth:userdata.max_depth-1})
    .then(function(node) {
      if (!handler.isConnected(us,node))
        handler.addConnection(us, node);
    });

    handler.request({a:ref.a+1, b:ref.b+1}, {max_depth:userdata.max_depth-1})
    .then(function(node) {
      if (!handler.isConnected(us,node))
       handler.addConnection(us, node);
    });
  }

  return us;
}