# load packages ----------------------------------------------------------------

library(tidyverse)
library(here)
library(janitor)

# load data --------------------------------------------------------------------

waste_vs_gdp <- read_csv(here("static/labs/lab-02/data/raw-data/", "waste-vs-gdp.csv"))
mismanaged_vs_gdp <- read_csv(here("static/labs/lab-02/data/raw-data/", "mismanaged_vs_gdp.csv"))
coast_vs_waste <- read_csv(here("static/labs/lab-02/data/raw-data/", "coast_vs_waste.csv"))

# waste_vs_gdp -----------------------------------------------------------------

names(waste_vs_gdp) <- c(
  "entity",
  "code",
  "year",
  "plastic_waste_per_cap",
  "gdp_per_cap",
  "total_pop"
)

# mismanaged_vs_gdp ------------------------------------------------------------

names(mismanaged_vs_gdp) <- c(
  "entity",
  "code",
  "year",
  "mismanaged_plastic_waste_per_cap",
  "gdp_per_cap",
  "total_pop" 
)

# coast_vs_waste ---------------------------------------------------------------

names(coast_vs_waste) <- c(
  "entity",
  "code",
  "year",
  "mismanaged_plastic_waste",
  "coastal_pop",
  "total_pop"
)

# create IDs -------------------------------------------------------------------

waste_vs_gdp <- waste_vs_gdp %>% mutate(id = paste0(code, year))
mismanaged_vs_gdp <- mismanaged_vs_gdp %>% filter(!is.na(code)) %>% mutate(id = paste0(code, year))
coast_vs_waste <- coast_vs_waste %>% mutate(id = paste0(code, year))

# join -------------------------------------------------------------------------

plastic_waste_raw <- full_join(waste_vs_gdp, mismanaged_vs_gdp, by = "id") %>%
  full_join(coast_vs_waste, by = "id")

plastic_waste <- plastic_waste_raw %>%
  select(code, entity, year, gdp_per_cap.x, 
         plastic_waste_per_cap, mismanaged_plastic_waste_per_cap, mismanaged_plastic_waste,
         coastal_pop, total_pop) %>%
  rename(
    gdp_per_cap = gdp_per_cap.x
  ) %>%
  filter(year >= 2010)

# continent --------------------------------------------------------------------

continent <- read_csv(here("static/labs/lab-02/data/raw-data/", "country-and-continent-codes-list-csv_csv.csv")) %>%
  select(Three_Letter_Country_Code, Continent_Name) %>%
  rename(
    code = Three_Letter_Country_Code,
    continent = Continent_Name
  )

plastic_waste <- left_join(plastic_waste, continent, by = c("code")) %>%
  select(code, entity, continent, everything()) %>%
  filter(
    !is.na(continent),
    year == 2010
  )

# save -------------------------------------------------------------------------

write_csv(plastic_waste, path = here("static/labs/lab-02/data/", "plastic-waste.csv"))
