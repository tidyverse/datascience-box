Type coercion
================
Mine Çetinkaya-Rundel

-   `c(1, 1L, "C")`

``` r
c(1, 1L, "C")
```

    ## [1] "1" "1" "C"

``` r
1
```

    ## [1] 1

``` r
1L
```

    ## [1] 1

``` r
"C"
```

    ## [1] "C"

``` r
#typeof(c(1, 1L, "C"))
```

-   `c(1L / 0, "A")`

``` r
c(1L / 0, "A")
```

    ## [1] "Inf" "A"

``` r
typeof(1L)
```

    ## [1] "integer"

``` r
typeof(0)
```

    ## [1] "double"

``` r
typeof(1L/0)
```

    ## [1] "double"

``` r
typeof("A")
```

    ## [1] "character"

``` r
#typeof(c(1L / 0, "A"))
```

-   `c(1:3, 5)`

``` r
c(1:3, 5)
```

    ## [1] 1 2 3 5

``` r
typeof(1:3)
```

    ## [1] "integer"

``` r
typeof(5)
```

    ## [1] "double"

``` r
#typeof(c(1:3, 5))
```

-   `c(3, "3+")`

``` r
c(3, "3+")
```

    ## [1] "3"  "3+"

``` r
typeof(3)
```

    ## [1] "double"

``` r
typeof("3+")
```

    ## [1] "character"

``` r
#typeof(c(3, "3+"))
```

-   `c(NA, TRUE)`

``` r
c(NA, TRUE)
```

    ## [1]   NA TRUE

``` r
typeof(NA)
```

    ## [1] "logical"

``` r
typeof(TRUE)
```

    ## [1] "logical"

``` r
#typeof(c(NA, TRUE))
```
