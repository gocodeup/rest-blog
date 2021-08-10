#REST and RESTful APIs

##What is REST and what makes a RESTful API?

In Roy Fielding's doctoral dissertation, he outlined an architecture for web communication called

###***Representational State Transfer***

or

###***REST***

In this paradigm, a set of constraints are placed on the way 
data can be transmitted to/from an API.

According to RedHat, the constraints needed for a RESTful API are:

- A client-server architecture made up of clients, servers, and resources, with requests managed through HTTP.

- Stateless client-server communication, meaning no client information is stored between get requests and each request is separate and unconnected.

- Cacheable data that streamlines client-server interactions.
    - In other words: a database.

- A uniform interface between components so that information is transferred in a standard form. This requires that:
    - resources requested are identifiable and separate from the representations sent to the client.
    - resources can be manipulated by the client via the representation they receive because the representation contains enough information to do so.
    - self-descriptive messages returned to the client have enough information to describe how the client should process it.
    - hypertext/hypermedia is available, meaning that after accessing a resource the client should be able to use hyperlinks to find all other currently available actions they can take.
    
- A layered system that organizes each type of server (those responsible for security, load-balancing, etc) involved in the retrieval of requested information into heirarchies, invisible to the client.

- OPTIONAL: Code-on-demand -> the ability to send executable code from the server to the client when requested, extending client functionality.

---
**Practically, you will often see a similar image to the below which attempts to explain REST**:

![REST Image](../REST.png)

While this image is a ***great*** example of a client-server relationship, it does not fully cover the idea of what makes an API *RESTful*.

We will, as time moves on, cover more in-depth ideas behind REST and why it is so helpful to us as web developers.

---
###Important points to remember: 

###REST is not a protocol or a standard - it is a set of constraints.

###REST can be implemented in a number of ways.


####For more reading, check out [this link](https://www.redhat.com/en/topics/api/what-is-a-rest-api).

####To read Roy Fielding's own work on this concept, [go here](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)

---
##Next Up: [Rest Controllers](6-rest-controllers.md)

