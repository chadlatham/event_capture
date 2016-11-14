#Notes to start Mongo

npm i -S mongodb
create a folder called mongo in project
mongod --dbpath=./mongo --port 27017

#Migo
iOS apps
log the events
node express apps

multi-part file uploads
ngfile upload
socket.io

post data to node app

express app can send to different analytics platforms
send out to segment.io
send raw data, later analyze.

express server
segment.io npm module

send all events to segment and to mongo

mongoose data models - schema
data-model the events

talk to dev team and request
point to my end point to post data
ask for mock data

segment.io is good to study, but keep in mind that we are (direct) at the moment.  However, segment is likely on the horizon.

##Mixpanel
http API

This URL tracks an event with Mixpanel
http://api.mixpanel.com/track/?data=eyJldmVudCI6ICJnYW1lIiwgInByb3BlcnRpZXMiOiB7ImlwIjogIjEyMy4xMjMuMTIzLjEyMyIsICJkaXN0aW5jdF9pZCI6ICIxMzc5MyIsICJ0b2tlbiI6ICJlM2JiNDEwMDMzMGMzNTcyMjc0MGZiOGM2ZjVhYmRkYyIsICJ0aW1lIjogMTI0NTYxMzg4NSwgImFjdGlvbiI6ICJwbGF5In19
All data query parameters are Base64 encoded JSON objects

Tracking events

Each event you record is represented as a JSON object in a request to http://api.mixpanel.com/track/. The request will return an HTTP response with body "1" if the track call is successful, and a "0" otherwise. Event tracking objects should have the following attributes:

event (required)
string
A name for the event. For example, "Signed Up", or "Uploaded Photo".

properties (required)
object
A collection of properties associated with this event. You can use these properties to filter or segment events in Mixpanel. In addition, some properties are treated specially by Mixpanel.

Sends an event "Signed Up", associated with user 13793,
with a property "Referred By"

{
    "event": "Signed Up",
    "properties": {
        // "distinct_id" and "token" are
        // special properties, described below.
        "distinct_id": "13793",
        "token": "e3bc4100330c35722740fb8c6f5abddc",
        "Referred By": "Friend"
    }
}

##Segment.io
Don't use for now. Future integration.

#Queueing system
Fire and forget.

Server subscribes to a queue.
If messages don't meet - ignore or put in failed event handler.

Research client libraries that work with queues.


#Knex: Creates a connection pool - we've been doing it wrong it seems.
##Initializing the library should normally only ever happen once in your application, as it creates a connection pool for the current database, you should use the instance returned from the initialize call throughout your library.
