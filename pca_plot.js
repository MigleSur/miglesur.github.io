function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function plot_pca(plotted_pca) {

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
    });
    return true;
}


function init_plot1() {
    var plotted_pca = false;
    plot_pca(plotted_pca);
}


function draw_hand(k, hands, g, x, y, slow) {

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

    if(slow) {
        g.select('path').transition().duration(500)
            .attr('d', line(final))
    } else {
        g.select('path').transition().duration(100).
        attr('d', line(final))
    }

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

    if(document.querySelector("#slider > svg")) {
        var svg2 = d3.select("#slider").select("svg")
    } else {
        var svg2 = d3.select('#slider').append("svg").attr("width", 760).attr("height", 50),
            margin_slider = {top: 120, right: 100, bottom: 0, left: 100},
            width_slider = +svg2.attr("width") - margin_slider.left - margin_slider.right
    }

    var xslider = d3.scaleLinear()
        .range([30,width_slider])
        .clamp(true);

    var slider = svg2.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + margin.left + "," + margin.height + ")");

    slider.append("line")
        .attr("class", "track")
        .attr("x1", xslider.range()[0])
        .attr("x2", xslider.range()[1])
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay");


    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
        .selectAll("text")
        .data(x.ticks(10))
        .enter().append("text")
        .attr("x", xslider)
        .attr("text-anchor", "middle")
        .text(function(d) { return d; });

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9)
        .attr("cx", 30);

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
            d3.csv("hands_pca.csv", function (error, pca_data) {
                if (error) throw error;
                var PCX = "PC"+pad(document.getElementById("PCX").value, 3);
                var PCY = "PC"+pad(document.getElementById("PCY").value, 3);
                pca_data.forEach(function (d) {
                        d[PCX] = +d[PCX];
                        d[PCY] = +d[PCY];
                        });

                var pc_values = [];
                for(i=0; i<40; i++) {
                    pc_values.push(pca_data[i][PCX])
                }


                var pc_values_with_index = [];
                for (var i in pc_values) {
                    pc_values_with_index.push([pc_values[i], i]);
                }

                pc_values_with_index.sort(function(left, right) {
                    return left[0] < right[0] ? -1 : 1;
                });

                indices = [];
                for (i=0; i < pc_values_with_index.length; i++){
                    indices.push(pc_values_with_index[i][1]);
                }

                // var hands_id = Array.apply(null, {length: 40}).map(Number.call, Number)

                // indices2 = []
                // for(i=0; i < indices.length; i++) {
                //     var j = +indices[i]
                //     indices2.push(hands_id[j])
                // }

            function hue(h) {
                handle.attr("cx", xslider(h));
                var k = indices[Math.floor(xslider(h) / width_slider * 39)].toString();
                draw_hand(k, hands, g, x, y, false);
                d3.select("#plot1").selectAll("circle").classed("highlight", false);
                d3.select("#plot1").selectAll("circle").filter(function(d, i) {return i == +k}).classed("highlight", true);
            };

            slider.call(d3.drag()
                .on("start.interrupt", function () {
                    slider.interrupt();
                })
                .on("start drag", function () {
                    hue(xslider.invert(d3.event.x));
                })
            );


            if (!document.querySelector(".hand")) {
                g = svg.append("g");

                g.append('path')
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .attr("class", "hand");

                draw_hand("0", hands, g, x, y, false);
            }


            d3.select("#plot1")
                .selectAll("circle")
                .on('click', function (d, i) {
                    k = i.toString();
                    draw_hand(k, hands, g, x, y, true);
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
});
};
