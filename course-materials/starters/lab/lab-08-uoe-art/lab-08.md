Lab 08 - University of Edinburgh Art Collection
================
Insert your name here
Insert date here

### Load packages and data

``` r
library(tidyverse) 
library(skimr)
```

``` r
# Remove eval = FALSE or set it to TRUE once data is ready to be loaded
uoe_art <- read_csv("data/uoe-art.csv")
```

### Exercise 9

``` r
uoe_art <- uoe_art %>%
  separate(title, into = c("title", "date"), sep = "\\(") %>%
  mutate(year = str_remove(date, "\\)") %>% as.numeric()) %>%
  select(title, artist, year, ___)
```

    ## Error: <text>:4:31: unexpected input
    ## 3:   mutate(year = str_remove(date, "\\)") %>% as.numeric()) %>%
    ## 4:   select(title, artist, year, _
    ##                                  ^

### Exercise 10

Remove this text, and add your answer for Exercise 1 here. Add code
chunks as needed. Don’t forget to label your code chunk. Do not use
spaces in code chunk labels.

### Exercise 11

…

Add exercise headings as needed.
