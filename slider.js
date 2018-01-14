

    console.log(d3.version);

    var slider_svg = d3.select("body > svg"),
        margin = {right: 50, left: 50},
        width = +slider_svg.attr("width") - margin.left - margin.right;
        // height = +slider_svg.attr("height");
    var margin_slider = {top: 30, right: 100, bottom: 0, left: 30};

    console.log(+slider_svg.attr("height"));

    var width_slider = slider_svg.attr("width") - margin_slider.left - margin_slider.right;


    var xslider = d3.scaleLinear()
        .range([0, width_slider, 100])
        .clamp(true);


    var slider = slider_svg.append("g")
        .attr("class", "slider");
        // .attr("transform", "translate(" + margin_slider.left + "," + margin_slider.top + ")");

    slider.append("line")
        .attr("class", "track")
        .attr("x1", xslider.range()[0])
        .attr("x2", xslider.range()[1])
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay");


    slider.insert("g", ".track-overlay")
        .attr("transform", "translate(0," + 18 + ")")
        .selectAll("text")
        .enter().append("text")
        .attr("x", xslider)
        .attr("text-anchor", "middle")
        .text(function(d) { return d; });

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9)
        .attr("cx", 0);


function hue(h) {
    handle.attr("cx", xslider(h));
    if(h==1) {h=0.99};
    var years = ["2005", "2010", "2012", "2015"];
    var year = years[Math.floor(xslider(h) / width_slider * years.length)];
    return year
};


slider.call(d3.drag()
    .on("start.interrupt", function () {
        slider.interrupt();
    })
    .on("start drag", function () {
        var new_year = hue(xslider.invert(d3.event.x));
        if (year != new_year) {
            year = new_year;
            redraw_map(year);
        }
    }));
