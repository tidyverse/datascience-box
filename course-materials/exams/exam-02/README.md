# SAMPLE TAKE HOME EXAM 1

## Rules

1.  Your solutions must be written up in the R Markdown (Rmd) file called `exam-02.Rmd`.
    This file must include your code and write up for each task.
    Your "submission" will be whatever is in your exam repository at the deadline.
    Commit and push the Rmd and the md outputs of that file.
    The .md will be graded.

2.  This exam is open book, open internet, closed other people.
    You may use any online or book based resource you would like, but you must include citations for any code that you use (directly or indirectly).
    You **may not** consult with anyone else about this exam other than the Professor or TA for this course.
    You cannot ask direct questions on the internet, or consult with each other, not even for hypothetical questions.

3.  You have until **[DUE DATE]** to complete this exam and turn it in via your personal Github repo - late work will **not** be accepted.
    Technical difficulties are **not** an excuse for late work - do not wait until the last minute to knit / commit / push.

4.  Each question requires a (brief) narrative as well as a (brief) description of your approach.
    You can use comments in your code, but do not extensively count on these.
    I should be able to suppress **all** the code in your document and still be able to read and make sense of your answers based on your narrative and any plots, figures, or other non-code output.
    See the first setup code chunk in your Rmd file to experiment with suppressing and revealing your code.

5.  Even if the answer seems obvious from the R output, make sure to state it in your narrative as well.
    For example, if the question is asking what is 2 + 2, and you have the following in your document, you should additionally have a sentence that states "2 + 2 is 4."

``` r
2 + 2
# 4
```

1.  All exploratory data analysis and inference tasks require interpretations/conclusions to be stated in context of the data and the research question. This is not noted in every single question, but instead I'm telling you here to include interpretations/conclusions in context of the data and the research question for all exploratory data analysis and inference tasks.

## Academic Integrity Statement

*I, \_\_\_\_\_\_\_\_\_\_\_\_, hereby state that I have not communicated with or gained information in any way from my classmates or anyone other than the Professor or TA during this exam, and that all work is my own.*

**A note on sharing / reusing code:** I am well aware that a huge volume of code is available on the web to solve any number of problems.
For this exam you are allowed to make use of any online resources (e.g. StackOverflow) but you must explicitly cite where you obtained any code you directly use (or use as inspiration).
You are also not allowed to ask a question on an external forum, you can only use answers to questions that have already been answered.

Any recycled code that is discovered and is not explicitly cited will be treated as plagiarism.
All communication with classmates is explicitly forbidden.

## Getting help

You are not allowed to post any questions on the public community repo or the public questions channel on Slack.
Any questions about the exam must be asked in person in office hours or on Slack via direct message to the Professor or the TAs.
For quickest response we recommend that you start a direct message with the Professor and all the TAs so that whoever gets to it first can respond to you.

## Grading and feedback

The total points for the questions add up to 90 points.
The remaining 10 points are allocated to code style, commit frequency and messages, overall organization, spelling, grammar, etc.
There is also an extra credit question that is worth 5 points.
You will receive feedback as an issue posted to your repository, and your grade will also be recorded on Sakai.

## Logistics

Answer the questions in the document called `exam-02.Rmd`.
Add your code and narrative in the spaces below each question.
Add code chunks as needed.
Use as many lines as you need, but keep your narrative concise.

Before completing, make sure to supress the code and look over your answers one more time.
If the narrative seems sparse or choppy, edit as needed.
Then, revert back to revealing your code.

Don't forget that you will need to configure your user name and email for Git to be able to push to your repository.

## Packages

You will need the following packages (at a minimum) for this exam:

-   `tidyverse`
-   `broom`
-   `infer`
-   `NHANES` (for the data)

## The data

The `NHANES` dataset contains a dataset called `NHANES` on 10,000 participants from the US population.
This datsset can be treated, for educational purposes, as if it were a simple random sample from the American population.

To load the data, use the following command after you load the `NHANES` package.

    data(NHANES)

A list of the variables and their definitions can be found in the help file for the dataset.

## Questions

1.  **(5 pts)** In this analysis we will work data from only a subset of the participants: adults aged 26 to 64, inclusive, whose employment status, encoded in the variable `Work`, is known, i.e. not `NA`.
    Before you proceed, confirm that this leaves you with 5,125 observations.
    You will use this modified dataset for the remainder of your analysis.

2.  **(5 pts)** First, we'll analyze blood pressures of participants.
    There are a few variables in the dataset relating to blood pressure.
    Blood pressure of participants was measured three times (e.g. `BPSys1`, `BPSys2`, and `BPSys3`), and the average of these three measurements was also recorded (e.g. `BPSysAve`).
    Why did the surveyers measure the blood pressure of participants multiple times and also record the average?

