function draw_legend() {



    var legend = svg.selectAll("g.legend");
    legend
        .attr("class","legend")
        .attr("transform","translate(620,280)")
        .style("font-size","12px");

    var legend_text = Object.create(gei_domain);

    legend_text.push(100);
    legend_text.unshift(0);

    for (i=0; i < color_scale.length; i++) {
        legend
            .append("rect")
            .style("fill", color_scale[i])
            .attr("class", "legend-rect")
            .attr("x", 30)
            .attr("y", 30 + 40*i)
            .attr("width", 20)
            .attr("height", 20);
        legend
            .append("text")
            .text(legend_text[i] + " - " + legend_text[i+1])
            .attr("x", 55)
            .attr("y", 45 + 40*i);


    }

}
