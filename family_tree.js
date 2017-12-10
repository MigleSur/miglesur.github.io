d3.select(window).on('load', init);

function init() {
    var treeData = [
        {
            "name": "Donald Trump",
            "children": [
                {
                    "name": "Ivana Trump",
                    "children": [
                        {
                            "name": "Donald Trump Jr.",
                            "children": [
                                {
                                    "name": "Kai Madison"
                                },
                                {
                                    "name": "Donald III"
                                },
                                {
                                    "name": "Chloe Sophia"
                                },
                                {
                                    "name": "Tristan Milos"
                                },
                                {
                                    "name": "Spencer Frederick"
                                }
                            ]

                        },
                        {
                            "name": "Eric Trump"
                        },
                        {
                            "name": "Ivanka Trump",
                            "children":[
                                {
                                    "name": "Arabella Rose"
                                },
                                {
                                    "name": "Joseph Frederick"
                                },
                                {
                                    "name": "Theodore James"
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "Marla Trump",
                    "children": [
                        {
                            "name": "Tiffany Trump"
                        }
                    ]
                },
                {
                    "name": "Melanie Trump",
                    "children": [
                        {
                            "name": "Baron Trump"
                        }
                    ]
                }
            ]
        }
    ];

    var margin = {top: 20, right: 120, bottom: 20, left: 120},
        width = 960 - margin.right - margin.left,
        height = 500 - margin.top - margin.bottom;

    var i = 0;

    var tree = d3.layout.tree()
        .size([height, width]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });

    var svg = d3.select("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "trump_tree")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    root = treeData[0];

    update(root);


    svg.append("circle")
        .attr("r", 5)
        .attr("cx", -90)
        .attr("cy", 40)
        .attr("stroke", "#740909")
        .attr("fill", "#fff")
        .attr("stroke-width", 2);

    svg.append("circle")
        .attr("r", 5)
        .attr("cx", -90)
        .attr("cy", 60)
        .attr("stroke", "#1A25BA")
        .attr("fill", "#fff")
        .attr("stroke-width", 2);

    svg.append("circle")
        .attr("r", 5)
        .attr("cx", -90)
        .attr("cy", 80)
        .attr("stroke", "#c62526")
        .attr("fill", "#fff")
        .attr("stroke-width", 2);

    svg.append("circle")
        .attr("r", 5)
        .attr("cx", -90)
        .attr("cy", 100)
        .attr("stroke", "#ff6969")
        .attr("fill", "#fff")
        .attr("stroke-width", 2);

    svg.append("text")
        .attr("x", -80)
        .attr("y", 44)
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .text("Donald Trump");

    svg.append("text")
        .attr("x", -80)
        .attr("y", 64)
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .text("Donald Trump's wifes");

    svg.append("text")
        .attr("x", -80)
        .attr("y", 84)
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .text("Donald Trump's children");

    svg.append("text")
        .attr("x", -80)
        .attr("y", 104)
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .text("Donald Trump's grandchildren");


    function update(source) {

        var colors = ["#740909", "#1A25BA", "#c62526", "#ff6969"];
        // var edge_colors = Array(12).fill("blue").concat(Array(2).fill("red").concat(Array(2).fill("green")));
        var edge_styles = Array(12).fill("20").concat(Array(2).fill("10").concat(Array(2).fill("5")));


        // Compute the new tree layout.
        var nodes = tree.nodes(root),
            links = tree.links(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function(d) { d.y = d.depth * 180; });
        nodes.forEach(function(d) { d.color = colors[d.depth];});

        // Declare the nodes
        var node = svg.selectAll("g.node")
            .data(nodes, function(d) { return d.id || (d.id = ++i); });

        // Enter the nodes.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")"; });

        nodeEnter.append("circle")
            .attr("r", 10)
            .attr("stroke", function(d) {return d.color})
            .attr("fill", "#fff")
            .attr("stroke-width", 3);

        nodeEnter.append("text")
            .attr("x", function(d) {
                return d.children || d._children ? -13 : 13; })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start"; })
            .text(function(d) { return d.name; });


        links.forEach(function(d) {
            // d.edge_color = edge_colors[d.target.id - 2];
            d.edge_style = edge_styles[d.target.id - 2];
        });

        // Declare the links
        var link = svg.selectAll("path.link")
            .data(links,
                function(d) {return d.target.id; });


        // Enter the links.
        link.enter().insert("path", "g")
            .attr("class", "link")
            // .attr("stroke", function(d) {
            //     return d.edge_color;
            // })
            .attr("stroke-dasharray", function(d) {
                return d.edge_style;
            })
            .attr("color", function(d) {return d.edge_color})
            .attr("d", diagonal);

    }

}

