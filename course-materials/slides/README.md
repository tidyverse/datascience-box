# Slides

## Toolkit

Slides are built in using the **xaringan** package. See [here](https://github.com/yihui/xaringan) for more info on xaringan. There are two main reasons for choosing this format:

1. `xaringan` slides are R Markdown based, meaning code, output, and narrative can all live in one place and compiling the slides will run the R code as well.
2. Slide output is mobile friendly.

### Instructions

Each slide deck is in its own folder, and one level above there is a custom css file. To compile the slides use `xaringan::inf_mr(cast_from = "..")`. This will launch the slides in the Viewer, and it will get updated as you edit and save your work.
