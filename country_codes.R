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
library("ggplot2")
library("hrbrthemes")
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
europe <- c(eea,
            #"Russian Federation", "Ukraine", "Republic of Moldova","Turkey", "Belarus",
            "Andorra", "San Marino", "Holy See (Vatican City State)", "Liechtenstein", "Serbia", "Albania",
            "The former Yugoslav Republic of Macedonia", "Bosnia and Herzegovina", "Montenegro", "Kosovo")

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

setwd("..")

gei <- list(2005, 2010, 2012, 2015) %>% lapply(function(x) {read.table(file = paste0("gei", x, ".tsv"), header = T)}) %>%
  do.call(rbind, .)
max(gei$Overall)
min(gei$Overall)


gei <- read.table(file = "gei2005.tsv", header = T)

# ggplot(data = gei, mapping = aes(x = Overall)) +
#   geom_histogram() +
#   theme_ipsum()
# 
# quantile(gei$Overall)
# ggplot(data = arrange(gei, Overall), mapping = aes(y = Overall)) + geom_text(mapping = aes(label = Country, x = 1:29))
# plot(gei$Overall %>% sort, pch = ".")
# text(x = 1:29, y = arrange(gei, Overall) %>% .$Overall, labels = arrange(gei, Overall) %>% .$Country)
