# ofuzz
An online Type-1 fuzzy logic specification, visualization and inferencing system

## Launch instructions
1. Open an R window
2. Set the working directory to be the directory that contains this project folder, e.g.

        setwd("~/Desktop/ofuzz/")
3. Type the following commands:

        library("shiny")
        runApp(".")
4. This will launch the service in your web browser on a localhost

## Building and running in [Docker](https://www.docker.com/)
```
docker build -t ofuzz .
docker run -it --rm -p 3838:3838 --name ofuzz ofuzz
```