## Scrape the list of most popular TV shows from https://www.imdb.com/chart/tvmeter

# load packages ----------------------------------------------------------------

library(tidyverse)
library(rvest)

# read in http://www.imdb.com/chart/tvmeter ------------------------------------

page <- read_html("https://www.imdb.com/chart/tvmeter")

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
  as.numeric()

# names ------------------------------------------------------------------------

names <- page %>%
  html_nodes(".titleColumn") %>%
  html_text() %>%
  str_remove_all("\n") %>%
  str_squish()

# tvshows dataframe ------------------------------------------------------------

tvshows <- tibble(
  rank = 1:100,
  name = names,
  year = years,
  score = scores
)

tvshows <- tvshows %>%
  separate(col = name, into = c("name", "other_info"), sep = " \\(", extra = "merge") %>%
  select(-other_info)

# add new variables ------------------------------------------------------------

tvshows <- tvshows %>%
  mutate(
    genre = NA,
    runtime = NA,
    n_episode = NA,
  )

# add new info for first show --------------------------------------------------

tvshows$genre[1] <- "Drama, Horror, Mystery"
tvshows$runtime[1] <- 494
tvshows$n_episode[1] <- 9

# add new info for second show --------------------------------------------------

tvshows$genre[2] <- "Action, Comedy, Crime"
tvshows$runtime[2] <- 60
tvshows$n_episode[2] <- 17

# add new info for third show --------------------------------------------------

tvshows$genre[3] <- "__"
tvshows$runtime[3] <- ___
tvshows$n_episode[3] <- ___
