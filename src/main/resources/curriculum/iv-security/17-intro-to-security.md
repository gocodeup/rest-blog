# Intro To Security

As web developers, security is not just a nice-to-have: it is an ***imperative***.

When data on users drives so much we do, it's our job ensure their information is safe.

Additionally, we must ensure that a user's information can't be used to penetrate our application in order to perform nefarious actions.

There are two parts to securing an application:

####Authentication and Authorization

---
## OAuth 2.0

There are many ways to secure applications, 
and one of the most common and airtight is the use of the OAuth 2.0 specification.

In the future, you may find yourself using more complex mechanisms for implmenting OAuth, 
but here is a breakdown of the parts which make our security environment

### 1. Authentication Server 
Issues the authentication *token*
### 2. Resource Owner
The principle by which we discover how a purported user relates to our system
### 3. Resource Server
The realm which serves up our actual content on protected endpoints

**In the next few lessons, we will work to set up a security infrastructure for our application.**

## Next Up: [Implementing OAuth 2.0](18-implementing-oauth.md)

