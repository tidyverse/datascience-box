# load packages ----------------------------------------------------------------

library(fs)
library(tidyverse)
library(rmarkdown)
library(xaringan)

# non-xaringan -----------------------------------------------------------------

rmds <- dir_info(recurse = 3, glob = "course-materials/*.Rmd") %>% 
  filter(!str_detect(path, "slides")) %>%
  pull(path)
walk(rmds, render)

# xaringan ---------------------------------------------------------------------

xaringans <- dir_info(recurse = 3, glob = "course-materials/*.Rmd") %>% 
  filter(str_detect(path, "_slides")) %>%
  filter(!str_detect(path, "setup")) %>%
  pull(path)
walk(xaringans, render)
