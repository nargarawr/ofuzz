FROM rocker/shiny
WORKDIR /srv/shiny-server
ADD . /srv/shiny-server
CMD shiny-server