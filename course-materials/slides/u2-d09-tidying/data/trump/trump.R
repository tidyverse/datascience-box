# load packages ----------------------------------------------------------------

library(tidyverse)
library(here)
library(lubridate)

# load data --------------------------------------------------------------------

trump_raw <- read_csv(here::here("week-03/w3-d06-tidying/data","trump/approval_topline.csv"))

# prep -------------------------------------------------------------------------

trump <- trump_raw %>%
  filter(subgroup != "All polls") %>%
  mutate(date = mdy(modeldate)) %>%
  select(subgroup, date, contains("estimate")) %>%
  rename(
    approval = approve_estimate,
    disapproval = disapprove_estimate
  )

write_csv(trump, path = here::here("week-03/w3-d06-tidying/data","trump/trump.csv"))

# plot -------------------------------------------------------------------------

trump_longer <- trump %>%
  pivot_longer(
    cols = c(approval, disapproval),
    names_to = "rating_type",
    values_to = "rating_value"
  )

ggplot(trump_longer, aes(x = date, y = rating_value, color = rating_type, group = rating_type)) +
  geom_line() +
  facet_wrap(~ subgroup) +
  scale_color_manual(values = c("darkgreen", "orange")) +
  labs(
    x = "Date",
    y = "Rating",
    color = NULL,
    title = "How (un)popular is Donald Trump?",
    subtitle = "Estimates based on polls of all adults and polls of likely or registered voters",
    caption = "Source: FiveThirtyEight modeling estimates"
  ) +
  theme_minimal() +
  theme(
    legend.position = "bottom"
  )
