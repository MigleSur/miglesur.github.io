columnlist =[]
colorlist=[]
annlist=[]

function bar_plot(column_list, annotation_list, color_list, plotted_barplot) {

    if(plotted_barplot) {
        d3.select("#barplot").selectAll("*").remove()

    }

    var barpl = d3.select("#barplot")
    var margin = {top: 100, right: 50, bottom: 100, left: 70};
    var width = +barpl.node().getBoundingClientRect().width - margin.left - margin.right;
    var height = +barpl.node().getBoundingClientRect().height - margin.top - margin.bottom;


    var g = barpl.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand().range([0, width]).padding(0.05),
        y = d3.scaleLinear().range([height, 0]);

    var item;

    d3.tsv("data_discrimination.tsv", function(da) {
        da.widespread = +da.widespread;
        da.rare = +da.rare;
        da.nonexistent = +da.nonexistent;
        da.dk = +da.dk;
        return da;
    }, function(error, data){
        if (error) throw error;

        x.domain(data.map(function(da) { return da.discrimination; }));

        y.domain([0, d3.max(data, function(da) { return da.widespread; })]);

        g.append("g")
            .attr("class", "axis x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-25)")
                .attr("font-size", "16px");

        g.append("g")
            .attr("class", "axis y")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("x", 0)
            .attr("y", -4)
            .text("%");

        // g.selectAll(".bar")
        //     .data(data)
        //     .enter().append("rect")
        //     .attr("x", function(da) { return x(da.discrimination); })
        //     .attr("y", function(da) { return y(da.widespread); })
        //     .attr("fill", "#ffaf59")
        //     .attr("width", width/34)
        //     .attr("height", function(da) { return height - y(da.widespread);})
        //     .append("title")
        //     .text(function(da){ return da.widespread + "%"});
        //     // .text(function(da,i){ console.log(da)});
        //
        // g.selectAll(".bar")
        //     .data(data)
        //     .enter().append("rect")
        //     .attr("x", function(da) { return x(da.discrimination); })
        //     .attr("y", function(da) { return y(da.rare); })
        //     .attr("fill", "#4a99fb")
        //     .attr("width", width/34)
        //     .attr("transform", "translate("+width/34+")")
        //     .attr("height", function(da) { return height - y(da.rare);})
        //     .append("title")
        //     .text(function(da){ return da.rare + "%"});
        //
        // g.selectAll(".bar")
        //     .data(data)
        //     .enter().append("rect")
        //     .attr("x", function(da) { return x(da.discrimination); })
        //     .attr("y", function(da) { return y(da.nonexistent); })
        //     .attr("fill", "#f4214d")
        //     .attr("width", width/34)
        //     .attr("transform", "translate("+width*2/34+")")
        //     .attr("height", function(da) { return height - y(da.nonexistent);})
        //     .append("title")
        //     .text(function(da){ return da.nonexistent + "%"});
        // g.selectAll(".bar")
        //     .data(data)
        //     .enter().append("rect")
        //     .attr("x", function(da) { return x(da.discrimination); })
        //     .attr("y", function(da) { return y(da.dk); })
        //     .attr("fill", "#1935f4")
        //     .attr("width", width/34)
        //     .attr("transform", "translate("+width*3/34+")")
        //     .attr("height", function(da) { return height - y(da.dk);})
        //     .append("title")
        //     .text(function(da){ return da.dk + "%"});
        for (item in column_list) {
            g.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("x", function (da) {
                    return x(da.discrimination);
                })
                .attr("y", function (da) {
                    return y(da[column_list[item]]);
                })
                .attr("fill", color_list[item])
                .attr("width", width / (8.5*column_list.length))
                .attr("transform", "translate(" + width * item / (8.5*column_list.length) + ")")
                .attr("height", function (da) {return height - y(da[column_list[item]]);})
                .append("svg:title")
                .text(function (da) {
                    return da[column_list[item]] + "%"
                })

        };

        for (item in column_list) {
            g.append("text")
                .attr("x", 65)
                .attr("y", -80 + (15) * item)
                .attr("text-anchor", "start")
                .style("font-size", "14px")
                .text(annotation_list[item]);

            // g.append("text")
            //     .attr("x", 65)
            //     .attr("y", -65)
            //     .attr("text-anchor", "start")
            //     .style("font-size", "12px")
            //     .text("Rare");
            //
            // g.append("text")
            //     .attr("x", 65)
            //     .attr("y", -50)
            //     .attr("text-anchor", "start")
            //     .style("font-size", "12px")
            //     .text("Non-existent");
            //
            // g.append("text")
            //     .attr("x", 65)
            //     .attr("y", -35)
            //     .attr("text-anchor", "start")
            //     .style("font-size", "12px")
            //     .text("Don't know");

            g.append("rect")
                .attr("rx", 3)
                .attr("ry", 3)
                .attr("x", 47)
                .attr("y", -91 + (15) * item)
                .attr("width", 12)
                .attr("height", 12)
                .attr("fill", color_list[item])

            // g.append("rect")
            //     .attr("rx", 3)
            //     .attr("ry", 3)
            //     .attr("x", 47)
            //     .attr("y", -75)
            //     .attr("width", 12)
            //     .attr("height", 12)
            //     .attr("fill", "#4a99fb");
            //
            // g.append("rect")
            //     .attr("rx", 3)
            //     .attr("ry", 3)
            //     .attr("x", 47)
            //     .attr("y", -60)
            //     .attr("width", 12)
            //     .attr("height", 12)
            //     .attr("fill", "#f4214d");
            //
            // g.append("rect")
            //     .attr("rx", 3)
            //     .attr("ry", 3)
            //     .attr("x", 47)
            //     .attr("y", -45)
            //     .attr("width", 12)
            //     .attr("height", 12)
            //     .attr("fill", "#1935f4");
        }
    });


}


