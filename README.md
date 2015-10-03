# HackZurich2015
Our awesome analysis project

## Running the app ##

Run: ```python2 www/manage.py runserver```

Then, access: [http://localhost:8000](http://localhost:8000

### API access ###

Access ```http://localhost:8000/api?query=<query>&nb_per_source=<nb>&sources=<sources>```

* `query` : query string
* `nb_per_source` : number of result to retrive for each source
* `sources` : list of domains from which to retrieve texts separated par commas, the key word `web` can be used to request a global web search
* example : ```http://localhost:8000/api?query=foreigner&nb_per_source=2&sources=web,cnn.com```

#### Json example ####

```
{
web: [
{
url: "http://www.foreigneronline.com/",
data: "{"polarity": [0.26554112554112552, 0.0], "positivity": [1.0, 0.0], "wordPerSentence": [82.0, 0.0], "subjectivity": [0.26554112554112552, 0.0], "modality": [0.75, 0.0], "moods": {"conditional": 1}}"
},
{
url: "http://www.amazon.com/Foreigner-FOREIGNER/dp/B000063NE0",
data: "{"polarity": [0.23000000000000001, 0.44425277299729876], "positivity": [0.52631578947368418, 0.4993069989739547], "wordPerSentence": [16.05263157894737, 9.4282536431198523], "subjectivity": [0.23000000000000001, 0.44425277299729876], "modality": [0.71040100250626559, 0.27890294791186759], "moods": {"conditional": 2, "indicative": 17}}"
}
],
cnn.com: [
{
url: "http://cnnpressroom.blogs.cnn.com/2015/02/15/putins-net-worth-is-200-billion-says-russias-once-largest-foreigner-investor/",
data: "{"polarity": [0.034562337662337662, 0.21063241121708376], "positivity": [0.19, 0.39230090491866065], "wordPerSentence": [20.670000000000002, 14.12873313499834], "subjectivity": [0.034562337662337662, 0.21063241121708376], "modality": [0.66726091269841281, 0.34558062580828158], "moods": {"imperative": 8, "conditional": 11, "indicative": 81}}"
},
{
url: "http://ireport.cnn.com/docs/DOC-803931",
data: "{"polarity": [0.06319042579152874, 0.27699208279196502], "positivity": [0.44117647058823528, 0.49652773576865095], "wordPerSentence": [30.411764705882351, 15.473160153023276], "subjectivity": [0.06319042579152874, 0.27699208279196502], "modality": [0.51393647202470727, 0.2792393248303473], "moods": {"conditional": 2, "indicative": 31, "subjunctive": 1}}"
}
]
}
```

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


