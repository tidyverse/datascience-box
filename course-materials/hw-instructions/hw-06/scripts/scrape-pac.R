## load packages ----------------------------------------------------------------
#
#library(tidyverse)
#library(rvest)
#library(here) 
#
## function: scrape_pac ---------------------------------------------------------
#
#scrape_pac <- function(url) {
#  
#  # read the page
#  page <- ___(___)
#  
#  # exract the table
#  pac <-  page %>%
#    # select node .DataTable (identified using the SelectorGadget)
#    html_node(".DataTable-Partial") %>%
#    # parse table at node td into a data frame
#    #   table has a head and empty cells should be filled with NAs
#    html_table("td", header = ___, fill = ___) %>%
#    # convert to a tibble
#    as_tibble()
#  
#  # rename variables
#  pac <- pac %>%
#    # rename columns
#    rename(
#      name = ___ ,
#      country_parent = ___,
#      total = ___,
#      dems = ___,
#      repubs = ___
#    )
#  
#  # fix name
#  pac <- pac %>%
#    # remove extraneous whitespaces from the name column
#    mutate(name = ___)
#  
#  # add year
#  pac <- pac %>%
#    # extract last 4 characters of the URL and save as year
#    mutate(year = ___)
#  
#  # return data frame
#  pac
#  
#}
#
## test function ----------------------------------------------------------------
#
#url_2022 <- "___"
#pac_2022 <- scrape_pac(___)
#
#url_2020 <- "___"
#pac_2020 <- scrape_pac(___)
#
#url_2000 <- "___"
#pac_2000 <- scrape_pac(___)
#
## list of urls -----------------------------------------------------------------
#
## first part of url
#root <- "https://www.opensecrets.org/political-action-committees-pacs/foreign-connected-pacs/"
#
## second part of url (election years as a sequence)
#year <- seq(from = ___, to = ___, by = ___)
#
## construct urls by pasting first and second parts together
#urls <- paste0(___, ___)
#
## map the scrape_pac function over list of urls --------------------------------
#
#pac_all <- ___(___, ___)
#
## write data -------------------------------------------------------------------
#
#write_csv(___, file = here::here("data/pac-all.csv"))