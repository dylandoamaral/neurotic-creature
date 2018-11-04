# neurotic-creature

I made that project from scratch in javascript which combine genetic algorithm and neuronal network.

Genetic algorithm is here to replace back propagation in neuronal network. We let our creatures correct the network themselves.

## Encountered Problem

I was facing a problem with cross over, in fact, in some videos in internet which try to do the same things, they don't really use a cross over with their neuronal network because in fact, two solutions can be so different and melt them together won't help to make progress.

I think that's why my version 0.03 and below won't progress easily. Because it's random and we loose the goal of the genetic algorithm. After some research, I found NEAT, which seems to resolve my problem.

Here is a link about NEAT : http://nn.cs.utexas.edu/downloads/papers/stanley.ec02.pdf

## Last project

Genetic art : https://github.com/dylandoamaral/genetic-art

### My improvements

 - Best code organisation
 
## To do

 - Add a test zone for best creature to see if the neuronal network is available
 - Make NEAT algorithm
 - Comment my code
 
## To fix

 - Import with javascript ES6
