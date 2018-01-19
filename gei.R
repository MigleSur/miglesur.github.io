suppressMessages(library("dplyr"))
gei <- list(2005, 2010, 2012, 2015) %>% lapply(function(x) {read.table(file = paste0("gei", x, ".tsv"), header = T)})
years <- c(2005, 2010, 2012, 2015)

for(i in 1:4) {
gei_diff <- (gei[[i]] - gei[[1]]) %>% .[, "Overall", drop = T] %>% round(., 3)
result <- cbind(gei[[i]], "Diff" = gei_diff)
write.table(x = result, file = paste0("gei", years[i], ".tsv"),
                                        sep = "\t", quote = F, row.names = F)
}
gei %>% do.call(rbind, .)
max(gei$Overall)
min(gei$Overall)

hist(gei$Overall, breaks = 30)
plot(density(gei$Overall, bw = 0.5))
