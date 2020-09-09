# 03-scrape-pac-all.R: map scrape_pac() over all years

# load packages ----------------------------------------------------------------

library(tidyverse)
library(rvest)

# list of urls -----------------------------------------------------------------

root <- "https://www.opensecrets.org/political-action-committees-pacs/foreign-connected-pacs?cycle="
year <- seq(from = ___, to = ___, by = ___)
urls <- paste0(root, ___)

# map --------------------------------------------------------------------------

pac_all <- map_dfr(urls, scrape_pac)

# write data -------------------------------------------------------------------

write_csv(pac_all, path = "data/pac-all.csv")
