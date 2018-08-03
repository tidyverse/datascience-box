library(tidyverse)
library(here)

bike <- read_csv(here("data","bikeshare-day.csv"))

bike %>%
  mutate(atemp_raw = atemp * 50) %>%
  ggplot(mapping = aes(x = dteday, y = cnt, color = atemp_raw)) +
  geom_point(alpha = 0.7) +
  labs(
    title = "Bike rentals in DC, 2011 and 2012",
    subtitle = "Warmer temperatures associated with more bike rentals",
    x = "Date",
    y = "Bike renrals",
    color = "Temperature (C)"
  ) +
  theme_minimal()

ggsave(here("assignments/hw-03/img", "recreate.png"), 
       dpi = 300, height = 3, width = 7)
