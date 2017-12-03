d3.select(window).on('load', init);

function init() {

    var svg = d3.select('svg');
    var width = +svg.node().getBoundingClientRect().width;
    var height = +svg.node().getBoundingClientRect().height;

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    d3.csv(
        'data_hist.csv',
        function(d) {
            return d;
        },
        function(error, data) {
            if (error) throw error;


        })

    var x = d3.scaleBand().rangeRound([0, width])
        .domain(data.map(function(d) { return d[0]; }));

    var y = d3.scaleLinear().rangeRound([height, 0])
        .domain([0, d3.max(data, function(d) { return d[1]; })]);

    g.append("g")
        .attr("class", "axis x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis y")
        .call(d3.axisLeft(y).ticks(10, "%"));

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("x", function(d) { return x(d[0]); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d[1]); });
}
}