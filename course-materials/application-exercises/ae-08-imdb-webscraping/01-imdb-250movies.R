## Scrape the list of top 250 movies from https://www.imdb.com/chart/top

# Load packages ---------------------------------------------------------------

library(tidyverse)
library(rvest)

# Read html page ---------------------------------------------------------------

page <- read_html("___")

# Titles -----------------------------------------------------------------------

titles <- page %>%
  html_nodes("___") %>%
  html_text()

# Years-------------------------------------------------------------------------

years <- page %>%
  html_nodes("___") %>%
  html_text() %>%
  str_remove("___") %>%
  str_remove("___") %>%
  as.numeric()

# Scores -----------------------------------------------------------------------

ratings <- page %>%
  html_nodes("___") %>%
  ___ %>%
  ___

# Put it all in a data frame ---------------------------------------------------

imdb_top_250 <- tibble(
  title = ___,
  rating = ___,
  year = ___
)

# Add rank ---------------------------------------------------------------------

imdb_top_250 <- imdb_top_250 %>%
  mutate(rank = 1:nrow(imdb_top_250)) %>%
  relocate(rank)
