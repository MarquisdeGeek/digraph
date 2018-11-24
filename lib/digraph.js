(function() {
  function digraph() {
  var idCount;
  var options;
  var nodeList;
  var edgeList;
  var crlf = '\\n';

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

      (function ctor(id_) {
        nodeID = '_' + id_;
        userdata = {};
      })(id_);

      function id() {
        return nodeID;
      }

      function setLabelText(txt) {
        label = txt;
      }

      function getLabelText(txt) {
        return label;
      }

      function setLabelImage(uri) {
        labelImage = uri;
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

    function findOrAddNode(label) {
      for(var i=0;i<nodeList.length;++i) {
        if (nodeList[i].getLabelText() === label) {
          return nodeList[i];
        }
      }
      return addNode(label);
    }

    return {
      setOption,
      setOutputCRLF,
      addNode,
      findOrAddNode,
      addConnection,
      generateDot,
    }
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = digraph;
  else
    window.digraph = digraph;
})();
