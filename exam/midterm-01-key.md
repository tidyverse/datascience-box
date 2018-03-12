KEY: Midterm 01
================

Academic Honesty Statement
--------------------------

**THIS IS AN INDIVIDUAL ASSESSMENT, THIS DOCUMENT AND YOUR ANSWERS ARE FOR YOUR EYES ONLY. ANY VIOLATION OF THIS POLICY WILL BE IMMEDIATELY REPORTED TO THE UNDERGRADUATE CONDUCT BOARD.**

*Replace the underscores below with your name acknowledging that you have read and understood the your institution's academic community standard.*

I, \_\_\_\_\_\_\_\_\_\_\_\_, hereby state that I have not communicated with or gained information in any way from my classmates or anyone other than the Professor or TA during this exam, and that all work is my own.

Load packages
-------------

``` r
library(tidyverse)
library(nycflights13)
```

Questions
---------

### Question 1

**What are the ten most common destinations for flights from NYC airports in 2013? Make a table that lists these in descending order and shows the number of fligts heading to each airport.**

``` r
flights %>%
  count(dest) %>%
  arrange(desc(n)) %>%
  slice(1:10)
```

    ## # A tibble: 10 x 2
    ##    dest      n
    ##    <chr> <int>
    ##  1 ORD   17283
    ##  2 ATL   17215
    ##  3 LAX   16174
    ##  4 BOS   15508
    ##  5 MCO   14082
    ##  6 CLT   14064
    ##  7 SFO   13331
    ##  8 FLL   12055
    ##  9 MIA   11728
    ## 10 DCA    9705

### Question 2

**Which airlines have the most flights departing from NYC airports in 2013? Make a table that lists these in descending order of frequency and shows the number of flights for each airline. In your narrative mention the names of the airlines as well. *Hint:* You can use the `airlines` dataset to look up the airline name based on `carrier` code.**\*

``` r
flights %>%
  count(carrier) %>%
  arrange(desc(n)) %>%
  inner_join(airlines, by = "carrier")
```

    ## # A tibble: 16 x 3
    ##    carrier     n name                       
    ##    <chr>   <int> <chr>                      
    ##  1 UA      58665 United Air Lines Inc.      
    ##  2 B6      54635 JetBlue Airways            
    ##  3 EV      54173 ExpressJet Airlines Inc.   
    ##  4 DL      48110 Delta Air Lines Inc.       
    ##  5 AA      32729 American Airlines Inc.     
    ##  6 MQ      26397 Envoy Air                  
    ##  7 US      20536 US Airways Inc.            
    ##  8 9E      18460 Endeavor Air Inc.          
    ##  9 WN      12275 Southwest Airlines Co.     
    ## 10 VX       5162 Virgin America             
    ## 11 FL       3260 AirTran Airways Corporation
    ## 12 AS        714 Alaska Airlines Inc.       
    ## 13 F9        685 Frontier Airlines Inc.     
    ## 14 YV        601 Mesa Airlines Inc.         
    ## 15 HA        342 Hawaiian Airlines Inc.     
    ## 16 OO         32 SkyWest Airlines Inc.

The carrier with the highest number of flights departing from NYC airports in 2013 is United Airlines, followed by JetBlue Airways and ExpressJet Airlines.

### Question 3

**Consider only flights that have non-missing arrival delay information. Your answer should include the name of the carrier in addition to the carrier code and the values asked. (1a) Which carrier had the highest mean arrival delay?(1b) Which carrier had the lowest mean arrival delay? Make sure that your answer includes the name of the carrier and the calculated mean delay.**

``` r
flights %>%
  filter(!is.na(arr_delay)) %>%
  group_by(carrier) %>%
  summarise(mean_arr_delay = mean(arr_delay)) %>%
  arrange(desc(mean_arr_delay)) %>%
  inner_join(airlines, by = "carrier") %>%
  slice(c(1, n()))
```

    ## # A tibble: 2 x 3
    ##   carrier mean_arr_delay name                  
    ##   <chr>            <dbl> <chr>                 
    ## 1 F9               21.9  Frontier Airlines Inc.
    ## 2 AS               -9.93 Alaska Airlines Inc.

Highest mean arrival delay was on Frontier Airlines with 21.9 minutes, and lowest mean was on Alaska Airlines with -9.93 minutes (which means 9.93 minutes early on average).

### Question 4

