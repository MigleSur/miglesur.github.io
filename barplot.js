// Initialiation function. Called after body has loaded
function init_plot2() {

    var plot2 = d3.select('#plot2')
    var margin = {top: 50, right: 20, bottom: 20, left: 20};
    var width = +plot2.node().getBoundingClientRect().width - margin.left - margin.right;
    var height = +plot2.node().getBoundingClientRect().height - margin.top - margin.bottom;

    var h = plot2.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand().range([0, width]).padding(0.05),
        y = d3.scaleLinear().range([height, 0]);

    d3.tsv("data_hist_full.tsv", function(da) {
        da.madrid = +da.madrid;
        da.kaunas = +da.kaunas;
        return da;
    }, function(error, data){
        if (error) throw error;

        x.domain(data.map(function(da) { return da.month; }));

        y.domain([-9, d3.max(data, function(da) { return da.madrid; })]);

    h.append("g")
        .attr("class", "axis x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    h.append("g")
        .attr("class", "axis y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 12)
        .text("Temp (°C)");

    h.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("x", function(da) { return x(da.month); })
        .attr("y", function(da) { return y(da.madrid); })
        .attr("fill", "#f48a00")
        .attr("width", 25)
        .attr("transform", "translate("+25+")")
        .attr("height", function(da) { return height - y(da.madrid);
        });

    h.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("x", function(da) { return x(da.month); })
        .attr("y", function(da) { return y(da.kaunas); })
        .attr("fill", "#4a99fb")
        .attr("width", 25)
        .attr("height", function(da) { return height - y(da.kaunas);
        });

    h.append("text")
        .attr("x", (width / 2))
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style('text-decoration','underline')
        .text("Mean monthly temperature in Kaunas and Madrid");

    h.append("text")
        .attr("x", 80)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Madrid");

    h.append("text")
        .attr("x", 80)
        .attr("y", 35)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Kaunas");

    h.append("rect")
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("x", 47)
        .attr("y", 25)
        .attr("width", 12.5)
        .attr("height", 12.5)
        .attr("fill", "#4a99fb");

    h.append("rect")
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("x", 47)
        .attr("y", 10)
        .attr("width", 12.5)
        .attr("height", 12.5)
        .attr("fill", "#f48a00")

    });

}