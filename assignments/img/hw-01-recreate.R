library(tidyverse)

pokemon <- read_csv("..data/pokemon.csv")

pokemon %>% 
  filter(species != "Weedle") %>%
  ggplot(aes(x = species, fill = attack_weak)) + 
    geom_bar(position="dodge") + 
    coord_flip() +
    labs(x = "Species", y = "Frequency", fill = "Attack weak",
         title = "Pre-evolution weaker attack of the Pokémon",
         subtitle = "by species") +
    theme_minimal()

ggsave("02-hw-recreate.png", dpi = 300, height=3, width=7)
