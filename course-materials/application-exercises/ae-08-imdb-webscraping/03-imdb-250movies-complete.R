## Scrape the list of top 250 movies from https://www.imdb.com/chart/top

# Load packages ---------------------------------------------------------------

library(tidyverse)
library(rvest)

# Read html page ---------------------------------------------------------------

page <- read_html("https://www.imdb.com/chart/top")

# Titles -----------------------------------------------------------------------

titles <- page %>%
  html_nodes(".titleColumn a") %>%
  html_text()

# Years-------------------------------------------------------------------------

years <- page %>%
  html_nodes(".secondaryInfo") %>%
  html_text() %>%
  str_remove("\\(") %>%
  str_remove("\\)") %>%
  as.numeric()

# Scores -----------------------------------------------------------------------

scores <- page %>%
  html_nodes("strong") %>%
  html_text() %>%
  as.numeric()

# Put it all in a data frame ---------------------------------------------------

imdb_top_250 <- tibble(
  title = titles,
  rating = ratings,
  year = years
)

# Add rank ---------------------------------------------------------------------

imdb_top_250 <- imdb_top_250 %>%
  mutate(rank = 1:nrow(imdb_top_250)) %>%
  relocate(rank)
