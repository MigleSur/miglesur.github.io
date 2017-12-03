data <- read.table("station_Kaunas.txt", h=T)
data <- data[-1,] # removing the first year which is not measured properly
only_months <- data[,1:13]

only_months <- only_months[-1,] # removing the first year which is not measured properly
only_months <- only_months[-nrow(only_months),] # removing the last year because it's not finished yet

x <-colMeans(only_months[,-1])
y <- cbind(colnames(only_months[,-1]), x)
colnames(y) <- c("month", "mean_temp")
write.table(y, "data_hist.tsv", sep="\t", row.names = F, quote = F)


