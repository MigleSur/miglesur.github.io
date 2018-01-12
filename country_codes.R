# library("rvest")
# 
# alpha_3 <- read_html("https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3") %>%
#   #html_node(xpath = '//*[@id="mw-content-text"]/div/table/') %>%
#   html_node("tr > td > table") %>%
#   html_text %>%
#   strsplit("\\n") %>% unlist %>% matrix(ncol = 2, byrow = T) %>% as.data.frame()
# 
# 
# alpha_2 <- read_html("https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2") %>%
#   html_node(xpath = '//*[@id="mw-content-text"]/div/table[3]') %>%
#   html_nodes('tr') %>%
#   html_nodes('td') %>%
#   html_text %>%
#   matrix(ncol = 6, byrow = T)
# 
library("countrycode")
suppressMessages(library("dplyr"))
setwd("maps")
countrycode_data <- countrycode_data
#countrycode_data[countrycode_data$region %>% grepl(pattern = "Europe"), c("country.name.en", "iso2c", "iso3c")]

european_union <- c("Spain", "France", "Portugal", "Ireland", "United Kingdom of Great Britain and Northern Ireland", "Germany",
                    "Czech Republic", "Slovakia", "Bulgaria", "Romania", "Hungary", "Austria", "Greece", "Italy", "Luxembourg",
                    "Belgium", "Netherlands", "Denmark", "Sweden", "Finland", "Estonia", "Latvia", "Lithuania", "Poland",
                    "Cyprus", "Croatia", "Slovenia", "Malta")

length(european_union)
eea <- c(european_union, "Switzerland", "Norway", "Iceland")
europe <- c(eea, "Andorra", "San Marino", "Holy See (Vatican City State)", "Liechtenstein", "Serbia", "Albania",
            "The former Yugoslav Republic of Macedonia", "Bosnia and Herzegovina", "Montenegro", "Belarus",
            "Kosovo", "Russian Federation", "Ukraine", "Republic of Moldova", "Turkey")

#which(!(eea %in% countrycode_data$country.name.en))

europe_alpha_3 <- countrycode_data[(countrycode_data %>% .$country.name.en) %in% europe, "iso3c"]
# europe_alpha_3 <- europe_alpha_3[europe_alpha_3 != "RUS"]
europe_alpha_3 <- paste(europe_alpha_3, collapse = "', '")

europe_alpha_2 <- countrycode_data[(countrycode_data %>% .$country.name.en) %in% europe, "iso2c"]
eu_alpha_2 <- countrycode_data[(countrycode_data %>% .$country.name.en) %in% european_union, "iso2c"]
write.table(x = eu_alpha_2, file = "active_countries.csv", quote = F, row.names = F)
# europe_alpha_2 <- europe_alpha_2[europe_alpha_2 != "RU"]
europe_alpha_2 <- paste(europe_alpha_2, collapse = "', '")

cmd1 <- paste0('ogr2ogr -f GeoJSON -where \"ADM0_A3 IN (\'', europe_alpha_3, '\')\" countries.json ne_10m_admin_0_countries.shp')
cmd2 <- paste0('ogr2ogr -f GeoJSON -where \"ISO_A2 IN (\'', europe_alpha_2, '\') AND SCALERANK < 3\" places.json  ne_10m_populated_places.shp')
cmd3 <- "topojson -o custom.json --id-property SU_A3 --properties name=NAME -- countries.json places.json"

system("rm *json")
system(cmd1)
system(cmd2)
# system(cmd3)