function add_column_list(value){
    if (columnlist.length >3)
    {
        columnlist=columnlist.slice(1,4)
    }
    columnlist.push(value)
    return columnlist
}

function add_ann_list(value){
    if (annlist.length>3){
        annlist=annlist.slice(1,4)
    }
    annlist.push(value)
    return annlist
}

function add_color_list(value){
    if (colorlist>3){
        colorlist=colorlist.slice(1,4)
    }
    colorlist.push(value)
    return colorlist
}

function remove_all(){
    colorlist =[]
    annlist = []
    columnlist=[]
}


var json_file = [
    [
        {
            "Country": "EU28", "value": 66.2
        },
        {
            "Country": "DK", "value": 76.8
        },
        {
            "Country": "FI", "value": 73
        },
        {
            "Country": "SE", "value": 82.6
        },

        {
            "Country": "BE", "value": 70.5
        },
        {
            "Country": "FR", "value": 72.6
        },
        {
            "Country": "NL", "value": 72.9
        },
        {
            "Country": "LU", "value": 69
        },
        {
            "Country": "GB", "value": 71.5
        },
        {
            "Country": "IE", "value": 69.5
        },

        {
            "Country": "ES", "value": 68.3
        },
        {
            "Country": "PT", "value": 56
        },

        {
            "Country": "DE", "value": 65.5
        },
        {
            "Country": "AT", "value": 63.3
        },
        {
            "Country": "SI", "value": 68.4
        },
        {
            "Country": "SK", "value": 52.4
        },
        {
            "Country": "HU", "value": 50.8
        },
        {
            "Country": "CZ", "value": 53.6
        },
        {
            "Country": "PL", "value": 56.8
        },

        {
            "Country": "LV", "value": 57.9
        },
        {
            "Country": "LT", "value": 56.8
        },
        {
            "Country": "EE", "value": 56.7
        },

        {
            "Country": "HR", "value": 53.1
        },
        {
            "Country": "BG", "value": 58
        },
        {
            "Country": "RO", "value": 52.4
        },

        {
            "Country": "GR", "value": 50
        },
        {
            "Country": "IT", "value": 62.1
        },
        {
            "Country": "CY", "value": 55.1
        },
        {
            "Country": "MT", "value": 60.1
        }

    ]
]

