function draw_map(year) {

    console.log("Removing old map");
    d3.select(".map").selectAll("svg").selectAll("*").remove();
    console.log("Drawing map");
    console.log(year);

    d3.csv("maps/active_countries.csv", function (error1, active_countries) {
        if (error1) throw error1;

        var dummy = [];
        for (i = 0; i < active_countries.length; i++) {
            dummy.push(active_countries[i]["x"]);
        }

        active_countries = dummy;

        d3.tsv("gei" + year + ".tsv",

            function (d) {

                d["Overall"] = +d["Overall"];
                d["Work"] = +d["Work"];
                d["Money"] = +d["Money"];
                d["Knowledge"] = +d["Knowledge"];
                return d;

            },

            function (error2, gei) {
                if (error2) throw error2;

                d3.json("maps/custom.json", function (error, custom) {
                    if (error) return console.error(error);

                    var countries = topojson.feature(custom, custom.objects.countries);

                    var projection = d3.geo.albers()
                        .center([0, 48])
                        .rotate([-16, 0])
                        .parallels([35, 80])
                        .translate([width / 2, height / 1.5]);

                    var path = d3.geo.path()
                        .projection(projection);



                    svg.append("path")
                        .datum(countries)
                        .attr("d", path);

                    var text = svg.append("text")
                        .attr("class", "year_text");
                    var legend = svg.append("g");
                    _ = color_maps(year, gei);

                    light_colors = _[0];
                    rateById = _[1];

                    draw_legend();

                    svg.selectAll(".country")
                        .data(topojson.feature(custom, custom.objects.countries).features)
                        .enter().append("path")
                        .attr("class", function (d) {
                            return "country " + d.id;
                        })


                        .on("mouseover", function (d) {

                            if (active_countries.indexOf(d.id) >= 0) {

                                d3.select(this)
                                    .transition()
                                    .style("fill", "#fdff21");

                                // show_info(d);
                            }
                        })
                        .on("mouseout", function (d) {
                            if (active_countries.indexOf(d.id) >= 0) {

                                d3.select(this)
                                    .transition()
                                    .style("fill", function (d) {
                                            return light_colors(rateById[d.id]);
                                        }
                                    );

                                // reset_info(d);
                            }
                        })
                        .attr("d", path);


                    // Display boundaries
                    svg.append("path")
                    //.datum(topojson.mesh(custom, custom.objects.countries))
                        .datum(topojson.mesh(custom, custom.objects.countries, function (a, b) {
                            return a !== b && (active_countries.indexOf(a.id) < 0 ^ active_countries.indexOf(b.id) < 0);
                        }))
                        .attr("d", path)
                        .attr("class", "exterior-boundary");

                    svg.append("path")
                    //.datum(topojson.mesh(custom, custom.objects.countries))
                        .datum(topojson.mesh(custom, custom.objects.countries, function (a, b) {
                            return a !== b && active_countries.indexOf(a.id) >= 0 && active_countries.indexOf(b.id) >= 0;
                        }))
                        .attr("d", path)
                        .attr("class", "interior-boundary");


                    // svg.append("path")
                    // //.datum(topojson.mesh(custom, custom.objects.countries))
                    //     .datum(topojson.mesh(custom, custom.objects.countries, function (a, b) {
                    //         return a !== b && active_countries.indexOf(a.id) < 0 && active_countries.indexOf(b.id) < 0;
                    //     }))
                    //     .attr("d", path)
                    //     .attr("class", "non-eu");
                });
            });

    });
}