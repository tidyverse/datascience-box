# (0) show-and-tell ----

## Still need to figure out
## - Experience with bookdown within repo, or other bookdown things?
## - Embed slides in bookdown with an iframe-like thing?

# (1) html_node vs. html_nodes ----

library(rvest)
library(tidyverse)

## urls
godofwar_ps4 <- "http://www.metacritic.com/game/playstation-4/god-of-war"
celeste_xbox <- "http://www.metacritic.com/game/xbox-one/celeste"
celeste_switch <-  "http://www.metacritic.com/game/switch/celeste"

urls <- c(godofwar_ps4, celeste_xbox, celeste_switch)

## fn to scrape game pages
scrape_game_page <- function(url){
  
  gamepage <- read_html(url)
  
  metascore_critic_counts <- gamepage %>%
    html_node(".highlight_metascore .count a") %>%
    html_text() %>%
    str_replace(" Critics", "") %>%
    str_replace_all("\n", "") %>%
    str_trim() %>%
    as.numeric()
  
  userscore_rating_counts <- gamepage %>%
    html_node(".feature_userscore .summary .count") %>%
    html_text() %>%
    str_replace("- based on ", "") %>%
    str_replace(" Ratings", "")
  
  #Sys.sleep(rexp(1, 1/2) + 1)
  
  tibble(
    url = url,
    metascore_critic_count = metascore_critic_counts,
    userscore_rating_count = userscore_rating_counts
  )

}

## test fn
scrape_game_page(godofwar_ps4)
scrape_game_page(celeste_xbox)
scrape_game_page(celeste_switch)

map_df(urls, scrape_game_page)

## modify fn to use html_nodes
scrape_game_page_buggy <- function(url){
  
  gamepage <- read_html(url)
  
  metascore_critic_counts <- gamepage %>%
    html_nodes(".highlight_metascore .count a") %>%
    html_text() %>%
    str_replace(" Critics", "") %>%
    str_replace_all("\n", "") %>%
    str_trim() %>%
    as.numeric()
  
  userscore_rating_counts <- gamepage %>%
    html_nodes(".feature_userscore .summary .count") %>%
    html_text() %>%
    str_replace("- based on ", "") %>%
    str_replace(" Ratings", "") %>%
    as.numeric()
  
  #Sys.sleep(rexp(1, 1/2) + 1)
  
  tibble(
    url = url,
    metascore_critic_count = metascore_critic_counts,
    userscore_rating_count = userscore_rating_counts
  )
  
}

scrape_game_page_buggy(godofwar_ps4)
scrape_game_page_buggy(celeste_xbox)
scrape_game_page_buggy(celeste_switch)

map_df(urls, scrape_game_page_buggy)

# (2) debugging with print(i) ----

## (2a) map method

games <- read_csv("games.csv")

### at some point fails with 429 error but can't tell where
more_game_info <- map_df(games$url, scrape_game_page) 

## (2b) for loop method

n <- nrow(games)

more_game_info <- tibble(
  url = games$url,
  metascore_critic_count = rep(NA, n),
  userscore_rating_count = rep(NA, n)
)

### we know when it fails, and data up to that point is saved
for(i in 1:n){
  
  gamepage <- read_html(more_game_info$url[i])
  
  more_game_info$metascore_critic_count[i] <- gamepage %>%
    html_node(".highlight_metascore .count a") %>%
    html_text() %>%
    str_replace(" Critics", "") %>%
    str_replace_all("\n", "") %>%
    str_trim() %>%
    as.numeric()
  
  more_game_info$userscore_rating_count[i] <- gamepage %>%
    html_node(".feature_userscore .summary .count") %>%
    html_text() %>%
    str_replace("- based on ", "") %>%
    str_replace(" Ratings", "") %>%
    as.numeric()
  
  print(i)
}

## (2c) possibly
more_game_info <- map_df(games$url, possibly(scrape_game_page, otherwise = NULL)) 

## (2d) progress bar?

# (3) inference ----

## `generate` resamples, permutations, or simulations
## but generation is a type of simulation

library(infer)

mtcars <- mtcars %>%
  mutate(cyl = factor(cyl),
         vs = factor(vs),
         am = factor(am),
         gear = factor(gear),
         carb = factor(carb))

## One numerical variable (mean)
mtcars %>%
  specify(response = mpg) %>% # formula alt: mpg ~ NULL
  hypothesize(null = "point", mu = 25) %>% 
  generate(reps = 100, type = "bootstrap") %>% 
  calculate(stat = "mean")

mtcars %>%
  specify(response = mpg) %>% # formula alt: mpg ~ NULL
  #hypothesize(null = "point", mu = 25) %>% 
  generate(reps = 100, type = "bootstrap") %>% 
  calculate(stat = "mean")

## One categorical (2 level) variable
mtcars %>%
  specify(response = am, success = "1") %>% # formula alt: am ~ NULL
  hypothesize(null = "point", p = .25) %>% 
  generate(reps = 100, type = "simulate") %>% 
  calculate(stat = "prop")

## Two categorical (2 level) variables
mtcars %>%
  specify(am ~ vs, success = "1") %>% # alt: response = am, explanatory = vs
  hypothesize(null = "independence") %>%
  generate(reps = 100, type = "permute") %>%
  calculate(stat = "diff in props", order = c("0", "1"))

# (4) conditional probabilities ----

## calculate P(dep_delayed | origin) 

library(nycflights13)

flights <- flights %>%
  mutate(dep_delayed = ifelse(dep_delay > 0, "delayed", "ontime"))

### (4a) count 
flights %>%
  filter(!is.na(dep_delay)) %>%
  count(origin, dep_delayed) %>%
  group_by(origin) %>%
  mutate(prop_delayed = n / sum(n)) %>%
  filter(dep_delayed == "delayed") %>%
  arrange(prop_delayed) 

### (4b) group_by
flights %>%
  filter(!is.na(dep_delay)) %>%
  group_by(origin, dep_delayed) %>%
  summarise(n = n()) %>%
  mutate(prop_delayed = n / sum(n)) %>%
  filter(dep_delayed == "delayed") %>%
  arrange(prop_delayed)


flights <- flights %>%
  mutate(dep_delayed = ifelse(dep_delay > 0, "delayed", "ontime"))

flights %>%
  filter(!is.na(dep_delay)) %>%
  group_by(origin, dep_delayed) %>%
  summarise(n = n()) %>%
  mutate(prop_delayed = n / sum(n)) %>%
  filter(dep_delayed == "delayed") %>%
  arrange(prop_delayed)

flights %>%
  count(origin) %>%
  mutate(prop_origin = n / sum(n)) %>%
  filter(origin == "EWR") %>%
  pull()
