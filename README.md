# HackZurich2015
Our awesome analysis project

## Running the app ##

Run: ```python2 www/manage.py runserver```

Then, access: http://localhost:8000

## Features ##

### Text level ###

Given a text, compute the following statistics:

* Polarity (positive<->negative)
* Subjectivity (subjective<->objective)
* Number of words per sentence
* Mood: INDICATIVE, IMPERATIVE, CONDITIONAL or SUBJUNCTIVE
* Modality: degree of certainty. According to the documentation of `Pattern`: "*for example, "I wish it would stop raining" scores -0.35, whereas "It will stop raining" scores +0.75. Accuracy is about 68% for Wikipedia texts*".
* Semantic fields
* Level of language/Register

### Webpage level ###

Do the same on the level of a webpage.

### Comparisons ###

Compare text statistics between:
* Several texts
* Several webpages

* Several topics on a website. For example, discover is a website is partial and/or particularly negative towards a topic. The statistics for each topic can be obtained by averaging over search results.
* Several websites, where the statistics of each website are obtained by averaging over most accessed pages.

## Ideas of applications ##

* Compare the views of political parties/candidates/newspapers, their level of language and semantic fields.


