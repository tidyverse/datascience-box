set.seed(1015)

options(
  digits = 3,
  dplyr.print_min = 6,
  dplyr.print_max = 6
)

knitr::opts_chunk$set(
  comment = "#>",
  collapse = TRUE,
  cache = TRUE,
  out.width = "70%",
  fig.align = "center",
  fig.width = 6,
  fig.asp = 0.618, # 1 / phi
  fig.show = "hold"
)

suppressMessages(
  library(knitr)
)
