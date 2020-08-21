# load packages ----------------------------------------------------------------
library(tidyverse)
library(rvest)

# read in http://www.imdb.com/chart/tvmeter ------------------------------------
page <- read_html("http://www.imdb.com/chart/tvmeter")

# years ------------------------------------------------------------------------
years <- page %>%
  html_nodes("a+ .secondaryInfo") %>%
  html_text() %>%
  str_remove("\\(") %>%
  str_remove("\\)") %>%
  as.numeric()

# scores -----------------------------------------------------------------------
scores <- page %>%
  html_nodes(".imdbRating") %>%
  html_text() %>%
  str_replace_all("\n", "") %>%
  str_trim() %>%
  as.numeric()

# names ------------------------------------------------------------------------
names <- page %>%
  html_nodes(".titleColumn") %>%
  html_text() %>%
  str_trim() %>%
  str_extract("^(.+?)\\n") %>%
  str_remove("\n")

# tvshows dataframe ------------------------------------------------------------
tvshows <- tibble(
  rank = 1:100,
  name = names,
  year = years,
  score = scores
)

# add new variables ------------------------------------------------------------
tvshows <- tvshows %>%
  mutate(
    genre = NA,
    runtime = NA,
    n_episode = NA,
    keywords = NA
  )

# add new info for first show --------------------------------------------------
tvshows$genre[1] <- "__"
tvshows$runtime[1] <- "___"
tvshows$n_episode[1] <- "___"
tvshows$keywords[[1]] <- c("___", "___", "___", "___", "___")

# add new info for second show --------------------------------------------------
tvshows$genre[2] <- "__"
tvshows$runtime[2] <- "___"
tvshows$n_episode[2] <- "___"
tvshows$keywords[[2]] <- c("___", "___", "___", "___", "___")

# add new info for third show --------------------------------------------------
tvshows$genre[3] <- "__"
tvshows$runtime[3] <- "___"
tvshows$n_episode[3] <- "___"
tvshows$keywords[[3]] <- c("___", "___", "___", "___", "___")
