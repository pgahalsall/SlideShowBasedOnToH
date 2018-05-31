P.H 3/29/2018

This is my attempt at a Slideshow app based on the Tour of Heroes demo application for Angular.

cd client
npm install
npm start


Chages made include :-
1. Creating a services folder and moving services into it.
2. Renaming the "src" folder as "client". Will later add a "server" folder to include the Node, Express and Mongo components 
3. Create a "models" folder and move the files.



This is the Tour of Heroes application that comes with the tutorial on the Angular website
https://angular.io/tutorial

It should be the starting point for any webite developed with Angular. Learn it well !

The site uses :-

1. The In-memory Web API module to mimic communication with a remote data server. 
   This is done using JSON-server in other examples. It's a great way to mock out the Express,
   Node and Mongo db pieces that usually make up the server side code of a MEAN stack project.
   These can be added later in the development cycle.
   https://angular.io/tutorial/toh-pt6

2. Demonstrates Routing 
   https://angular.io/tutorial/toh-pt5

3. Includes a client side Hero Service
   https://angular.io/guide/architecture-services
   https://angular.io/tutorial/toh-pt4

4. A great use of dependancy injection
   https://angular.io/guide/dependency-injection-pattern
   https://angular.io/guide/dependency-injection

5. RxJS Observables
   https://angular.io/guide/observables

6. Testing using Karma
   https://angular.io/guide/testing


What needs adding for a full MEAN stack project :-

1. The Express, Node and Mongo db pieces that make up the server side 
2. Route Authorization
3. Login passport/jwt and google strategy    
4. Bootstrap and styling. *** Bootstrap has been added to angular-cli.json ***
5. Font-Awesome / Angular issue means css/fonts have been added to Assets folder. Sould just be referenced in node_modules



