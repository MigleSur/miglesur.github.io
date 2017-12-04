

var parseTime = d3.timeParse("%Y");

function init_plot1() {

    var plot1 = d3.select("#plot1"),
        margin = {top: 20, right: 40, bottom: 30, left: 50},
        width = +plot1.attr("width") - margin.left - margin.right,
        height = +plot1.attr("height") - margin.top - margin.bottom,
        g = plot1.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var x = d3.scaleTime().range([0, width]);
        y = d3.scaleLinear().range([height, 0]);
        z = d3.scaleOrdinal(d3.schemeCategory10);

    var line = d3.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.temperature); });

    d3.tsv("data.tsv", type, function (error, data) {
        if (error) throw error;
        
        var cities = data.columns.slice(1).map(function(id) {
            return {
                id: id,
                values: data.map(function(d) {
                    return {date: d.date, temperature: d[id]};
                })
            };
        });

        x.domain(d3.extent(data, function (d) {
            return d.date;
        }));
        
        y.domain([
            d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
            d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
        ]);

        /*
        y.domain(d3.extent(data, function (d) {
            return d.temp;
        }));
        */

        z.domain(cities.map(function(c) { return c.id; }));
 
        // X axis
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .append("text")
            .attr("fill", "#000")
            .attr("y", -4)
            .attr("x", 650)
            .attr("text-anchor", "end")
            .text("Year")
            ;

        // Y axis
        g.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 12)
            .attr("text-anchor", "end")
            .text("Temp (°C)");

        // Plot title
        g.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.bottom / 4 ))
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style('text-decoration','underline')
            .text("Yearly mean temperature in Kaunas and Madrid");

        g.append("line")          // attach a line
            .style("stroke", "red")  // colour the line
            .attr("id", "meanline")
            .attr("x1", x(parseTime(1953)))       // x position of the first end of the line
            .attr("y1", y(6.6))        // y position of the first end of the line
            .attr("x2", x(parseTime(2015)))       // x position of the second end of the line
            .attr("y2", y(6.6));       // y position of the second end of the line


        g.append("line")          // attach a line
            .style("stroke", "red")  // colour the line
            .attr("id", "meanline")
            .attr("x1", x(parseTime(1953)))       // x position of the first end of the line
            .attr("y1", y(15.3))        // y position of the first end of the line
            .attr("x2", x(parseTime(2015)))       // x position of the second end of the line
            .attr("y2", y(15.3));       // y position of the second end of the line


        var city = g.selectAll(".city")
            .data(cities)
            .enter().append("g")
            .attr("class", "city");

        city.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line(d.values); })
            .style("stroke", function(d) { return z(d.id); });

        city.append("text")
            .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
            .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
            .attr("x", 3)
            .attr("dy", "0.35em")
            .style("font", "10px sans-serif")
            .text(function(d) { return d.id; });
    });

}

function type(d, _, columns) {
    d.date = parseTime(d.date);
    // console.log(d)
    for (var i = 1, n = columns.length, c; i < n; ++i) {
        d[c = columns[i]] = +d[c];
        // console.log(c)
        // console.log(d[c])
    }
    return d;
}

