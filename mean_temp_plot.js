d3.select(window).on('load', init);

var parseTime = d3.timeParse("%Y");

function init() {

    var svg = d3.select("svg"),
        margin = {top: 20, right: 40, bottom: 30, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var x = d3.scaleTime().range([0, width]);
        y = d3.scaleLinear().range([height, 0]);
        z = d3.scaleOrdinal(d3.schemeCategory10);

    var line = d3.line()
        // .curve(d3.curveBasis) // For smoothed lines

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

        console.log(cities)
        console.log(cities[0].values[0].temperature)
        console.log(cities[0].values[1].temperature)

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
            //.select(".domain")
            //.remove()
            ;

        // Y axis
        g.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 12)
            //.attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Temp (°C)");

        // Plot title
        g.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.bottom / 4 ))
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style('text-decoration','underline')
            .text("Yearly mean temperature in Kaunas");

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
    
    
//        // We dont know yet
//        g.append("path")
//            .datum(data)
//            .attr("fill", "none")
//            .attr("stroke", "steelblue")
//            .attr("stroke-linejoin", "round")
//            .attr("stroke-linecap", "round")
//            .attr("stroke-width", 1.5)
//            .attr("d", line);

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

