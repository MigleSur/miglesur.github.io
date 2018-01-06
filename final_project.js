
// Initialiation function. Called after body has loaded
function bar_plot() {

    var barpl = d3.select("#barplot")
    var margin = {top: 50, right: 20, bottom: 80, left: 20};
    var width = +barpl.node().getBoundingClientRect().width - margin.left - margin.right;
    var height = +barpl.node().getBoundingClientRect().height - margin.top - margin.bottom;

    var g = barpl.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand().range([0, width]).padding(0.05),
        y = d3.scaleLinear().range([height, 0]);

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
                .attr("transform", "rotate(-35)");

        g.append("g")
            .attr("class", "axis y")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("x", 0)
            .attr("y", -4)
            .text("%");

        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("x", function(da) { return x(da.discrimination); })
            .attr("y", function(da) { return y(da.widespread); })
            .attr("fill", "#ffaf59")
            .attr("width", width/34)
            .attr("height", function(da) { return height - y(da.widespread);
            });

        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("x", function(da) { return x(da.discrimination); })
            .attr("y", function(da) { return y(da.rare); })
            .attr("fill", "#4a99fb")
            .attr("width", width/34)
            .attr("transform", "translate("+width/34+")")
            .attr("height", function(da) { return height - y(da.rare);
            });





        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("x", function(da) { return x(da.discrimination); })
            .attr("y", function(da) { return y(da.nonexistent); })
            .attr("fill", "#f4214d")
            .attr("width", width/34)
            .attr("transform", "translate("+width*2/34+")")
            .attr("height", function(da) { return height - y(da.nonexistent);
            });

        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("x", function(da) { return x(da.discrimination); })
            .attr("y", function(da) { return y(da.dk); })
            .attr("fill", "#1935f4")
            .attr("width", width/34)
            .attr("transform", "translate("+width*3/34+")")
            .attr("height", function(da) { return height - y(da.dk);
            });

        // g.append("text")
        //     .attr("x", (width / 2))
        //     .attr("y", -10)
        //     .attr("text-anchor", "middle")
        //     .style("font-size", "14px")
        //     .style('text-decoration','underline')
        //     .text("Popularity of different types of discrimination");

        g.append("text")
            .attr("x", 65)
            .attr("y", 10)
            .attr("text-anchor", "start")
            .style("font-size", "12px")
            .text("Widespread");

        g.append("text")
            .attr("x", 65)
            .attr("y", 25)
            .attr("text-anchor", "start")
            .style("font-size", "12px")
            .text("Rare");

        g.append("text")
            .attr("x", 180)
            .attr("y", 10)
            .attr("text-anchor", "start")
            .style("font-size", "12px")
            .text("Non-existent");

        g.append("text")
            .attr("x", 180)
            .attr("y", 25)
            .attr("text-anchor", "start")
            .style("font-size", "12px")
            .text("Don't know");

        g.append("rect")
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("x", 47)
            .attr("y", -1)
            .attr("width", 12.5)
            .attr("height", 12.5)
            .attr("fill", "#ffaf59")

        g.append("rect")
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("x", 47)
            .attr("y", 14)
            .attr("width", 12.5)
            .attr("height", 12.5)
            .attr("fill", "#4a99fb");

        g.append("rect")
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("x", 162)
            .attr("y", -1)
            .attr("width", 12.5)
            .attr("height", 12.5)
            .attr("fill", "#f4214d");

        g.append("rect")
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("x", 162)
            .attr("y", 14)
            .attr("width", 12.5)
            .attr("height", 12.5)
            .attr("fill", "#1935f4");






    });

}