function drawRadarCharts() {
    drawRadarChart('#radarchart', 400, 400);
};

function drawRadarChart(divId, w, h) {
    var circleSize = 5;
    var strokeWidthPolygon = "2px";

    var RadarChart = {
        draw: function(id, data, options) {
            var cfg = {
                radius: circleSize,
                w: w,
                h: h,
                factor: 1,
                factorLegend: .85,
                levels: 3,
                maxValue: 100,
                radians: 2 * Math.PI,
                opacityArea: 0.001,
                ToRight: 5,
                TranslateX: 80,
                TranslateY: 30,
                ExtraWidthX: 10,
                ExtraWidthY: 100,
                color: "#c6682d"
            };

            if ('undefined' !== typeof options) {
                for (var i in options) {
                    if ('undefined' !== typeof options[i]) {
                        cfg[i] = options[i];
                    }
                }
            }

            cfg.maxValue = 100;

            var allAxis = (data[0].map(function(i, j) {
                return i.Country;
            }));
            var total = allAxis.length;
            var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);

            var svg = d3.select(id).select('svg'),
                polyPoints = null;
            if (svg.node()){
                polyPoints = svg.select("polygon").attr("points");
                svg.remove();
            }

            var g = d3.select(id)
                .append("svg")
                .attr("width", cfg.w + cfg.ExtraWidthX)
                .attr("height", cfg.h + cfg.ExtraWidthY)
                .attr("class", "graph-svg-component")
                .append("g")
                .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

            var tooltip;

            // Circular segments
            for (var j = 0; j < cfg.levels; j++) {
                var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
                g.selectAll(".levels")
                    .data(allAxis)
                    .enter()
                    .append("svg:line")
                    .attr("x1", function(d, i) {
                        return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
                    })
                    .attr("y1", function(d, i) {
                        return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
                    })
                    .attr("x2", function(d, i) {
                        return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total));
                    })
                    .attr("y2", function(d, i) {
                        return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total));
                    })
                    .attr("class", "line")

                    .style("stroke", "grey")
                    .style("stroke-opacity", "0.75")
                    .style("stroke-width", "0.5px")
                    .attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
            }

            // Text indicating at what % each level is
            for (var j = 0; j < cfg.levels; j++) {
                var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
                g.selectAll(".levels")
                    .data([1]) //dummy data
                    .enter()
                    .append("svg:text")
                    .attr("x", function(d) {
                        return levelFactor * (1 - cfg.factor * Math.sin(0));
                    })
                    .attr("y", function(d) {
                        return levelFactor * (1 - cfg.factor * Math.cos(0));
                    })
                    .attr("class", "legend")
                    .style("font-family", "sans-serif")
                    .style("font-size", "10px")
                    .attr("transform", "translate(" + (cfg.w / 2 - levelFactor + cfg.ToRight) + ", " + (cfg.h / 2 - levelFactor) + ")")
                    .attr("fill", "#737373")
                    .text((j + 1) * 100 / cfg.levels);
            }

            series = 0;

            var axis = g.selectAll(".axis")
                .data(allAxis)
                .enter()
                .append("g")
                .attr("class", "axis");

            axis.append("line")
                .attr("x1", cfg.w/2)
                .attr("y1", cfg.h/2)
                .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
                .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
                .attr("class", "line")
                .style("stroke", "grey")
                .style("stroke-width", "1px");

            axis.append("text")
                .attr("class", "legend")
                .text(function(d){return d})
                .style("font-family", "sans-serif")
                .style("font-size", "11px")
                .attr("text-anchor", "middle")
                .attr("dy", "1em")
                .attr("transform", function(){return "translate(0, -10)"})
                .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
                .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});

            data.forEach(function(y) {
                dataValues = [];
                g.selectAll(".nodes")
                    .data(y, function(j, i) {
                        dataValues.push([
                            cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                            cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                        ]);
                    });
                dataValues.push(dataValues[0]);
                g.selectAll(".area")
                    .data([dataValues])
                    .enter()
                    .append("polygon")
                    .attr("points", function(d){
                        if (polyPoints)
                            return polyPoints;
                        else
                            return d3.range(d.length).map(function(){
                                return (cfg.w / 2) + "," + (cfg.h / 2)
                            }).join(" ");
                    })
                    .attr("class", "radar-chart-series_" + series)
                    .style("stroke-width", strokeWidthPolygon)
                    .style("stroke", cfg.color)
                    .style("fill-opacity", cfg.opacityArea)
                    .transition()
                    .duration(2000)
                    .attr("points", function(d) {
                        var str = "";
                        for (var pti = 0; pti < d.length; pti++) {
                            str = str + d[pti][0] + "," + d[pti][1] + " ";
                        }
                        return str;
                    })
                    .style("fill", "none")

                series++;
            });

            series = 0;

            data.forEach(function(y) {
                var c = g.selectAll(".nodes")
                    .data(y).enter()
                    .append("svg:circle")
                    .attr("class", "radar-chart-series_" + series)
                    .attr('r', cfg.radius)
                    .attr("alt", function(j) {
                        return Math.max(j.value, 0);
                    })
                    .attr("cx", function(j, i) {
                        dataValues.push([
                            cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                            cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                        ]);
                        return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
                    })
                    .attr("cy", function(j, i) {
                        return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
                    })
                    .attr("data-id", function(j) {
                        return j.axis;
                    })
                    .style("fill", cfg.color)
                    .style("fill-opacity", 0)
                    .on('mouseover', function(d) {
                        newX = parseFloat(d3.select(this).attr('cx')) - 10;
                        newY = parseFloat(d3.select(this).attr('cy')) - 5;

                        tooltip.attr('x', newX)
                            .attr('y', newY)
                            .style("display", "inline-block")
                            .html((d.Country) + "  " + (d.value))
                            .transition(100)
                            .style('opacity', 1);



                        z = "polygon." + d3.select(this).attr("class");
                        g.selectAll("polygon")
                            .transition(200)
                            .style("fill-opacity", 0.1);
                        g.selectAll(z)
                            .transition(200)
                            .style("fill-opacity", 0.7);
                    })
                    .on('mouseout', function() {
                        tooltip.transition(200)
                            .style('opacity', 0);
                        g.selectAll("polygon")
                            .transition(200)
                            .style("fill-opacity", cfg.opacityArea);
                    });

                c.transition()
                    .delay(1750)
                    .duration(100)
                    .style("fill-opacity", 0.9);




                series++;
            });

            //Tooltip
            tooltip = g.append('text')
                .style('opacity', 0)
                .style('font-family', 'sans-serif')
                .style('font-size', "13px");
        }
    };

    // Options for the Radar chart, other than default
    var myOptions = {
        w: w,
        h: h,
        ExtraWidthX: 180,
        labelScale: 0.7,
        levels: 5,
        levelScale: 0.85,
        facetPaddingScale: 1.9,
        maxValue: 0.6,
        showAxes: true,
        showAxesLabels: true,
        showLegend: true,
        showLevels: true,
        showLevelsLabels: false,
        showPolygons: true,
        showVertices: true
    };

    RadarChart.draw(divId, json_file, myOptions);
};

