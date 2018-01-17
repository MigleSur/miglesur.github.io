suppressMessages(library("dplyr"))
gei <- list(2005, 2010, 2012, 2015) %>% lapply(function(x) {read.table(file = paste0("gei", x, ".tsv"), header = T)}) %>%
  do.call(rbind, .)
max(gei$Overall)
min(gei$Overall)

hist(gei$Overall, breaks = 30)
plot(density(gei$Overall, bw = 0.5))
