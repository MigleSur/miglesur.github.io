library("dplyr")
data <- read.table("station_Madrid.txt", h=T)
mean_data <-cbind(data$YEAR,data$metANN)
colnames(mean_data) <- c("date", "temp")
mean_data <- mean_data[-1,] # removing the first year which is not measured properly

only_months <- data[,1:13]

# write.table(mean_data, "data.tsv", sep="\t", row.names = F)
madrid_data <- mean_data 

# Kaunas
data <- read.table("station_Kaunas.txt", h=T)
mean_data <-cbind(data$YEAR,data$metANN)
colnames(mean_data) <- c("date", "temp")
mean_data <- mean_data[-1,] # removing the first year which is not measured properly
mean_data <- mean_data[-nrow(mean_data),] # removing the last year because it's not finished yet

# write.table(mean_data, "data.tsv", sep="\t", row.names = F)
kaunas_data <- mean_data

dat <- full_join(as.data.frame(kaunas_data), as.data.frame(madrid_data), by = "date")
colnames(dat)[2:3] <- c("kaunas", "madrid")

dat <- dat[complete.cases(dat),]
write.table(dat, "data.tsv", sep="\t", row.names = F, quote = F)
