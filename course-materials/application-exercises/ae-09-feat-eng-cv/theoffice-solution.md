The Office
================
Mine Çetinkaya-Rundel

``` r
library(tidyverse)
library(tidymodels)
library(schrute)
library(lubridate)
```

Use `theoffice` data from the
[**schrute**](https://bradlindblad.github.io/schrute/) package to
predict IMDB scores for episodes of The Office.

``` r
glimpse(theoffice)
```

    ## Rows: 55,130
    ## Columns: 12
    ## $ index            <int> 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1…
    ## $ season           <int> 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1…
    ## $ episode          <int> 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1…
    ## $ episode_name     <chr> "Pilot", "Pilot", "Pilot", "Pilot", "Pilot", "Pilot"…
    ## $ director         <chr> "Ken Kwapis", "Ken Kwapis", "Ken Kwapis", "Ken Kwapi…
    ## $ writer           <chr> "Ricky Gervais;Stephen Merchant;Greg Daniels", "Rick…
    ## $ character        <chr> "Michael", "Jim", "Michael", "Jim", "Michael", "Mich…
    ## $ text             <chr> "All right Jim. Your quarterlies look very good. How…
    ## $ text_w_direction <chr> "All right Jim. Your quarterlies look very good. How…
    ## $ imdb_rating      <dbl> 7.6, 7.6, 7.6, 7.6, 7.6, 7.6, 7.6, 7.6, 7.6, 7.6, 7.…
    ## $ total_votes      <int> 3706, 3706, 3706, 3706, 3706, 3706, 3706, 3706, 3706…
    ## $ air_date         <fct> 2005-03-24, 2005-03-24, 2005-03-24, 2005-03-24, 2005…

Fix `air_date` for later use.

``` r
theoffice <- theoffice %>%
  mutate(air_date = ymd(as.character(air_date)))
```

We will

-   engineer features based on episode scripts
-   train a model
-   perform cross validation
-   make predictions

Note: The episodes listed in `theoffice` don’t match the ones listed in
the data we used in the [cross validation
lesson](https://ids-s1-20.github.io/slides/week-10/w10-d02-cross-validation/w10-d02-cross-validation.html).

``` r
theoffice %>%
  distinct(season, episode)
```

    ## # A tibble: 186 x 2
    ##    season episode
    ##     <int>   <int>
    ##  1      1       1
    ##  2      1       2
    ##  3      1       3
    ##  4      1       4
    ##  5      1       5
    ##  6      1       6
    ##  7      2       1
    ##  8      2       2
    ##  9      2       3
    ## 10      2       4
    ## # … with 176 more rows

### Exercise 1 - Calculate the percentage of lines spoken by Jim, Pam, Michael, and Dwight for each episode of The Office.

``` r
office_lines <- theoffice %>%
  group_by(season, episode) %>%
  mutate(
    n_lines = n(),
    lines_jim = sum(character == "Jim") / n_lines,
    lines_pam = sum(character == "Pam") / n_lines,
    lines_michael = sum(character == "Michael") / n_lines,
    lines_dwight = sum(character == "Dwight") / n_lines,
  ) %>%
  ungroup() %>%
  select(season, episode, episode_name, contains("lines_")) %>%
  distinct(season, episode, episode_name, .keep_all = TRUE)
```

### Exercise 2 - Identify episodes that touch on Halloween, Valentine’s Day, and Christmas.

``` r
theoffice <- theoffice %>%
  mutate(text = tolower(text))

halloween_episodes <- theoffice %>%
  filter(str_detect(text, "halloween")) %>% 
  count(episode_name) %>%
  filter(n > 1) %>%
  mutate(halloween = 1) %>%
  select(-n)

valentine_episodes <- theoffice %>%
  filter(str_detect(text, "valentine")) %>% 
  count(episode_name) %>%
  filter(n > 1) %>%
  mutate(valentine = 1) %>%
  select(-n)

christmas_episodes <- theoffice %>%
  filter(str_detect(text, "christmas")) %>% 
  count(episode_name) %>%
  filter(n > 1) %>%
  mutate(christmas = 1) %>%
  select(-n)
```

### Exercise 3 - Put together a modeling dataset that includes features you’ve engineered. Also add an indicator variable called `michael` which takes the value `1` if Michael Scott (Steve Carrell) was there, and `0` if not. Note: Michael Scott (Steve Carrell) left the show at the end of Season 7.

``` r
office_df <- theoffice %>%
  select(season, episode, episode_name, imdb_rating, total_votes, air_date) %>%
  distinct(season, episode, .keep_all = TRUE) %>%
  left_join(halloween_episodes, by = "episode_name") %>% 
  left_join(valentine_episodes, by = "episode_name") %>% 
  left_join(christmas_episodes, by = "episode_name") %>% 
  replace_na(list(halloween = 0, valentine = 0, christmas = 0)) %>%
  mutate(michael = if_else(season > 7, 0, 1)) %>%
  mutate(across(halloween:michael, as.factor)) %>%
  left_join(office_lines, by = c("season", "episode", "episode_name"))
```

### Exercise 4 - Split the data into training (75%) and testing (25%).

``` r
set.seed(1122)
office_split <- initial_split(office_df)
office_train <- training(office_split)
office_test <- testing(office_split)
```

### Exercise 5 - Specify a linear regression model.

``` r
office_mod <- linear_reg() %>%
  set_engine("lm")
```

### Exercise 6 - Create a recipe that updates the role of `episode_name` to not be a predictor, removes `air_date` as a predictor, and removes all zero variance predictors.

``` r
office_rec <- recipe(imdb_rating ~ ., data = office_train) %>%
  update_role(episode_name, new_role = "id") %>%
  step_rm(air_date) %>%
  step_dummy(all_nominal(), -episode_name) %>%
  step_zv(all_predictors())
```

### Exercise 7 - Build a workflow for fitting the model specified earlier and using the recipe you developed to preprocess the data.

``` r
office_wflow <- workflow() %>%
  add_model(office_mod) %>%
  add_recipe(office_rec)
```

### Exercise 8 - Fit the model to training data and interpret a couple of the slope coefficients.

``` r
office_fit <- office_wflow %>%
  fit(data = office_train)

tidy(office_fit)
```

    ## # A tibble: 12 x 5
    ##    term           estimate std.error statistic  p.value
    ##    <chr>             <dbl>     <dbl>     <dbl>    <dbl>
    ##  1 (Intercept)    6.39     0.323      19.8     9.73e-41
    ##  2 season         0.0423   0.0240      1.76    8.03e- 2
    ##  3 episode        0.0118   0.00427     2.77    6.47e- 3
    ##  4 total_votes    0.000512 0.0000625   8.19    2.32e-13
    ##  5 lines_jim      0.629    0.664       0.946   3.46e- 1
    ##  6 lines_pam     -0.00587  0.717      -0.00818 9.93e- 1
    ##  7 lines_michael -0.743    0.623      -1.19    2.35e- 1
    ##  8 lines_dwight   0.348    0.545       0.639   5.24e- 1
    ##  9 halloween_X1  -0.183    0.180      -1.01    3.12e- 1
    ## 10 valentine_X1  -0.120    0.158      -0.759   4.49e- 1
    ## 11 christmas_X1   0.246    0.137       1.79    7.56e- 2
    ## 12 michael_X1     0.598    0.166       3.61    4.43e- 4

### Exercise 9 - Perform 5-fold cross validation and view model performance metrics.

``` r
set.seed(345)
folds <- vfold_cv(office_train, v = 5)
folds
```

    ## #  5-fold cross-validation 
    ## # A tibble: 5 x 2
    ##   splits           id   
    ##   <list>           <chr>
    ## 1 <split [112/28]> Fold1
    ## 2 <split [112/28]> Fold2
    ## 3 <split [112/28]> Fold3
    ## 4 <split [112/28]> Fold4
    ## 5 <split [112/28]> Fold5

``` r
set.seed(456)
office_fit_rs <- office_wflow %>%
  fit_resamples(folds)

collect_metrics(office_fit_rs)
```

    ## # A tibble: 2 x 6
    ##   .metric .estimator  mean     n std_err .config             
    ##   <chr>   <chr>      <dbl> <int>   <dbl> <chr>               
    ## 1 rmse    standard   0.362     5  0.0226 Preprocessor1_Model1
    ## 2 rsq     standard   0.553     5  0.0782 Preprocessor1_Model1

### Exercise 10 - Use your model to make predictions for the testing data and calculate the RMSE. Also use the model developed in the [cross validation lesson](https://ids-s1-20.github.io/slides/week-10/w10-d02-cross-validation/w10-d02-cross-validation.html) to make predictions for the testing data and calculate the RMSE as well. Which model did a better job in predicting IMDB scores for the testing data?

#### New model

``` r
office_test_pred <- predict(office_fit, new_data = office_test) %>%
  bind_cols(office_test %>% select(imdb_rating, episode_name))

rmse(office_test_pred, truth = imdb_rating, estimate = .pred)
```

    ## # A tibble: 1 x 3
    ##   .metric .estimator .estimate
    ##   <chr>   <chr>          <dbl>
    ## 1 rmse    standard       0.444

#### Old model

``` r
office_mod_old <- linear_reg() %>%
  set_engine("lm")

office_rec_old <- recipe(imdb_rating ~ season + episode + total_votes + air_date, data = office_train) %>%
  # extract month of air_date
  step_date(air_date, features = "month") %>%
  step_rm(air_date) %>%
  # make dummy variables of month 
  step_dummy(contains("month")) %>%
  # remove zero variance predictors
  step_zv(all_predictors())

office_wflow_old <- workflow() %>%
  add_model(office_mod_old) %>%
  add_recipe(office_rec_old)

office_fit_old <- office_wflow_old %>%
  fit(data = office_train)

tidy(office_fit_old)
```

    ## # A tibble: 12 x 5
    ##    term                estimate std.error statistic  p.value
    ##    <chr>                  <dbl>     <dbl>     <dbl>    <dbl>
    ##  1 (Intercept)         6.50     0.234        27.7   5.68e-56
    ##  2 season             -0.0240   0.0156       -1.54  1.27e- 1
    ##  3 episode             0.0524   0.00841       6.23  6.12e- 9
    ##  4 total_votes         0.000538 0.0000585     9.19  8.92e-16
    ##  5 air_date_month_Feb -0.0927   0.119        -0.778 4.38e- 1
    ##  6 air_date_month_Mar -0.249    0.133        -1.87  6.36e- 2
    ##  7 air_date_month_Apr -0.238    0.124        -1.92  5.70e- 2
    ##  8 air_date_month_May -0.192    0.154        -1.25  2.14e- 1
    ##  9 air_date_month_Sep  0.660    0.161         4.11  7.02e- 5
    ## 10 air_date_month_Oct  0.463    0.128         3.62  4.27e- 4
    ## 11 air_date_month_Nov  0.368    0.122         3.00  3.20e- 3
    ## 12 air_date_month_Dec  0.368    0.145         2.54  1.23e- 2

``` r
office_test_pred_old <- predict(office_fit_old, new_data = office_test) %>%
  bind_cols(office_test %>% select(imdb_rating, episode_name))

rmse(office_test_pred_old, truth = imdb_rating, estimate = .pred)
```

    ## # A tibble: 1 x 3
    ##   .metric .estimator .estimate
    ##   <chr>   <chr>          <dbl>
    ## 1 rmse    standard       0.498
