# Groove API (groove-api)

Node.js wrapper for Groove API (https://www.groovehq.com/docs)


Installation
------------

	npm install github:silveridea/groove-api --save

Usage
-----
```js
var grooveClass = require('groove-api');
var groove = new grooveClass(YOUR_GROOVEHQ_ACCESS_TOKEN_HERE);
```

#### Supports promises
```js
//Get all tickets for a specific customer
groove.getTickets(null, "customer_email@somedomain.com")
            .then(function (ticketsresult) {
                //success
                ...
            },
            function(err)
            {
              //error
              ...
            });
```

#### Also supports callbacks
```js
//Get all messages for a specific ticket (page 1, 50 messages per page)
groove.getMessages(someTicketId, 1, 50, function(messagesresult, err) {
               if (err) {
                  //error
                  ..
                }
                //success
                ...
                });
```

#### Create a ticket example
```js
groove.createTicket(ticketBodyText, "customer_email@somedomain.com", "our_admin_email@ourdomain.com")
                    .then(function (result) {
                        //success
                        ..
                    },function(err){
                        //error
                        ..
                    });
```

#### Currently the following methods are supported
* GetTickets
* GetTicket
* GetMessages
* CreateTicket
* CreateMessage
See https://www.groovehq.com/docs for more info about each method.

#### Future work
* Add all available API methods

#### Release notes
-Ver 1.0.0


[by silveridea](http://www.silveridea.net/?utm_source=github&utm_campaign=link)