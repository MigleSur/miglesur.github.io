
function draw_map(year, countries, active_countries) {


            d3.tsv("gei" + year + ".tsv",

                function (d) {

                    d["Overall"] = +d["Overall"];
                    return d;

                },

                function (error2, gei) {
                    if (error2) throw error2;

                    var text = svg
                        .select("text.year_text")
                        .text("Year " + year)
                        .attr("transform", "translate(650,300)");

                    var gei_index = "Overall";


                    var diff = preprocess_map_data("Diff", gei);
                    var rateById = preprocess_map_data(gei_index, gei);


                    d3.json("maps/custom.json", function (error, custom) {
                        if (error) return console.error(error);

                        // Color the countries according to data
                        svg.selectAll(".country")
                            .transition()
                            .style("fill", function (d) {
                                var result = light_colors(rateById[d.id]);
                                if (result == null) result = "#ffffff";
                                return result
                            });
                    }); // end of json


                    svg.selectAll(".country")
                        .data(countries.features)
                        .on("mouseover", function (d) {

                            if (active_countries.indexOf(d.id) >= 0) {


                                d3.select(this)
                                    .transition()
                                    .style("fill", "#ecee20");
                            }
                        })

                        .on("mousemove", function (d) {
                            if (active_countries.indexOf(d.id) >= 0) {

                                tooltip
                                    .transition()
                                    .duration(20)
                                    .style("opacity", .9);

                                tooltip
                                    .html(d.properties.name + "<br>" + rateById[d.id] + "<br>" + "Δ" + diff[d.id])
                                    .style("left", (d3.event.pageX) + "px")
                                    .style("top", (d3.event.pageY - 28) + "px")
                                    .style("display", "inline-block");

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


                                tooltip.style("display", "none");

                                // reset_info(d);
                            }
                        });

                }); // end of tsv
}