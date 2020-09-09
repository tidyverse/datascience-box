# load packages ----------------------------------------------------------------

library(tidyverse)
library(rvest)

# function: scrape_page --------------------------------------------------------

___ <- function(url){
  
  # read page
  page <- read_html(url)
  
  # scrape titles
  titles <- ___
  
  # scrape links
  links <- ___
  
  # scrape artists 
  artists <- ___
  
  # create and return tibble
  tibble(
    ___
  )
  
}
