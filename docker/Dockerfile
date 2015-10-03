FROM debian

RUN apt-get update
RUN apt-get install -y git-core python-pip

# Goose
RUN apt-get install -y libjpeg-dev zlib1g-dev python-imaging python-dev libxml2-dev libxslt-dev
RUN git clone https://github.com/grangier/python-goose.git
WORKDIR python-goose
RUN pip install -r requirements.txt
RUN python setup.py install

# Pattern
RUN apt-get install -y python-numpy
RUN pip install pattern

# Django
RUN apt-get install -y python-django