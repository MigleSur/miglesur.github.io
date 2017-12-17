function init_plot1() {

    var svg = d3.select("#plot1"),
        margin = {top: 20, right: 40, bottom: 30, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // Create scales
    var x = d3.scaleLinear()
        .range([20,width]);

    var y = d3.scaleLinear()
        .range([height-20,0]);

    d3.csv("hands_pca.csv", function (error, data) {
        if (error) throw error;

        data.forEach(function(d){
            d.PC001 = +d.PC001;
            d.PC002 = +d.PC002;
        });

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
            .attr("class", "dot")
            .attr("id", function(d, i) {
                return i;
            })

            .append("svg:title")
            .text(function(d, i){i = +i; return "Hand: "+(i+1);})
    })
}

function init_plot2(){

    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    var svg = d3.select('#plot2'),
        margin = {top: 70, right: 100, bottom: 70, left: 100},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g");

    var x = d3.scaleLinear()
        .range([0,width]);

    var y = d3.scaleLinear()
        .range([height,0]);




    var hands;
    d3.csv("hands.csv",
        function(d) {
        var i;
        for (i=0; i<=56; i++) {
            d["X"+pad(i, 2)] = +d["X"+pad(i, 2)];
            d["Y"+pad(i, 2)] = +d["Y"+pad(i, 2)];
        }
        return d},

        function(error, data) {
            if (error) throw error;

            var hands = d3.map(data);

            g.append("circle")
                .attr("transform", "translate(" + (30 + margin.left) + "," + margin.top + ")")
                .attr("width", width)
                .attr("height", height)
                .attr("class", "outer_circle")
                .attr("cx", width / 2)
                .attr("cy", height / 2)
                .attr("r", width / 1.2)
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("fill", "transparent");


            g.append('path')
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("class", "hand");


            function draw_hand(k) {

                var hand = hands.get(k);
                var xval = d3.map(hand).values().slice(0, 56);
                var yval = d3.map(hand).values().slice(56, 112);

                var final = d3.zip(xval, yval);

                var line = d3.line()
                    .x(function (d) {
                        return x(d[0]);
                    })
                    .y(function (d) {
                        return y(d[1]);
                    })
                    .curve(d3.curveCatmullRom);

                g.select('path').transition().duration(500)
                    .attr('d', line(final))

            }

            draw_hand("0");


            console.log("Hands");
            console.log(hands);
            d3.select("#plot1")
                .selectAll("circle")
                .on('click', function (d, i) {
                    k = i.toString();
                    // console.log(k);
                    draw_hand(k);
                })
                .on('mouseover', function (d, i) {
                    console.log(i);
                    document.querySelectorAll(".dot")[i].setAttribute("r", 10);
                })
                .on('mousemove', function (d, i) {
                    console.log(i);
                    document.querySelectorAll(".dot")[i].setAttribute("r", 10);
                })

                .on('mouseout', function (d, i) {
                    console.log(i);
                    document.querySelectorAll(".dot")[i].setAttribute("r", 5);
                });


        });
}
