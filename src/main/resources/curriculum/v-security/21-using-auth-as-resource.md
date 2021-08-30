# Using Auth as a Resource

Not only does Spring Security give us the ability to secure our application,
but it also can be a tool used to further the functionality!

We'll learn here how we can leverage pre-baked objects in order to lessen the 
amount of code our backend *and* frontend must use in order to accomplish that functionality.

---

## `OAuth2Authentication`

The `OAuth2Authentication` object is available to you by virtue of using Spring Security and Spring OAuth2!

With this object, we can make additional checks on incoming request bodies.

Even better, we can securely associate a user with another object!

For example: Our application needs to associate a new `Post` with the `User` who created it.

```JAVA
    @PostMapping
    private void create(@RequestBody Post newPost){
        postsRepository.save(newPost);
    }
```

If we do not want to expose the `User` information on the frontend, 
we can simple add an `OAuth2Authentication` object as a parameter *inside* the `create` method:

```JAVA
    @PostMapping
    private void create(@RequestBody Post newPost, OAuth2Authentication auth){
        postsRepository.save(newPost);
    }
```

From here, we can access the `email` address of the user, 
ask the `UserRepository` to grab the associated `User` object,
and set the `user` field on the new `Post`:

```JAVA
    @PostMapping
    private void create(@RequestBody Post newPost, OAuth2Authentication auth){
        String email = auth.getName(); // yes, the email is found under "getName()"
        User user = userRepository.findByEmail(email).get(); // use the email to get the user who made the request
        newPost.setUser(user); //set the user to the post
        postsRepository.save(newPost); //save the post!
    }
```

And *voila*! The user who is logged in to your client application is now associated with their own post!

Even better, you can rest assured knowing that the user:

- Actually exists
- Is currently authenticated
- Is authorized to create a new post

There are many more methods on `OAuth2Authentication` and even more objects which we can
leverage to provide *secure* functionality to our application.

This is merely one example!

---

Further reading:

[spring.io OAuth2Authentication object](https://docs.spring.io/spring-security/oauth/apidocs/org/springframework/security/oauth2/provider/OAuth2Authentication.html)

## Next Up: [Method-Specific Access](22-method-specific-access.md)