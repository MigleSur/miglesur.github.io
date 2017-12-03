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

    d3.tsv("data_hist.tsv", function(da) {
        da.mean_temp = +da.mean_temp;
        return da;
    }, function(error, data){
        if (error) throw error;

        x.domain(data.map(function(da) { return da.month; }));

        y.domain([d3.min(data, function(da) { return da.mean_temp; })-5, d3.max(data, function(da) { return da.mean_temp; })]);

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
        .attr("y", function(da) { return y(da.mean_temp); })
        .attr("fill", "#000168")
        .attr("width", 50)
        .attr("height", function(da) { return height - y(da.mean_temp);
        });

    h.append("text")
        .attr("x", (width / 2))
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style('text-decoration','underline')
        .text("Mean monthly temperature in Kaunas");

    });

}