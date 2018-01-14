var blue_colors = [
    //"#f2f0f7",
    "#dadaeb",
    "#bcbddc",
    "#9e9ac8",
    "#756bb1",
    "#3d2f6e"];

var gei_domain = [50, 60, 70, 75];


function preprocess_map_data(gei_index, gei) {

    var gei_ids = [];
    for (i = 0; i < gei.length; i++) {
        gei_ids.push(gei[i]["Country"]);
    }

    var gei_value = [];
    var gei_country = [];

    for (i = 0; i < gei.length; i++) {
        current_gei = gei[i][gei_index];
        gei_value.push(current_gei);
        gei_country.push(gei[i]["Country"]);
    }


    var light_colors = d3.scaleThreshold()
        .domain(gei_domain)
        .range(blue_colors);


    var rateById = {};

    gei.forEach(function (d) {
        rateById[d.Country] = +d[gei_index];
    });
    return [light_colors, rateById];
}

function color_maps(year, gei) {

    var gei_index = "Overall";

    var _ = preprocess_map_data(gei_index, gei);
    var light_colors = _[0];
    var rateById = _[1];

    d3.json("maps/custom.json", function (error, custom) {
        if (error) return console.error(error);

        svg.selectAll(".country")
            .data(topojson.feature(custom, custom.objects.countries).features)
            // .update()
            .transition()
            .style("fill", function (d) {
                var result = light_colors(rateById[d.id]);
                if (result == null) result = "#ffffff";
                return result
            })
    });

    var text = svg.selectAll("text.year_text")
        .attr("x", 100)
        .attr("y", 100)
        .text(year)
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .attr("fill", "red");


    return [light_colors, rateById];
}

function draw_legend() {
    var legend = svg.selectAll("g")
        .attr("class","legend")
        .attr("transform","translate(600,400)")
        .style("font-size","12px");

        var legend_text = gei_domain;
        gei_domain.push(100);
        gei_domain.unshift(0);

        for (i=0; i < blue_colors.length; i++) {

            legend
                .append("rect")
                .style("fill", blue_colors[i])
                .attr("class", "legend-rect")
                .attr("x", 30)
                .attr("y", 30 + 40*i)
                .attr("width", 20)
                .attr("height", 20);
            legend
                .append("text")
                .text(gei_domain[i] + " - " + gei_domain[i+1])
                .attr("x", 55)
                .attr("y", 45 + 40*i);


        }

}


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
            color_maps(year, gei)
        })
}
