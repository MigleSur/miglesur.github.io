function redraw_map(year) {
    d3.tsv("gei" + year + ".tsv", function (d) {
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

            d3.json("maps/custom.json", function (error, custom) {
                if (error) return console.error(error);

                svg.selectAll(".country")
                    .data(topojson.feature(custom, custom.objects.countries).features)
                    // .update()
                    .style("fill", function (d) {
                        var result = light_colors(rateById[d.id]);
                        if (result == null) result = "#ffffff";
                        return result
                    })
            });

            var text = svg.selectAll("text")
                .attr("x", 100)
                .attr("y", 100)
                .text(year)
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
                .attr("fill", "red");
        })
}