3.  **(5 pts)** Visualize the relationship between systolic blood pressure (`BPSysAve`) and `Work` status of respondents, and describe the relationship using appropriate summary statistics.

4.  **(5 pts)** Describe the simulation scheme for

\(a\) conducting a hypothesis test for evaluating whether average systolic blood pressures are different for Americans who are `"Working"` and `"NotWorking"`, and

\(b\) creating a confidence interval for estimating the difference between the average systolic blood pressures for Americans who are `"Working"` and `"NotWorking"`.

Be as precise as possible, and use information from the actual data (e.g. sample sizes, etc.) in your answer.

1.  **(10 pts)** Conduct the hypothesis test you described in the previous question.
    Use a significance level of 5%.
    If you find a significant difference, also estimate this difference in mean systolic blood pressures of Americans who are `"Working` and `"NotWorking"`. Use a confidence interval at the equivalent confidence level to the hypothesis test. (Note: For this question, omit participants whose `Work` status is `"Looking"`.)

2.  **(10 pts)** Create a new variable that indicates whether a participant gets a healthy amount of sleep, which is defined by the National Sleep Foundation as 7 to 9 hours per night for adults between the ages of 26 and 64.

\(a\) What percent of the sample get a healthy amount of sleep?
What percent get an unhealthy amount of sleep?
Use summary statistics to answer this question.

\(b\) What percent of participants who are working, not working, and looking for work get a healthy amount of sleep?
Calculate *and* visualise these percentages.

1.  **(5 pts)** Create two subsets of the dataset: one for healthy sleepers and one for unhealthy sleepers.
    How many observations are in each dataset?

2.  **(10 pts)** Among those who get a **healthy** amount of sleep, do these data provide convincing evidence of a difference in average systolic blood pressures of participants who are and are not working?
    Use a significance level of 5%.
    If the difference is statistically significant, also include a confidence interval (at the equivalent confidence level) estimating the magnitude of the average systolic blood pressure difference.

3.  **(10 pts)** Among those who get an **unhealthy** amount of sleep, do these data provide convincing evidence of a difference in average systolic blood pressures of participants who are and are not working?
    Use a significance level of 5%.
    If the difference is statistically significant, also include a confidence interval (at the equivalent confidence level) estimating the magnitude of the average systolic blood pressure difference.

4.  **(4 pts)** What do your findings from these hypothesis tests suggest about whether or not getting a healthy amount of sleep might be a confounding variable in the relationship between work status and systolic blood pressure?

5.  **(10 pts)** Fit a regression model predicting systolic blood pressure (`BPSysAve`) from `Age`, `BMI`, `TotChol`, `HealthGen`, `SmokeNow`, `DaysPhysHlthBad`, `DaysMentHlthBad`, `PhysActive`, `Work`, the categorical sleep health variable you created earlier and the interaction between `Work` and the categorical sleep health variable you created earlier.
    Display the coefficient estimates, and interpret the slope coefficients of `Age`, `SmokeNow`, and `HealthGen`.

6.  **(5 pts)** Write the linear models for those who get a healthy amount of sleep and those who do not based on your model in the previous question.
    Interpret the slope coefficient for `Work` for both models.

7.  **(3 pts)** Perform model selection based on AIC, and print a summary output of the final model.

8.  **(3 pts)** Interpret R-squared for your final model in the previous question.
    <br><br>

**Extra credit:** **(5 pts)** The `BPSysAve` is defined as "Combined systolic blood pressure reading, following the procedure outlined for BPXSAR." in the help file for the `NHANES` data frame.
This variable is *not* calculated as the arithmetic average of the three systolic blood pressure measurements.
Instead, it is calculated using the BPXSAR procedure mentioned in the codebook.
According to the data documentation, which can be found [here](https://wwwn.cdc.gov/nchs/nhanes/1999-2000/BPX.htm#BPXSAR), this procedure is defined follows:

> The variables BPXSAR and BPXDAR represent blood pressure results that were reported to the examinee.
> They do not represent traditional averages.
> These variables were calculated using the following protocol:
>
> -   If only one blood pressure reading was obtained, that reading is the average. If there is more than one blood pressure reading, the first reading is always excluded from the average.
> -   If only two blood pressure readings were obtained, the second blood pressure reading is the average.
> -   If all diastolic readings were zero, then the average would be zero.
> -   Exception: If there is one diastolic reading of zero and one (or more) with a number above zero, the diastolic reading with zero is not used to calculate the diastolic average.
> -   If two out of three diastolic readings are zero, the one diastolic reading that is not zero is used to calculate the diastolic average.

Confirm that the `BPSysAve` variable in the dataset was calculated correctly according to the procedure outlined above.
