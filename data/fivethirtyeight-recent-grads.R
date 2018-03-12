library(tidyverse)
library(janitor)
library(fivethirtyeight)

# Read data from 538
d <- read_csv("https://raw.githubusercontent.com/fivethirtyeight/data/master/college-majors/recent-grads.csv") %>%
  clean_names() %>%
  rename(
    employed_fulltime = full_time,
    employed_parttime = part_time,
    employed_fulltime_yearround = full_time_year_round
    ) %>%
  mutate(major = str_title_case(str_lower_case(major)))

d <- d %>%
  select(names(college_recent_grads))

write_csv(d, path = "static/labs/data/recent-grads.csv")
