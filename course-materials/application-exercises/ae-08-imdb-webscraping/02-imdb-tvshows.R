## Scrape the list of most populat TV shows from https://www.imdb.com/chart/tvmeter

# load packages ----------------------------------------------------------------

library(tidyverse)
library(rvest)

# read in http://www.imdb.com/chart/tvmeter ------------------------------------

page <- read_html("___")

# years ------------------------------------------------------------------------

years <- page %>%
  html_nodes("___") %>%
  html_text() %>%
  ___

# scores -----------------------------------------------------------------------

scores <- page %>%
  ___

# names ------------------------------------------------------------------------

names <- ___

# tvshows dataframe ------------------------------------------------------------

tvshows <- tibble(
  rank = 1:100,
  ___,
  ___,
  ___,
  ___
)

# add new variables ------------------------------------------------------------

tvshows <- tvshows %>%
  mutate(
    genre = NA,
    runtime = NA,
    n_episode = NA,
  )

# add new info for first show --------------------------------------------------

tvshows$genre[1] <- "__"
tvshows$runtime[1] <- ___
tvshows$n_episode[1] <- ___

# add new info for second show --------------------------------------------------

tvshows$genre[2] <- "__"
tvshows$runtime[2] <- ___
tvshows$n_episode[2] <- ___

# add new info for third show --------------------------------------------------

tvshows$genre[3] <- "__"
tvshows$runtime[3] <- ___
tvshows$n_episode[3] <- ___