function updateOverall() {
    json_file = [
        [
            {
                "Country": "EU28", "value": 66.2
            },
            {
                "Country": "DK", "value": 76.8
            },
            {
                "Country": "FI", "value": 73
            },
            {
                "Country": "SE", "value": 82.6
            },

            {
                "Country": "BE", "value": 70.5
            },
            {
                "Country": "FR", "value": 72.6
            },
            {
                "Country": "NL", "value": 72.9
            },
            {
                "Country": "LU", "value": 69
            },
            {
                "Country": "GB", "value": 71.5
            },
            {
                "Country": "IE", "value": 69.5
            },

            {
                "Country": "ES", "value": 68.3
            },
            {
                "Country": "PT", "value": 56
            },

            {
                "Country": "DE", "value": 65.5
            },
            {
                "Country": "AT", "value": 63.3
            },
            {
                "Country": "SI", "value": 68.4
            },
            {
                "Country": "SK", "value": 52.4
            },
            {
                "Country": "HU", "value": 50.8
            },
            {
                "Country": "CZ", "value": 53.6
            },
            {
                "Country": "PL", "value": 56.8
            },

            {
                "Country": "LV", "value": 57.9
            },
            {
                "Country": "LT", "value": 56.8
            },
            {
                "Country": "EE", "value": 56.7
            },

            {
                "Country": "HR", "value": 53.1
            },
            {
                "Country": "BG", "value": 58
            },
            {
                "Country": "RO", "value": 52.4
            },

            {
                "Country": "GR", "value": 50
            },
            {
                "Country": "IT", "value": 62.1
            },
            {
                "Country": "CY", "value": 55.1
            },
            {
                "Country": "MT", "value": 60.1
            }

        ]
    ];
    drawRadarChart('#radarchart', 400, 400);
};

