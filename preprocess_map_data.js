var color_scale = d3.schemeReds[5];

var gei_domain = [50, 60, 70, 75];

var light_colors = d3.scale.threshold()
    .domain(gei_domain)
    .range(color_scale);


function preprocess_map_data(gei_index, gei) {

    var rateById = {};

    gei.forEach(function (d) {
        rateById[d.Country] = +d[gei_index];
    });
    return rateById;
}
