
// Initialiation function. Called after body has loaded
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
                .append("title")
                .text(function (da) {
                    return da[column_list[item]] + "%"
                });
        }

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


