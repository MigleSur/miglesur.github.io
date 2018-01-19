// var color_scale = [
//     //"#f2f0f7",
//     "#dadaeb",
//     "#bcbddc",
//     "#9e9ac8",
//     "#756bb1",
//     "#3d2f6e"];
function redraw_map(year) {


    d3.csv("maps/active_countries.csv", function (error1, active_countries) {
        if (error1) throw error1;

        var dummy = [];
        for (i = 0; i < active_countries.length; i++) {
            dummy.push(active_countries[i]["x"]);
        }

        active_countries = dummy;

        var data_file = "gei" + year + ".tsv";
        console.log(data_file);

        d3.tsv(data_file, function (d) {
                d["Overall"] = +d["Overall"];
                d["Work"] = +d["Work"];
                d["Money"] = +d["Money"];
                d["Knowledge"] = +d["Knowledge"];
                return d;
            },

            function (error2, gei) {
                if (error2) throw error2;


                color_maps(year, gei);

            });
    })

}
