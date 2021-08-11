# Building Relationships

Relationships are important. Maintaining them is even more important.

But let's talk about code.

---
## The User and their Posts

Let's think about the relationship between Users and Posts:

- One `User` can author many `Posts`
- One `Post` has one `User` as author.

We can implement this idea in our `Post` and `User` classes:

---
###TODO - Use Models to Build Relationships
Include the fields below in their respective classes and update their full constructor as well as add getter/setter methods:


#### `Post`

```JAVA
private User user;
```

#### `User`

```JAVA
private Collection<Post> posts;
```


Now, we can expose new endpoints for getting all posts for a user or getting the user who authored a particular post.

However, that is not necessary at this point. You can simply include a list of posts when returning user(s) and/or include a user when returning posts.

As with previous lessons, test these changes in **Swagger** and see if you can get the results you expect!

---

## The following is a feature list to be implemented in your blog application

### FEA-5: As a user, I can see the author of blog posts

- FEA-5-Story-1: Implement server-side
- FEA-5-Story-2: Implement client-side

### FEA-6: As a user, I can see my authored blog posts

- FEA-5-Story-1: Implement server-side
- FEA-5-Story-2: Implement client-side

---

##Next Up: [Building Relationships, Pt II](10-building-relationships-ii.md)
