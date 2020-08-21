# Load packages ---------------------------------------------------------------
library(tidyverse)
library(rvest)

# Read html page --------------------------------------------------------------
page <- read_html("http://www.imdb.com/chart/top")

# Titles ----------------------------------------------------------------------
titles <- page %>%
  html_nodes(".titleColumn a") %>%
  html_text()

# Years -----------------------------------------------------------------------
years <- page %>%
  html_nodes(".secondaryInfo") %>%
  html_text() %>%
  str_remove("\\(") %>% # remove (
  str_remove("\\)") %>% # remove )
  as.numeric()

# Scores ----------------------------------------------------------------------
scores <- page %>%
  html_nodes("#main strong") %>%
  html_text() %>%
  as.numeric()

# Create data frame -----------------------------------------------------------
imdb_top_250 <- tibble(
  title = titles, 
  year = years, 
  score = scores
)
