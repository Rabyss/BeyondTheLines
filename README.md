# HackZurich2015
Our awesome analysis project

## Running the app ##

Run: ```python2 www/manage.py runserver```

Then, access: [http://localhost:8000](http://localhost:8000)


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


## API ##

### Website analysis ###

GET request to ```http://localhost:8000/api/website?topic=<query>&quantity=<nb>&surl=<source>```

* `topic` : string representing the topic to search
* `quanrtity` : wanted number of results
* `url` : source url
* example : ```http://localhost:8000/api?topic=foreigner&quantity=5&url=cnn.com```

#### Json example ####

```
{
  polarity: [
    0.1,
    0.21937410968480306
  ],
  positivity: [
    0.1875,
    0.24206145913796356
  ],
  wordPerSentence: [
    11.3125,
    2.7264617638984046
  ],
  subjectivity: [
    0.1,
    0.21937410968480306
  ],
  modality: [
    0.7317708333333334,
    0.1985837169093372
  ],
  moods: {
    imperative: 1,
    indicative: 2
  }
}
```

### Web page analysis ###

GET request to ```http://localhost:8000/api/webpage?surl=<source>```
* `url` : page to analyze
* example : ```http://localhost:8000/api/webpage?url=http://edition.cnn.com/2015/10/03/asia/afghanistan-doctors-without-borders-hospital/index.html```


### Text analysis ###

POST request to ```http://localhost:8000/api/text``` with attribute `text` which is the text to analyze.
