function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function plot_pca(plotted_pca) {
    console.log(plotted_pca)

    if(plotted_pca) {
        d3.select("#plot1").selectAll("*").remove()
    }

    var svg = d3.select("#plot1"),
        margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // Create scales
    var x = d3.scaleLinear()
        .range([20,width]);

    var y = d3.scaleLinear()
        .range([height-20,0]);


    var PCX = "PC"+pad(document.getElementById("PCX").value, 3);
    var PCX_text = "PC"+pad(document.getElementById("PCX").value, 1);
    var PCY = "PC"+pad(document.getElementById("PCY").value, 3);
    var PCY_text = "PC"+pad(document.getElementById("PCY").value, 1);


    d3.csv("hands_pca.csv", function (error, data) {
        if (error) throw error;

        data.forEach(function (d) {
            d[PCX] = +d[PCX];
            d[PCY] = +d[PCY];

        });

        x.domain(d3.extent(data, function (d) {
            return d[PCX];
        }));
        y.domain(d3.extent(data, function (d) {
            return d[PCY];
        }));

        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .append("text")
            .attr("fill", "#000")
            .attr("y", -4)
            .attr("x", 580)
            .attr("text-anchor", "end")
            .text(PCX_text)
        ;

        // Y axis
        g.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 12)
            .attr("text-anchor", "end")
            .text(PCY_text);

        // For reference, add points as well
        g.selectAll('dot')
            .data(data)
            .enter().append("circle")
            .attr('cx', function (d) {
                return x(d[PCX]);
            })
            .attr('cy', function (d) {
                return y(d[PCY]);
            })
            .attr('r', 5)
            .attr('fill', 'black')
            .attr("class", "dot")
            .attr("id", function (d, i) {
                return i;
            })

            .append("svg:title")
            .text(function (d, i) {
                i = +i;
                return "Hand: " + (i + 1);
            })
    })
    return true;
}


function init_plot1() {
    var plotted_pca = false;
    plot_pca(plotted_pca);
}

function draw_hand(k, hands, g, x, y) {

    console.log("Started drawing " + k + "th hand");

    var hand = hands.get(k);
    var xval = d3.map(hand).values().slice(0, 56);
    var yval = d3.map(hand).values().slice(56, 112);

    var final = d3.zip(xval, yval);

    var line = d3.line()
        .x(function (d) {
            return x(d[0]);
        })
        .y(function (d) {
            return y(d[1]);
        })
        .curve(d3.curveCatmullRom);

    console.log(final);
    g.select('path').transition().duration(500)
        .attr('d', line(final))

}


function init_plot2(){



    var svg = d3.select('#plot2'),
        margin = {top: 80, right: 10, bottom: 60, left: 10},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .range([0,width]);

    var y = d3.scaleLinear()
        .range([height,0]);




    d3.csv("hands.csv",
        function(d) {
        var i;
        for (i=1; i<=56; i++) {
            d["X"+pad(i, 2)] = +d["X"+pad(i, 2)];
            d["Y"+pad(i, 2)] = +d["Y"+pad(i, 2)];
        }
        return d},

        function(error, data) {
            if (error) throw error;

            var hands = d3.map(data);


            if(!document.querySelector(".hand")) {
                console.log("Solo me ejecuto al principio");
                g = svg.append("g");

                g.append('path')
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .attr("class", "hand");

                draw_hand("0", hands, g,x, y);
            }


            d3.select("#plot1")
                .selectAll("circle")
                .on('click', function (d, i) {
                    k = i.toString();
                    console.log("Drawing " + i + "th hand");
                    draw_hand(k, hands, g, x, y);
                })
                .on('mouseover', function (d, i) {
                    document.querySelectorAll(".dot")[i].setAttribute("r", 10);
                })
                .on('mousemove', function (d, i) {
                    document.querySelectorAll(".dot")[i].setAttribute("r", 10);
                })

                .on('mouseout', function (d, i) {
                    document.querySelectorAll(".dot")[i].setAttribute("r", 5);
                });


        });
}