function updateMoney() {
    json_file = [
        [
            {
                "Country": "EU28", "value": 79.6
            },
            {
                "Country": "DK", "value": 86.6
            },
            {
                "Country": "FI", "value": 86.4
            },
            {
                "Country": "SE", "value": 87.5
            },

            {
                "Country": "BE", "value": 87.5
            },
            {
                "Country": "FR", "value": 86.1
            },
            {
                "Country": "NL", "value": 86.8
            },
            {
                "Country": "LU", "value": 94.4
            },
            {
                "Country": "GB", "value": 81.2
            },
            {
                "Country": "IE", "value": 84.7
            },

            {
                "Country": "ES", "value": 75.9
            },
            {
                "Country": "PT", "value": 70.9
            },

            {
                "Country": "DE", "value": 84.2
            },
            {
                "Country": "AT", "value": 85.9
            },
            {
                "Country": "SI", "value": 81.6
            },
            {
                "Country": "SK", "value": 74
            },
            {
                "Country": "HU", "value": 70.7
            },
            {
                "Country": "CZ", "value": 75.9
            },
            {
                "Country": "PL", "value": 73.3
            },

            {
                "Country": "LV", "value": 64.3
            },
            {
                "Country": "LT", "value": 65.6
            },
            {
                "Country": "EE", "value": 66.7
            },

            {
                "Country": "HR", "value": 69.9
            },
            {
                "Country": "BG", "value": 61.9
            },
            {
                "Country": "RO", "value": 59.4
            },

            {
                "Country": "GR", "value": 70.7
            },
            {
                "Country": "IT", "value": 78.6
            },
            {
                "Country": "CY", "value": 79.2
            },
            {
                "Country": "MT", "value": 82.4
            }

        ]
    ];
    drawRadarChart('#radarchart', 400, 400);
};

function updateWork() {
    json_file = [
        [
            {
                "Country": "EU28", "value": 71.5
            },
            {
                "Country": "DK", "value": 79.2
            },
            {
                "Country": "FI", "value": 74.7
            },
            {
                "Country": "SE", "value": 82.6
            },

            {
                "Country": "BE", "value": 73.8
            },
            {
                "Country": "FR", "value": 72.1
            },
            {
                "Country": "NL", "value": 76.7
            },
            {
                "Country": "LU", "value": 74
            },
            {
                "Country": "GB", "value": 76.6
            },
            {
                "Country": "IE", "value": 73.9
            },

            {
                "Country": "ES", "value": 72.4
            },
            {
                "Country": "PT", "value": 72
            },

            {
                "Country": "DE", "value": 71.4
            },
            {
                "Country": "AT", "value": 76.1
            },
            {
                "Country": "SI", "value": 71.8
            },
            {
                "Country": "SK", "value": 65.5
            },
            {
                "Country": "HU", "value": 67.2
            },
            {
                "Country": "CZ", "value": 66.1
            },
            {
                "Country": "PL", "value": 66.8
            },

            {
                "Country": "LV", "value": 73.6
            },
            {
                "Country": "LT", "value": 73.2
            },
            {
                "Country": "EE", "value": 72.1
            },

            {
                "Country": "HR", "value": 69.4
            },
            {
                "Country": "BG", "value": 68.6
            },
            {
                "Country": "RO", "value": 67.1
            },

            {
                "Country": "GR", "value": 64.2
            },
            {
                "Country": "IT", "value": 62.4
            },
            {
                "Country": "CY", "value": 70.7
            },
            {
                "Country": "MT", "value": 71
            }

        ]
    ];
    drawRadarChart('#radarchart', 400, 400);
};

