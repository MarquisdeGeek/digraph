(function() {
  function digraph() {
  var idCount;
  var options;
  var nodeList;
  var edgeList;
  var crlf = '\n';

    (function ctor() {
      idCount = 0;
      options = {};
      nodeList = [];
      edgeList = [];
    })();

    function diNode(id_) {
    var nodeID;
    var label;
    var labelImage;
    var userdata;
    var unique;

      (function ctor(id_) {
        nodeID = '_' + id_;
        userdata = {};
      })(id_);

      function id() {
        return nodeID;
      }

      function setLabelText(txt) {
        label = txt;
        unique = txt; // by default, we use this, but the user can override with setUniqueRef
      }

      function getLabelText(txt) {
        return label;
      }

      function setLabelImage(uri) {
        labelImage = uri;
      }

      function setUniqueRef(ref) {
        unique = ref;
      }

      function getUniqueRef() {
        return unique;
      }

      function data() {
        return userdata;
      }

      function getDotLabel() {
        var id_prefix = '"' + nodeID + '"';
        if (label) {
          return id_prefix + ' [label="' + label + '" ]';
        }
        return id_prefix + ' [image="' + labelImage + '" label="" ]';

      }

      return {
        id,
        setLabelText,
        setLabelImage,
        getLabelText,
        setUniqueRef,
        getUniqueRef,
        getDotLabel,
        data
      }
    }

    function setOption(name, value) {
      options[name] = value;
    }

    function setOutputCRLF(new_crlf) {
      crlf = new_crlf;
    }

    function traverse(startAt, userdata, cbfn) {
      return new Promise((resolve, reject) => {
        var todolist = [];
        var promiseList = [];
        var handler = {
            request: function(ref, userd) {
              var promise = new Promise((resolve, reject) => {
                todolist.push({ref:ref, userd:userd, resolve:resolve});
              });
              promiseList.push(promise);
              return promise;
            },
            addNode: addNode,
            isConnected: isConnected,
            findOrAddNode: findOrAddNode,
            findNodeByUniqueRef: findNodeByUniqueRef,
            addConnection: addConnection,
            setOption: setOption      
        };

        // Kickstart the process
        handler.request(startAt, userdata);

        while(todolist.length) {
          var queued = todolist[0];

          queued.resolve(cbfn(queued.ref, queued.userd, handler));
          todolist.shift();
        }
        //
        Promise.all(promiseList)
        .then(function() {
          resolve();
        });
      });
    }


    function addNode(label) {
      var node = new diNode(++idCount);
      node.setLabelText(label);
      nodeList.push(node);
      return node;
    }

    function addConnection(first, second, label) {
      var edge = { first: first, second: second, label: label };
      edgeList.push(edge);
      return edge;
    }

    function isConnected(first, second) {
      for(var i=0;i<edgeList.length;++i) {
        // Because graphs are directional (i.e directed) we only apply this
        // check in the order given.
        if (first === edgeList[i].first && second === edgeList[i].second) {
          return true;
        }
      }
      return false;
    }

    function generateDot() {
      var str = 'digraph G {' + crlf;

      for(var i=0;i<nodeList.length;++i) {
        if (nodeList[i]) {
          str += nodeList[i].getDotLabel();
          str += ';';
          str += crlf;  
        }
      }

      for(var i=0;i<edgeList.length;++i) {
        if (edgeList[i]) {
          str += '"' + edgeList[i].first.id() + '" -> "' + edgeList[i].second.id() + '"';
          if (edgeList[i].label) {
            str += ' [label="' + edgeList[i].label + '", fontsize=10]';
          }

          str += ';';
          str += crlf;  
        }
      }
      str += '}' + crlf;

      return str;
    }

    function findNodeByUniqueRef(ref) {
      var refJSON = JSON.stringify(ref);
      for(var i=0;i<nodeList.length;++i) {
        if (JSON.stringify(nodeList[i].getUniqueRef()) === refJSON) {
          return nodeList[i];
        }
      }
      return undefined;
    }

    function findNodeByLabelText(label) {
      for(var i=0;i<nodeList.length;++i) {
        if (nodeList[i].getLabelText() === label) {
          return nodeList[i];
        }
      }
      return undefined;
    }

    function findOrAddNode(label) {
      var node = findNodeByLabelText(label);
      if (node) {
        return node;
      }
      return addNode(label);
    }

    return {
      setOption,
      setOutputCRLF,
      traverse,
      addNode,
      findNodeByLabelText,
      findNodeByUniqueRef,
      findOrAddNode,
      isConnected,
      addConnection,
      generateDot,
    }
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = digraph;
  else
    window.digraph = digraph;
})();
