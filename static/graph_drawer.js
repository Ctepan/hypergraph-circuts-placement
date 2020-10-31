
(function() {
    const canvas = document.getElementById('c1');
    const ctx = canvas.getContext('2d');
    const [CTX_HEIGHT, CTX_WIDTH] = [500, 500];

    let drag = false;
    let dragStart;
    let dragEnd;
    let scale = 1;
    let originx = 0;
    let originy = 0;

    function clear() {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }

    function fullClear() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        scale = 1;
        originx = 0;
        originy = 0;
        graph.destroy();
    }

    function resetTransform() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw();
        scale = 1;
        originx = 0;
        originy = 0;
    }

    class Vertex {
        constructor(name, x, y, part) {
            this.name = name;
            this.x = x;
            this.y = y;
            this.part = part;
        }
        setCoords(x, y) {
            this.x = x;
            this.y = y;
        }
    }
    class Edge {
        constructor(a, b, value, highlighted=false) {
            this.a = a;
            this.b = b;
            this.value = value;
            this.highlighted = highlighted;
        }

        setHighlightedOn() {
            this.highlighted = true;
        }

        setHighlightedOff() {
            this.highlighted = false;
        }
    }
    const graph = {
        drawn: false,
        double: false,
        canvas: canvas,
        ctx: ctx,
        edges: new Map(),
        vertices: [],
        connections: new Map(),
        draw: function(pairs, double=false) {
            this.edges = new Map();
            this.double = double;
            this.vertices = [];
            this.connections = new Map();
            this.processPairs(pairs);
            this.takeCoordsToVerticies();
            this.drawEdges();
            this.drawn = true;
        },
        update: function() {
            this.drawEdges();
        },
        destroy: function() {
            this.edges = new Map();
            this.vertices = [];
            this.connections = new Map();
            this.drawn = false;
        },
        drawEdge: function(edge) {
            if (edge.highlighted) {
                this.ctx.strokeStyle = 'red';
            }

            this.ctx.beginPath();
            ctx.lineWidth = 1 / scale;
            this.ctx.moveTo(edge.a.x, edge.a.y);
            this.ctx.lineTo(edge.b.x, edge.b.y);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.strokeStyle = 'black';
        },
        drawVertex: function(vertex) {
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, 1 / scale, 0, 2 * Math.PI);
            ctx.fill();
            ctx.font = `${11}px sans-serif'`;
            ctx.fillText(vertex.name, vertex.x, vertex.y);
        },
        drawEdges: function() {
            this.edges.forEach(x => {
                this.drawEdge(x);
                this.drawVertex(x.a);
                this.drawVertex(x.b);
            });
        },
        processPairs: function(pairList) {
            const vSet = new Set();
            const eList = new Map();
            const partMap = new Map();

            for (let i of pairList) {
                vSet.add(i[0]);
                vSet.add(i[1]);

                if (this.double) {
                    partMap.set(i[0], 0);
                    partMap.set(i[1], 1);
                }
            }
            
            let vMap = new Map();

            for (let i of [...vSet.values()]) {
                const vObj = new Vertex(i, 0, 0, partMap.get(i));
                vMap.set(i, vObj);
                this.connections.set(vObj, []);
            }

            for (let i of pairList) {
                const vObj1 = vMap.get(i[0]);
                const vObj2 = vMap.get(i[1]);
                this.connections.get(vObj1).push(vObj2);
                this.connections.get(vObj2).push(vObj1);
                eList.set(i, new Edge(vObj1, vObj2, i[2], i[3]));
            }
            
            this.vertices = [...this.connections.keys()];
            this.edges = eList;
        },
        takeCoordsToVerticies: function() {
            if (this.double) {
                const firstPartLength = this.vertices.reduce((acc, el) => el.part === 0 ? acc + 1 : acc, 0);
                const secondPartLength = this.vertices.length - firstPartLength;
                let firstCounter = 0;
                let secondCounter = 0;

                for (const v in this.vertices) {
                    const number = this.vertices[v].part === 0 ? firstCounter++ : secondCounter++;
                    const length = (this.vertices[v].part === 0 ? firstPartLength : secondPartLength);

                    this.vertices[v].setCoords(
                        CTX_WIDTH * (0.25 + 0.5 * this.vertices[v].part),
                        (CTX_HEIGHT / length) * 0.5 * (2 * number + 1)
                    );
                }
            } else {
                const pi = Math.PI;
    
                for (const v in this.vertices) {
                    this.vertices[v].setCoords(
                        CTX_WIDTH / 2 + 50 * Math.cos(2 * pi * v / this.vertices.length), 
                        CTX_HEIGHT / 2 + 50 * Math.sin(2 * pi * v / this.vertices.length)
                    );
                }
            }
        }
    }

    let inputGraph = [[0, 1, 1], [0, 2, 1], [0, 3, 1], [3, 4, 1], [4, 5, 1], [2, 5, 100]];
    let grSize = 6;

    document.getElementById('files').addEventListener('change', function (evt) {
        const files = evt.target.files;
        const output = [];

        for (let i = 0, f; f = files[i]; i++) {
            const reader = new FileReader();

            reader.addEventListener("loadend", function(e) {
                inputGraph = JSON.parse(e.target.result);
                clear();
                graph.destroy();
                graph.draw(inputGraph);
            });

            reader.readAsText(f);
        }
    }, false);

    document.querySelector('[data-role="resetTransform"]').addEventListener('click', resetTransform);
    document.querySelector('[data-role="fullClear"]').addEventListener('click', fullClear);

    const srcondPartChecker = document.querySelector('[data-role="hasSecond"]');
    let checkSecond = srcondPartChecker.value === 'on';
    srcondPartChecker.addEventListener('change', function(event) {
        checkSecond = event.target.value === 'on';
        document.querySelector('[data-role="grSize2"]').disabled = !checkSecond;
    });

    document.querySelector('[data-role="genGr"]').addEventListener('click', function() {
        if (checkSecond) return;

        const n = parseInt(document.querySelector('[data-role="grSize1"]').value);
        const p = parseFloat(document.querySelector('[data-role="edgeProb"]').value);

        if (n < 2) return;

        function generateGraph (n, p) {
            let res = [];

            for (let i = 0; i < n; i++) {
                for (let j = i + 1; j < n; j++) {
                    if (p >= Math.random()) {
                        res.push([i, j, 1 + ~~(Math.random() * 10)]);
                    }
                }
            }

            return res;
        }

        function checkGraphSize (edges, n) {
            let verts = new Set();

            for (let e of edges) {
                verts.add(e[0]);
                verts.add(e[1]);
            }

            return [...verts].length === n;
        }

        let edges = generateGraph(n, p);

        while (!checkGraphSize(edges, n)) {
            edges = generateGraph(n, p);
        }

        inputGraph = edges;
        grSize = n;
        clear();
        graph.destroy();
        graph.draw(inputGraph, false);
    });

    document.querySelector('[data-role="genGr"]').addEventListener('click', function() {
        if (!checkSecond) return;
        
        const n1 = parseInt(document.querySelector('[data-role="grSize1"]').value);
        const n2 = parseInt(document.querySelector('[data-role="grSize2"]').value);
        const p = parseFloat(document.querySelector('[data-role="edgeProb"]').value);

        if (n1 < 1) return;
        if (n2 < 1) return;

        function generateConnectedGraph (n1, n2, p) {
            let res = [];

            for (let i = 0; i < n1; i++) {
                let edges = 0;

                while (edges === 0) {
                    edges = 0;
    
                    for (let j = n1; j < n1 + n2; j++) {
                        if (p >= Math.random()) {
                            edges++;
                            res.push([i, j, 1 + ~~(Math.random() * 10)]);
                        }
                    }
                }
            }

            return res;
        }

        let edges = generateConnectedGraph(n1, n2, p);
        inputGraph = edges;
        grSize = n1 + n2;
        clear();
        graph.destroy();
        graph.draw(inputGraph, true);
    });

    function draw() {
        graph.update();
    }

    canvas.addEventListener('mousedown', function(event) {
        dragStart = {
            x: event.pageX - canvas.offsetLeft,
            y: event.pageY - canvas.offsetTop
        }

        drag = true;
    });

    canvas.addEventListener('mouseup', function(event) {
        drag = false;
    });

    canvas.addEventListener('mousemove', function(event) {
        if (drag) {
            dragEnd = {
                x: event.pageX - canvas.offsetLeft,
                y: event.pageY - canvas.offsetTop
            }

            // ctx.translate(dragEnd.x - dragStart.x, dragEnd.y - dragStart.y);
            ctx.translate(
                ( dragEnd.x / scale - dragStart.x / scale ),
                ( dragEnd.y / scale - dragStart.y / scale )
            );
            dragStart = dragEnd;
            clear();
            draw();
        }

    });

    canvas.addEventListener('wheel', function(event) {
        event.preventDefault();

        let mousex = event.clientX - canvas.offsetLeft;
        let mousey = event.clientY - canvas.offsetTop;
        let wheel = event.deltaY / 20;

        let zoom = 1 + wheel / 2;

        ctx.translate(
            originx,
            originy
        );

        ctx.scale(zoom, zoom);
        ctx.translate(
            -( mousex / scale + originx - mousex / ( scale * zoom )),
            -( mousey / scale + originy - mousey / ( scale * zoom ))
        );

        originx = ( mousex / scale + originx - mousex / ( scale * zoom ));
        originy = ( mousey / scale + originy - mousey / ( scale * zoom ));
        scale *= zoom;

        clear();
        draw();
    });
})();