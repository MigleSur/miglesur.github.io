kun <- read.table("station_Kaunas.txt", h=T)

kun <- kun[-1,]
kun <- kun[-((nrow(kun)-1):nrow(kun)),]
kun <- kun[which(kun$YEAR > 1952),]

kun_months <- kun[,2:13]

kun_mean <- colMeans(kun_months)

mad <- read.table("station_Madrid.txt", h=T)

mad <- mad[-1,]
mad[,2:13][mad[,2:13] == 999.9] <- NA

mad_months <- mad[,2:13]
mad_mean <- colMeans(mad_months, na.rm = T)

final <- cbind(colnames(kun_months),mad_mean, kun_mean)
colnames(final) <- c("month", "madrid", "kaunas")


write.table(final, "data_hist_full.tsv", sep="\t", row.names = F, quote = F)