function updateKnowledge() {
    json_file = [
        [
            {
                "Country": "EU28", "value": 63.4
            },
            {
                "Country": "DK", "value": 73.6
            },
            {
                "Country": "FI", "value": 61.3
            },
            {
                "Country": "SE", "value": 72.8
            },

            {
                "Country": "BE", "value": 71.1
            },
            {
                "Country": "FR", "value": 66.1
            },
            {
                "Country": "NL", "value": 67.3
            },
            {
                "Country": "LU", "value": 69.4
            },
            {
                "Country": "GB", "value": 71.8
            },
            {
                "Country": "IE", "value": 66.4
            },

            {
                "Country": "ES", "value": 65.3
            },
            {
                "Country": "PT", "value": 54.8
            },

            {
                "Country": "DE", "value": 52.9
            },
            {
                "Country": "AT", "value": 63.2
            },
            {
                "Country": "SI", "value": 55
            },
            {
                "Country": "SK", "value": 60
            },
            {
                "Country": "HU", "value": 56.9
            },
            {
                "Country": "CZ", "value": 57.3
            },
            {
                "Country": "PL", "value": 56
            },

            {
                "Country": "LV", "value": 48.9
            },
            {
                "Country": "LT", "value": 55.8
            },
            {
                "Country": "EE", "value": 53.2
            },

            {
                "Country": "HR", "value": 49.8
            },
            {
                "Country": "BG", "value": 53.3
            },
            {
                "Country": "RO", "value": 51.8
            },

            {
                "Country": "GR", "value": 55.6
            },
            {
                "Country": "IT", "value": 61.4
            },
            {
                "Country": "CY", "value": 58.5
            },
            {
                "Country": "MT", "value": 65.2
            }

        ]
    ];
    drawRadarChart('#radarchart', 400, 400);
};

function updateTime() {
    json_file = [
        [
            {
                "Country": "EU28", "value": 65.7
            },
            {
                "Country": "DK", "value": 83.1
            },
            {
                "Country": "FI", "value": 77.4
            },
            {
                "Country": "SE", "value": 90.1
            },

            {
                "Country": "BE", "value":  65.3
            },
            {
                "Country": "FR", "value": 67.3
            },
            {
                "Country": "NL", "value": 83.9
            },
            {
                "Country": "LU", "value": 69.1
            },
            {
                "Country": "GB", "value": 69.9
            },
            {
                "Country": "IE", "value": 74.2
            },

            {
                "Country": "ES", "value": 64.0
            },
            {
                "Country": "PT", "value": 47.5
            },

            {
                "Country": "DE", "value": 65
            },
            {
                "Country": "AT", "value": 61.2
            },
            {
                "Country": "SI", "value": 72.9
            },
            {
                "Country": "SK", "value": 46.3
            },
            {
                "Country": "HU", "value": 54.3
            },
            {
                "Country": "CZ", "value": 57.3
            },
            {
                "Country": "PL", "value": 52.5
            },

            {
                "Country": "LV", "value": 65.8
            },
            {
                "Country": "LT", "value": 50.6
            },
            {
                "Country": "EE", "value": 74.7
            },

            {
                "Country": "HR", "value": 51
            },
            {
                "Country": "BG", "value": 42.7
            },
            {
                "Country": "RO", "value": 50.3
            },

            {
                "Country": "GR", "value": 44.7
            },
            {
                "Country": "IT", "value": 59.3
            },
            {
                "Country": "CY", "value": 51.3
            },
            {
                "Country": "MT", "value": 64.2
            }

        ]
    ];
    drawRadarChart('#radarchart', 400, 400);
};

