library(tidyverse)
library(here)

pokemon <- read_csv(here("data","pokemon.csv"))

pokemon %>% 
  filter(species != "Weedle") %>%
  ggplot(aes(x = species, fill = attack_weak)) + 
    geom_bar(position="dodge") + 
    coord_flip() +
    labs(x = "Species", y = "Frequency", fill = "Attack weak",
         title = "Pre-evolution weaker attack of the Pokémon",
         subtitle = "by species") +
    theme_minimal()

ggsave(here("assignments/hw-02/img", "recreate.png"), dpi = 300, height=3, width=7)
