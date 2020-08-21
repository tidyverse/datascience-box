# load packages ----------------------------------------------------------------

library(unvotes)
library(tidyverse)
library(here)

# unvotes ----------------------------------------------------------------------

unvotes <- un_votes %>%
  mutate(country =
           case_when(
             country == "United Kingdom of Great Britain and Northern Ireland" ~ "UK & NI",
             country == "United States of America"                             ~ "US",
             TRUE                                                              ~ country
           )) %>%
  inner_join(un_roll_calls, by = "rcid") %>%
  inner_join(un_roll_call_issues, by = "rcid")

# save RDS ---------------------------------------------------------------------

saveRDS(unvotes, file = here::here("01-whole-game/data/unvotes.rds"))
