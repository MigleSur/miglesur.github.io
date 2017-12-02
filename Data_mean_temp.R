data <- read.table("station_Madrid.txt", h=T)
mean_data <-cbind(data$YEAR,data$metANN)
colnames(mean_data) <- c("date", "temp")
mean_data <- mean_data[-1,] # removing the first year which is not measured properly

only_months <- data[,1:13]

write.table(mean_data, "data.tsv", sep="\t", row.names = F)


