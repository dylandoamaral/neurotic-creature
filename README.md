# neurotic-creature

I made that project from scratch in javascript which combine genetic algorithm and neuronal network.

Genetic algorithm is here to replace back propagation in neuronal network. We let our creatures correct the network themselves.

## Encountered Problem

### Neuronal network problem

I was facing a problem with cross over, in fact, in some videos in internet which try to do the same things, they don't really use a cross over with their neuronal network because in fact, two solutions can be so different and melt them together won't help to make progress.

I think that's why my version 0.03 and below won't progress easily. Because it's random and we loose the goal of the genetic algorithm. After some research, I found NEAT, which seems to resolve my problem.

Here is a link about NEAT : http://nn.cs.utexas.edu/downloads/papers/stanley.ec02.pdf

### Sensor problem

When I started that project I was a bit lazy about sensors. First of all I was giving the relative coordinate of the closer food item and his own rotation as input for my neuronal network. In theory that's enough informations for my creature and he should "eat" food. But that didn't work like that. Indeed I waited more than 1000 generations and nothing happened. For me, it is because rotation is an input but also an output which complexify my network because creatures had to combine input together to obtain a good result.

That's why I decided to change input by putting sensors for my creatures. Now, each creature have 5 sensors which can detect food if there isn't food, sensor return 1 else they return a number between 0 and 1 according to the food distance. You can find find the sensor code in sensor.js.

Here is a schema before and after the changement :

![Image of Sensors](https://nsa39.casimages.com/img/2018/11/04/181104060412106234.png)

## Last project

Genetic art : https://github.com/dylandoamaral/genetic-art

### My improvements

 - Best code organisation
 
## To do

 - Add a test zone for best creature and some chart
 - Comment my code
 
## To fix

 - Import with javascript ES6
