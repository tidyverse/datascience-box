Lab 05 - Simpson's paradox
================
KEY

``` r
library(tidyverse)
```

    ## ── Attaching packages ────────────────────────── tidyverse 1.2.1 ──

    ## ✔ ggplot2 2.2.1          ✔ purrr   0.2.4     
    ## ✔ tibble  1.4.2          ✔ dplyr   0.7.4.9000
    ## ✔ tidyr   0.7.2          ✔ stringr 1.2.0     
    ## ✔ readr   1.1.1          ✔ forcats 0.2.0

    ## ── Conflicts ───────────────────────────── tidyverse_conflicts() ──
    ## ✖ dplyr::filter() masks stats::filter()
    ## ✖ dplyr::lag()    masks stats::lag()

``` r
library(mosaicData)
```

SAMPLE KEY (FROM LAST SEMESTER, EDIT AS NEEDED)

### 1. What type of study do you think these data come from: observational or experiment? Why?

This data comes from an observational study. For a study to be considered experimental, researchers would need to manipulate the explanatory variable (smoking status) by randomly assigning participants to smoker and non-smoker groups. It is unlikely that participants would agree to being assigned to smoke or not smoke as they are decisions that could potentially affect their health.

### 2. How many observations are in this dataset? What does each observation represent?

There are 1314 observations in this data set. Each observation represents a woman from a mixed urban and rural district near Newcastle, UK. The initial questionnaire was sent between 1972-1974, with a follow up survey regarding health state conducted 20 years later

### 3. How many variables are in this dataset? What type of variable is each? Display each variable using an appropriate visualization.

There are three variables in this dataset: age, smoker (whether they smoked or not), and health outcome (whether they died or not). Age is a numerical variable that can be considered continuous. Smoker and outcome are both considered categorical variables.

``` r
ggplot(Whickham, mapping = aes(x = outcome)) +
  geom_bar(aes(fill = outcome), col = "black") +
  labs( x = "Outcome", y = "Count", title = "Survival Status of Participants 20 Years After Baseline")
```

![](lab-05-simpsons-paradox_files/figure-markdown_github/outcome-viz-1.png)

``` r
ggplot(data = Whickham, mapping = aes(x = age)) +
  geom_histogram(binwidth = 5, colour = "black", fill = "red", alpha = 0.5) +
  labs(x = "Age", y = "Count", title = "Participants' Age at Time of First Survey Grouped by Every 5 Years")
```

![](lab-05-simpsons-paradox_files/figure-markdown_github/age-viz-1.png)

``` r
ggplot(data = Whickham) +
  geom_bar(mapping = aes(x = smoker, fill = smoker), col = "black") +
  labs(title = "Participants' Smoking Status", x = "Smoking Status", y = "Count")
```

![](lab-05-simpsons-paradox_files/figure-markdown_github/smoking-status-viz-1.png)

### 4. What would you expect the relationship between smoking status and health outcome to be?

Due to tobacco's damaging health effects, we would expect that smokers are more likely to die over a 20 year period than non-smokers, all else being equal.

### Question 5

``` r
ggplot(data = Whickham) +
  geom_bar(mapping = aes(x = smoker, fill = outcome), position = "fill", colour = "black") + 
  labs(x = "Smoker Status", y = "Count (%)", fill = "Outcome", title = "Outcomes for Smokers vs. Non-Smokers")
```

![](lab-05-simpsons-paradox_files/figure-markdown_github/smoking-health-viz-1.png)

### Description of 'Outcomes for Smokers vs Non-Smokers' Plot:

This plot shows percentage of participants who died vs those who are still living in each category of smoker status. Surprisingly, the percentage of participants who died was greater for those who were not smokers. Of participants who have never smoked, 31.4% died during the study while only 23.9% of participants who smoked passed away. These results seem quite contrary to what we know of the harmful effects of cigarettes.

``` r
cont_table <- table(Smoker = Whickham$smoker, Outcome = Whickham$outcome)
round(cont_table/rowSums(cont_table), 3)
```

    ##       Outcome
    ## Smoker Alive  Dead
    ##    No  0.686 0.314
    ##    Yes 0.761 0.239

### Q6

``` r
Whickham <- Whickham %>%
  mutate(age_cat = case_when(
    age <= 44            ~ "Ages 18-44",
    age > 44 & age <= 64 ~ "Ages 45-64",
    age > 64             ~ "Ages 65+"
  ))
```

### Q7

``` r
ggplot( data = Whickham)+
  geom_bar(mapping = aes(x = smoker, fill = outcome), position = "fill")+
  facet_grid(.~age_cat) +
  labs(x = "Smoker Status", y = "Count (%)", fill = "Outcome", title = "Outcomes for Smokers vs. Non-Smokers by Age")
```

![](lab-05-simpsons-paradox_files/figure-markdown_github/visualization%20for%20smoking%20status%20for%20health%20outcome%20faceted%20by%20age_cat-1.png)

### Description of 'Outcomes for Smokers vs. Non-Smokers by Age' Plot:

When we faceted by each age\_cat, we found that there were more alive non-smokers than alive smokers in each age group after 10 years. For exaple, within the 45-64 age group about 6% more non-smokers were alive than smokers which was the largest disparity in health outcome between the age groups. This is different from the visualization in Question 5 which shows a higher number of smokers alive than non-smokers in the total population. This is the result of age acting as a confounding variable in this data. When surveying a population, your smoker population will generally be a lot younger than your non-smoker population simply because smokers tend to die prematurely. For example, the smoking population had only 50 total people in its 65+ age group which represented about 8.6% of its population whereas the non-smoking population had 193 total people in its 65+ age group which represented about 26.4% of its population. And since there is a higher proportion of younger people who are alive than dead, this brings the proportion of the general population of smokers who are alive up higher than that of non-smokers. Thus, by faceting by age groups, we eliminated the effect of these different distributions of age in smokers and non-smokers and produced a visualization that more accurately showed the health effects of smoking.

``` r
Whickham %>%
  count(smoker, age_cat, outcome)
```

    ## # A tibble: 12 x 4
    ##    smoker age_cat    outcome     n
    ##    <fct>  <chr>      <fct>   <int>
    ##  1 No     Ages 18-44 Alive     327
    ##  2 No     Ages 18-44 Dead       12
    ##  3 No     Ages 45-64 Alive     147
    ##  4 No     Ages 45-64 Dead       53
    ##  5 No     Ages 65+   Alive      28
    ##  6 No     Ages 65+   Dead      165
    ##  7 Yes    Ages 18-44 Alive     270
    ##  8 Yes    Ages 18-44 Dead       15
    ##  9 Yes    Ages 45-64 Alive     167
    ## 10 Yes    Ages 45-64 Dead       80
    ## 11 Yes    Ages 65+   Alive       6
    ## 12 Yes    Ages 65+   Dead       44