function updatePower() {
    json_file = [
        [
            {
                "Country": "EU28", "value": 48.5
            },
            {
                "Country": "DK", "value": 61.5
            },
            {
                "Country": "FI", "value": 65.3
            },
            {
                "Country": "SE", "value": 79.5
            },

            {
                "Country": "BE", "value": 53.4
            },
            {
                "Country": "FR", "value": 68.2
            },
            {
                "Country": "NL", "value": 52.9
            },
            {
                "Country": "LU", "value": 43.5
            },
            {
                "Country": "GB", "value": 53
            },
            {
                "Country": "IE", "value": 48.6
            },

            {
                "Country": "ES", "value": 57
            },
            {
                "Country": "PT", "value": 33.9
            },

            {
                "Country": "DE", "value": 53
            },
            {
                "Country": "AT", "value": 34.9
            },
            {
                "Country": "SI", "value": 60.6
            },
            {
                "Country": "SK", "value": 23.1
            },
            {
                "Country": "HU", "value": 18.7
            },
            {
                "Country": "CZ", "value": 22.6
            },
            {
                "Country": "PL", "value": 35.1
            },

            {
                "Country": "LV", "value": 39
            },
            {
                "Country": "LT", "value": 36.6
            },
            {
                "Country": "EE", "value": 28.2
            },

            {
                "Country": "HR", "value": 28.5
            },
            {
                "Country": "BG", "value": 56
            },
            {
                "Country": "RO", "value": 33.2
            },

            {
                "Country": "GR", "value": 21.7
            },
            {
                "Country": "IT", "value": 45.3
            },
            {
                "Country": "CY", "value": 24.7
            },
            {
                "Country": "MT", "value": 27.4
            }

        ]
    ];
    drawRadarChart('#radarchart', 400, 400);
};

function updateHealth() {
    json_file = [
        [
            {
                "Country": "EU28", "value": 87.4
            },
            {
                "Country": "DK", "value": 89.6
            },
            {
                "Country": "FI", "value": 89.7
            },
            {
                "Country": "SE", "value": 94.1
            },

            {
                "Country": "BE", "value": 86.3
            },
            {
                "Country": "FR", "value": 87.1
            },
            {
                "Country": "NL", "value": 89.9
            },
            {
                "Country": "LU", "value": 89
            },
            {
                "Country": "GB", "value": 93.1
            },
            {
                "Country": "IE", "value": 90.6
            },

            {
                "Country": "ES", "value": 89.6
            },
            {
                "Country": "PT", "value": 83.6
            },

            {
                "Country": "DE", "value": 90.5
            },
            {
                "Country": "AT", "value": 91.7
            },
            {
                "Country": "SI", "value": 87.7
            },
            {
                "Country": "SK", "value": 85.3
            },
            {
                "Country": "HU", "value": 86
            },
            {
                "Country": "CZ", "value": 86
            },
            {
                "Country": "PL", "value": 82.2
            },

            {
                "Country": "LV", "value": 78.4
            },
            {
                "Country": "LT", "value": 79.1
            },
            {
                "Country": "EE", "value": 81.5
            },

            {
                "Country": "HR", "value": 83.3
            },
            {
                "Country": "BG", "value": 76.4
            },
            {
                "Country": "RO", "value": 70.4
            },

            {
                "Country": "GR", "value": 83.1
            },
            {
                "Country": "IT", "value": 86.3
            },
            {
                "Country": "CY", "value": 88.2
            },
            {
                "Country": "MT", "value": 91.8
            }

        ]
    ];
    drawRadarChart('#radarchart', 400, 400);
};

