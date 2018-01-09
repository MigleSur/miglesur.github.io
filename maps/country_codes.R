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
library("dplyr")
countrycode_data <- countrycode_data
countrycode_data[countrycode_data$region %>% grepl(pattern = "Europe"), c("country.name.en", "iso2c", "iso3c")]
eu_alpha_3 <- countrycode_data[countrycode_data %>% .$region %>% grepl(pattern = "Europe"), "iso3c"]
# eu_alpha_3 <- eu_alpha_3[eu_alpha_3 != "RUS"]
eu_alpha_3 <- paste(eu_alpha_3, collapse = "', '")

eu_alpha_2 <- countrycode_data[countrycode_data %>% .$region %>% grepl(pattern = "Europe"), "iso2c"]
# eu_alpha_2 <- eu_alpha_2[eu_alpha_2 != "RU"]
eu_alpha_2 <- paste(eu_alpha_2, collapse = "', '")

cmd1 <- paste0('ogr2ogr -f GeoJSON -where \"ADM0_A3 IN (\'', eu_alpha_3, '\')\" countries.json ne_10m_admin_0_countries.shp')
cmd2 <- paste0('ogr2ogr -f GeoJSON -where \"ISO_A2 IN (\'', eu_alpha_2, '\') AND SCALERANK < 3\" places.json  ne_10m_populated_places.shp')
cmd3 <- "topojson -o custom.json --id-property SU_A3 --properties name=NAME -- countries.json places.json"

setwd("data")
system("rm *json")
system(cmd1)
system(cmd2)
# system(cmd3)
