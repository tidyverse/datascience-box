# Slides

## Outline

The course is divided into three parts. Part 1 is on exploratory data analysis, part 2 is making rigorous conclusions via statistical tools like modeling and inference, and part 3 includes four topics (that could easily be swapped with others or taught in any order) that are designed to inspire students to learn more data science and statistics.

### Part 1: Exploring data

- p1_d01: Welcome to Data Science
- p1_d02: Introduction to R/RStudio + git/GitHub
- p1_d03: Fundamentals of data + data visualization
- p1_d04: Tidy data + data wrangling
- p1_d05: Types of variables
- p1_d06: Recoding and transforming variables
- p1_d07: Data Visualization and Exploration, Pt 1
- p1_d08: Data Visualization and Exploration, Pt 2
- p1_d09: Visualizing data over time and space
- p1_d10: Confounding variables and Simpson's paradox
- p1_d11: Case studies: SAT scores and smoking

### Part 2: Making rigorous conclusions

- p2_d01: The language of models
- p2_d02: Formalizing linear models
- p2_d03: Multiple linear regression
- p2_d04: Model selection
- p2_d05: Case study: Model selection for Paris Paintings
- p2_d06: Prediction and model validation
- p2_d07: Estimation via bootstrapping
- p2_d08: Hypothesis testing via simulation methods
- p2_d09: Inference overview
- p2_d10: Inference for regression
- p2_d11: Central Limit Theorem and CLT based inference
- p2_d12Case study: Inferring from the General Social Survey

### Part 3: Looking forward

- p3_d01: Web scraping
- p3_d02: Functions and automation
- p3_d03: Interactive visualizations with Shiny
- p3_d04: Bayesian inference

## Toolkit

Slides are built in using the **xaringan** package. See [here](https://github.com/yihui/xaringan) for more info on xaringan. There are two main reasons for choosing this format:

1. `xaringan` slides are R Markdown based, meaning code, output, and narrative can all live in one place and compiling the slides will run the R code as well.
2. Slide output is mobile friendly.

### Instructions

- Each slide deck is in its own folder, and one level above there is a custom css file. To compile the slides use `xaringan::inf_mr(cast_from = "..")`. This will launch the slides in the Viewer, and it will get updated as you edit and save your work.



to live preview the slides (every time you update and save the Rmd document, the slides will be automatically reloaded; make sure the Rmd document is on focus when you click the addin)



