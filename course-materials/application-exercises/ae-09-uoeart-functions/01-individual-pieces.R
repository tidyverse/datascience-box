# load packages ----------------------------------------------------------------

library(tidyverse)
library(rvest)

# first url --------------------------------------------------------------------

## set url ----
first_info_url <- "https://collections.ed.ac.uk/art/record/22024?highlight=*:*"

## read page at url ----
page <- read_html(first_info_url)

## scrape headers ----
headers <- page %>%
  html_nodes("th") %>%
  html_text()

## scrape values ----
values <- page %>%
  html_nodes("td") %>%
  html_text() %>%
  str_squish()

## put together in a tibble and add link to help keep track ----
tibble(headers, values) %>%
  pivot_wider(names_from = headers, values_from = values) %>%
  add_column(link = first_info_url)


# second url --------------------------------------------------------------------

## set url ----
second_info_url <- "___"

___


# third url --------------------------------------------------------------------

## set url ----
third_info_url <- "___"

___