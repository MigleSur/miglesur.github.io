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
        var active_countries = dummy;
        // console.log("active_countries");
        // console.log(active_countries);


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

                // console.log("gei");
                // console.log(gei);

                var gei_ids = [];
                for (i = 0; i < gei.length; i++) {
                    gei_ids.push(gei[i]["Country"]);
                }



                var gei_max = 82.7;
                var gei_min = 45.8;

                var gei_value = [];
                var gei_country = [];
                var gei_index = "Overall";

                for (i = 0; i < gei.length; i++) {
                    current_gei = gei[i][gei_index];
                    // if (current_gei > gei_max) gei_max = current_gei;
                    // if (current_gei < gei_min) gei_min = current_gei;
                    gei_value.push(current_gei);
                    gei_country.push(gei[i]["Country"]);
                }

                // gei_max = Math.ceil(gei_max);
                // gei_min = Math.floor(gei_min);

                var gei_domain = Array.range(gei_min, gei_max, (gei_max - gei_min) / 3);
                // console.log(gei_domain);

                var light_colors = d3.scale.threshold()
                    .domain(gei_domain)
                    .range(["#f2f0f7",
                        // "#dadaeb",
                        "#bcbddc",
                        // "#9e9ac8",
                        "#756bb1",
                        "#54278f"]);


                var rateById = {};

                gei.forEach(function (d) {
                    rateById[d.Country] = +d[gei_index];
                });


                // d3.json("https://cdn.rawgit.com/rveciana/5919944/raw//nuts0.json", function(error, custom) {
                d3.json("maps/custom.json", function (error, custom) {
                    if (error) return console.error(error);


                    // svg.append("path")
                    //     .datum(topojson.feature(custom, custom.objects.countries))
                    //     .attr("d", d3.geo.path().projection(d3.geo.mercator()));


                    // Base map

                    var countries = topojson.feature(custom, custom.objects.countries);

                    // Select projection
                    // var projection = d3.geo.mercator()
                    //     .scale(500)
                    //     .translate([width / 2, height / 2]);

                    var projection = d3.geo.albers()
                    // var projection = d3.geo.mercator()
                        .center([0, 48])
                        .rotate([-16, 0])
                        .parallels([35, 80])
                        .translate([width / 2, height / 1.5]);

                    var path = d3.geo.path()
                        .projection(projection);


                    var text = svg.selectAll("text")
                        .data(year)
                        .enter()
                        .append("text")
                        .attr("x", 100)
                        .attr("y", 100)
                        .text(year)
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "20px")
                        .attr("fill", "red");


                    svg.append("path")
                        .datum(countries)
                        .attr("d", path);

                    svg.selectAll(".country")
                        .data(topojson.feature(custom, custom.objects.countries).features)
                        .enter().append("path")
                        .attr("class", function (d) {

                            return "country " + d.id;
                        })
                        .style("fill", function (d) {
                            var result = light_colors(rateById[d.id]);
                            if (result == null) result = "#ffffff";
                            return result
                        })

                        // function(d) {
                        //
                        //     // color = "#c7ffff";
                        //     var color = "#ffffff";
                        //
                        //
                        //     for (i=0; i < gei.length; i++) {
                        //         if (gei[i]["Country"] === d.id) {
                        //             var color = assign_color(gei_value[i]);
                        //         }
                        //     }
                        //     return color;
                        //     //return "yellow";
                        // }
                        // )
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
                            return a !== b && active_countries.indexOf(a.id) >= 0;
                        }))
                        .attr("d", path)
                        .attr("class", "interior-boundary");


                    // Displaying places
//        svg.append("path")
//            .datum(topojson.feature(custom, custom.objects.places))
//            .attr("d", path)
//            .attr("class", "place");
//
//        svg.selectAll(".place-label")
//            .data(topojson.feature(custom, custom.objects.places).features)
//            .enter().append("text")
//            .attr("class", "place-label")
//            .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
//            .attr("dy", ".35em")
//            .text(function(d) { return d.properties.name; });
//
//        svg.selectAll(".place-label")
//            .attr("x", function(d) { return d.geometry.coordinates[0] > -1 ? 6 : -6; })
//            .style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; });


                    // svg.selectAll(".country-label")
                    //     .data(topojson.feature(custom, custom.objects.countries).features)
                    //     .enter().append("text")
                    //     .attr("class", function(d) { return "country-label " + d.id; })
                    //     .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
                    //     .attr("dy", ".35em")
                    //     .text(function(d) { console.log(d); return d.id; });


                });
            });

    });
}