**What was the mean temperature at the origin airport on the day with the highest departure delay? Your answer should include the name of origin airport, the date with the highest departure delay, and the mean temperature on that day.**

``` r
flights %>%
  arrange(desc(dep_delay)) %>%
  slice(1) %>%
  select(dep_delay, month, day, origin)
```

    ## # A tibble: 1 x 4
    ##   dep_delay month   day origin
    ##       <dbl> <int> <int> <chr> 
    ## 1     1301.     1     9 JFK

The highest departure delay of 1301 minutes (approx 21.7 hours) was on a flight departing from JFK on Jan 9.

``` r
weather %>%
  filter(month == 1, day == 9, origin == "JFK") %>%
  summarise(mean_temp = mean(temp))
```

    ## # A tibble: 1 x 1
    ##   mean_temp
    ##       <dbl>
    ## 1      40.8

The average temperature on this day was 40.835 F.

### Question 5

**Consider breaking the day into four time intervals: 12:01am-6am, 6:01am-12pm, 12:01pm-6pm, 6:01pm-12am. (a) Calculate the proportion of flights that are delayed at departure at each of these time intervals. (b) Comment on how the likelihood of being delayed change throughout the day?**

``` r
# Create time of day variable
flights <- flights %>%
  mutate(time_of_day = case_when(
    sched_dep_time >= 001  & sched_dep_time <= 600  ~ "12:01am-6am",
    sched_dep_time >= 601  & sched_dep_time <= 1200 ~ "6:01am-12pm",
    sched_dep_time >= 1201 & sched_dep_time <= 1800 ~ "12:01pm-6pm",
    sched_dep_time >= 1801                          ~ "6:01pm-12am"
  ))

# Find proportion of delayed flights for each time of day
flights %>%
  filter(!is.na(dep_delay)) %>%
  mutate(dep_delayed = ifelse(dep_delay > 0, "delayed", "ontime")) %>%
  count(time_of_day, dep_delayed) %>%
  group_by(time_of_day) %>%
  mutate(prop_delayed = n / sum(n)) %>%
  filter(dep_delayed == "delayed") %>%
  arrange(prop_delayed)
```

    ## # A tibble: 4 x 4
    ## # Groups:   time_of_day [4]
    ##   time_of_day dep_delayed     n prop_delayed
    ##   <chr>       <chr>       <int>        <dbl>
    ## 1 12:01am-6am delayed      1819        0.207
    ## 2 6:01am-12pm delayed     32466        0.260
    ## 3 12:01pm-6pm delayed     58325        0.463
    ## 4 6:01pm-12am delayed     35822        0.520

1.  Approx 21% of flights are delayed between midnight and 6am, 26% of flights are delayed between 6am and noon, 46% of flights are delayed between noon and 6pm, and 52% of flights are delayed between 6pm and midnight.
2.  As the day progresses, the likelihood of being delayed at departure increases.

### Question 6

**Find the flight with the longest air time. (a) How long is this flight? (b) What city did it fly to? (c) How many seats does the plane that flew this flight have?**

``` r
flights %>%
  arrange(desc(air_time)) %>%
  slice(1) %>%
  select(air_time, dest, tailnum) %>%
  inner_join(planes, by = "tailnum") %>%
  select(air_time, dest, tailnum, seats)
```

    ## # A tibble: 1 x 4
    ##   air_time dest  tailnum seats
    ##      <dbl> <chr> <chr>   <int>
    ## 1     695. HNL   N77066    292

1.  The flight time is 695 minutes (11.58 hours).
2.  Flight was to Honolulu.
3.  Plane that flew this flight has 292 seats.

### Question 7

