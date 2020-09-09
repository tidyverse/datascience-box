# 01-scrape-pac-2020.R: scrape information for 2020 contributions

# load packages ----------------------------------------------------------------

library(tidyverse)
library(rvest)

# define url -------------------------------------------------------------------

url_2020 <- "https://www.opensecrets.org/political-action-committees-pacs/foreign-connected-pacs?cycle=2020"

# read the page ----------------------------------------------------------------

page <- ___(url_2020)

# exract the table -------------------------------------------------------------

pac_2020 <- ___ %>%
  html_node(".DataTable") %>%
  html_table("___", header = ___, fill = ___) %>%
  as_tibble()

# rename variables -------------------------------------------------------------

pac_2020 <- pac_2020 %>%
  rename(
    ___ = `PAC Name (Affiliate)` ,
    ___ = `Country of Origin/Parent Company`,
    ___ = Total,
    ___ = Dems,
    ___ = Repubs
  )

# fix name ---------------------------------------------------------------------

pac_2020 <- pac_2020 %>%
  ___

# write data -------------------------------------------------------------------

write_csv(pac_2020, path = "data/pac-2020.csv")