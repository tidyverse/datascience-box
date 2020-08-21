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
  html_nodes("#main strong") %>%
  html_text() %>%
  as.numeric()

# Put it all in a data frame ---------------------------------------------------
top250 <- tibble(
  title = titles,
  score = scores,
  year = years
)
