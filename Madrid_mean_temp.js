// Set up on-load initialization
d3.select(window).on('load', init);

// Initialiation function. Called after body has loaded
function init() {

    var svg = d3.select("svg"),
        margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = d3.timeParse("%Y");

    var x = d3.scaleTime()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var line = d3.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.temp);
        });

    d3.tsv("data.tsv", function (d) {
        d.date = parseTime(d.date);
        d.temp = +d.temp;
        return d;
    }, function (error, data) {
        if (error) throw error;

        x.domain(d3.extent(data, function (d) {
            return d.date;
        }));
        y.domain(d3.extent(data, function (d) {
            return d.temp;
        }));

        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .append("text")
            .attr("fill", "#000")
            .attr("y", -4)
            .attr("dx", "88.92em")
            .attr("text-anchor", "end")
            .text("Year")
            .select(".domain")
            .remove();

        g.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Temp (°C)");

        g.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.bottom / 4 ))
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style('text-decoration','underline')
            .text("Plot of mean temperature of each year in Madrid");

        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", line);


    });
}