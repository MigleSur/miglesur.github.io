d3.select(window).on('load', init);

function init() {

    var svg = d3.select("svg"),
        margin = {top: 20, right: 40, bottom: 30, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // Create scales
    var x = d3.scaleLinear()
        .range([0,width]);

    var y = d3.scaleLinear()
        .range([height,0]);

    var valueline = d3.line()
        .x(function(d){return x(d.PC1);})
        .y(function(d){return y(d.PC2);});

    d3.csv("hands_pca.csv", function (error, data) {
        if (error) throw error;

        data.forEach(function(d){
            d.PC1 = +d.PC1;
            d.PC2 = +d.PC2;
        });

        x.domain(d3.extent(data, function(d){return d.PC1;}));
        y.domain(d3.extent(data, function(d){return d.PC2;}));

        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .append("text")
            .attr("fill", "#000")
            .attr("y", -4)
            .attr("x", 650)
            .attr("text-anchor", "end")
            .text("PC1")
        ;

        // Y axis
        g.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 12)
            .attr("text-anchor", "end")
            .text("PC2");

        // For reference, add points as well
        g.selectAll('dot')
            .data(data)
            .enter().append("circle")
            .attr('cx', function (d) {
                return x(d.PC1);
            })
            .attr('cy', function (d) {
                return y(d.PC2);
            })
            .attr('r', 5)
            .attr('fill', 'black')
            .append("svg:title")
            .text(function(d, i){return d.PC1;})
    })
}