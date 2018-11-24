# digraph
Pure JS lib to generate dot files for programmatically-generated directed graphs.

## About
Digraphs are short for directed graphs - methods for representing data in terms of nodes (or vertices) and how they're connected, via edges.

## Language

This library works in the browser, or as a NodeJS module, without change.

## Example
```
 var di = new digraph();

 var n1 = di.addNode('One');
 var n2 = di.addNode('Two');
 var n3 = di.addNode('Three');

 di.addConnection(n1, n2);
 di.addConnection(n1, n3);

 di.setOption('rankdir', 'LR');

 console.log(di.generateDot());
```

Which generates a dot file,

```
digraph G {
  "_1" [label="One" ];
  "_2" [label="Two" ];
  "_3" [label="Three" ];
  "_1" -> "_2";
  "_1" -> "_3";
}
```

See https://marquisdegeek.com/code_digraphs for the graphical output, and some surprise uses!
