# Testing with OAuth 2.0

Now that we have the core security pieces in place, 
we will need to take a look at:


- The process of creating an `Access Token` / `Refresh Token`


- What the token looks like after it is decrypted.


- How is that token stored with the client.


- How to send it back to the server when making a request.

---

### Of Note: From this point, we will be doing much of our testing 

## Creating the Access and Refresh Tokens

In order to authenticate a `User` with our server, the `User` must actually exist and be given a role.