**The `airports` data frame contains information on a large number of primarily American airports. These data include location information for these airports in the form of latitude and longitude coordinates. In this question we limit our focus to the [Contiguous United States](https://en.wikipedia.org/wiki/Contiguous_United_States). Visualize and describe the distribution of the longitudes of airports in the Contiguous United States. What does this tell you about the geographical distribution of these airports? *Hint:* You will first need to limit your analysis to the Contiguous United States. [This Wikipedia article](https://en.wikipedia.org/wiki/List_of_extreme_points_of_the_United_States) can help, but you're welcomed to use other resources as well. Make sure to cite whatever resource you use.**

Based on information from [this Wikipedia article](https://en.wikipedia.org/wiki/List_of_extreme_points_of_the_United_States) as well as [this conversion site](https://www.vercalendario.info/en/how/convert-latitude-longitude-degrees-decimals.html), we use the following points as the boundaries of the 48 Contiguous United States:

-   Northernmost point in the 48 contiguous states: Northwest Angle Inlet in Lake of the Woods, Minnesota 49°23′04.1″N 95°9′12.2″W
    -   lat: 49.38447222222222
    -   lon: -95.1533888888889
-   Southernmost point in the 48 contiguous states continuously above water: Ballast Key, Florida (24°31′15″N 81°57′49″W)
    -   lat: 24.520833333333332
    -   lon: -81.96361111111112
-   Westernmost point in the 48 contiguous states continuously above water: Bodelteh Islands, offshore from Cape Alava, Washington 48°10′42.7″N 124°46′18.1″W
    -   lat: 48.178527777777774
    -   lon: -124.77169444444445
-   Easternmost point in the 50 states: Sail Rock, Maine 44°48′45.2″N 66°56′49.3″W
    -   lat: 44.812555555555555
    -   lon: -66.94702777777778

``` r
airports %>%
  filter(
    lat > 24.520833333333332 & lat < 49.38447222222222,
    lon > -124.77169444444445 & lon < -66.94702777777778
  ) %>%
  ggplot(aes(x = lon)) +
    geom_histogram(binwidth = 5)
```

![](midterm-01-key_files/figure-markdown_github/unnamed-chunk-8-1.png)

The distribution of longitudes is bimodal. One of the modes is at latitude -120, correspomding to the West Coast and the other is around latitude -85 corresponding to the midtwest.

### Question 8

**Recreate the plot included below using the `flights` data. Once you have created the visualization, in no more than one paragraph, describe what you think the point of this visualization might be. *Hint:* The visualization uses the variable `arrival`, which is not included in the `flights` data frame. You will have to create `arrival` yourself, it is a categorical variable that is equal to `"ontime"` when `arr_delay <= 0` and `"delayed"` when `arr_delay > 0`.**

``` r
flights %>% 
  filter(month == 12, dest %in% c("PHL", "RDU")) %>% 
  mutate(arrival = ifelse(arr_delay > 0, "delayed", "ontime")) %>%
  filter(!is.na(arrival)) %>%
  ggplot(aes(x = arrival, y = dep_delay, color = dest)) + 
    geom_boxplot() + 
    facet_grid(dest ~ origin) + 
    labs(title = "On time performance of NYC flights",
         subtitle = "December 2013",
         x = "Arrival",
         y = "Departure delay",
         color = "Destination")
```

![](midterm-01-key_files/figure-markdown_github/unnamed-chunk-9-1.png)

### Extra Credit

**Create a visualization that effectively shows if there is a relationship between the average daily departure delay and the average daily temperature for all three New York city airports. Your answer must be given in a single pipe. (You should only spend time on this question once you have finished answering the others)**

``` r
flights_weather <- inner_join(flights, weather, by = c("year", "month", "day", "origin",
                                                       "hour")) %>%
  group_by(month, day, origin) %>%
  summarise(avg_dep_delay = mean(dep_delay, na.rm = TRUE),
            avg_temp = mean(temp, na.rm = TRUE))

ggplot(flights_weather, aes(x = avg_temp, y = avg_dep_delay)) +
  geom_point(alpha = 0.3) +
  facet_wrap(~ origin) +
  labs(x = "Average Temperature", y = "Average Delay (min)")
```

![](midterm-01-key_files/figure-markdown_github/ec-1.png)

For each of the airports, we plot the relationship between average daily departure delay and average daily temperature.

### Style and organization

In this category we looked for a variety of features, including, but not limited to the following:

-   Content:
    -   References cited
    -   Questions answered in order
    -   A written explanation of approach included for each question
    -   Appropriate formatting of text: fonts not larger than necessary, headings used properly, etc.
-   Code formatting:
    -   Use tidyverse code
    -   No more than ~80 characters of code per line (esp happens in comments)
    -   Spaces around `=`, after `#`, after `,`, etc.
    -   New line for each `dplyr` function (lines end in `%>%`) or `ggplot` layer (lines end in `+`)
    -   Proper indentation of pipes and ggplot layers
    -   All chunks are labeled without spaces
    -   No unwanted / commented out code left behind in the document
-   Git:
    -   Reasonable number of commites tracking progress throughout the assessment
    -   Informative commit messages
    -   Push both .md and .Rmd files
