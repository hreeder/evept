# EVE-PT
EVE Online Personal Trainer

## Design
Modular design, single repository

React-based web-ui client

Microservice based backend

## Features
* Skill DB
* Skill Path (Is a module usable by a given character, and if not what do they need to train to get there)


# V1
Version 1 is/was AWS native, utilising much of the serverless stack for components in the build

# V2
Version 2 is being designed as a golang based set of microservices, which are aimed to be hosted on kubernetes.

Design considerations
* De-coupling services - how to best make use of queues
* How do we trigger events based on items in a queue

Considering the fact we used Cognito for authentication previously, we should look at something like Auth0 to replace it.