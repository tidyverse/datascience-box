# 02-scrape-pac-function.R: function to scrape information for all contributions

# load packages ----------------------------------------------------------------

library(tidyverse)
library(rvest)

# function: scrape_pac ---------------------------------------------------------

scrape_pac <- function(url) {
  
  # read the page
  ___
  
  # extract the table
  pac <- ___
  
  # rename variables
  ___
  
  # fix name
  ___
  
  # add year
  pac <- pac %>%
    mutate(year = str_sub(___))
  
  # return data frame
  pac
  
}

# test function ----------------------------------------------------------------

url_2020 <- "___"
pac_2020_fn <- scrape_pac(url_2020)

url_2018 <- "___"
pac_2018 <- scrape_pac(url_2018)

url_1998 <- "___"
pac_1998 <- scrape_pac(url_1998)

# write files -------------------------------------------------------------------

write_csv(pac_2020_fn, "data/pac-2020-fn.csv")
write_csv(pac_2018, "data/pac-2018.csv")
write_csv(pac_1998, "data/pac-1998.csv")
