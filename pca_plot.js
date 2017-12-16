function init_plot1() {

    var svg = d3.select("#plot1"),
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
        .x(function(d){return x(d.PC001);})
        .y(function(d){return y(d.PC002);});

    d3.csv("hands_pca.csv", function (error, data) {
        if (error) throw error;

        data.forEach(function(d){
            d.PC001 = +d.PC001;
            d.PC002 = +d.PC002;
        });

        /*
        d3.text("hands_pca.csv", function(text) {
        var hand_pca_data = d3.csvParse(text).map(function (col, i) {
            return d3.csvParse(text).map(function (row) {
                return +row[i]
            });
        });
    });
    */
        x.domain(d3.extent(data, function(d){return d.PC001;}));
        y.domain(d3.extent(data, function(d){return d.PC002;}));

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
                return x(d.PC001);
            })
            .attr('cy', function (d) {
                return y(d.PC002);
            })
            .attr('r', 5)
            .attr('fill', 'black')
            .append("svg:title")
            .text(function(d, i){return i;})
    })
}

function init_plot2(){

    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    var svg = d3.select('#plot2'),
        margin = {top: 20, right: 40, bottom: 30, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .range([0,width]);

    var y = d3.scaleLinear()
        .range([height,0]);

    d3.csv("hands.csv",
        function(d) {
        var i;
        for (i=1; i<=57; i++) {
            d["X"+pad(i, 2)] = +d["X"+pad(i, 2)];
            d["Y"+pad(i, 2)] = +d["Y"+pad(i, 2)];
        }
        return d},

        function(error, data){
            if (error) throw error;
        var hands = d3.map(data);
        var hand = hands.get("0");
        var xval = d3.map(hand).values().slice(0,56);
        var yval = d3.map(hand).values().slice(56,112);


        svg.selectAll("circle.datapoint")
            .data(d3.zip(xval,yval))
            .enter()
            .append("circle")
            .attr("class", "datapoint")
            .attr("cx", function(d){
                return x(d[0]);
            })
            .attr("cy", function(d){
                return y(d[1]);
            })
            .attr("r", 2);

        })
}
