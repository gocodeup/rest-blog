# The User

## What is the `User`?

In many web applications, there are often two main ideas:

1. What basic function does our application perform?
2. Who interacts with the application and what can they ask it to do?

By creating a `Post` object and a controller to help perform CRUD, we nailed down #1:

<span style="color:lightgreen; font-weight:bold">
    Our application performs the functionality of 
    creating, reading, updating, and deleting blog posts.
</span>

Now, we need to fill out #2: **Who interacts with the application and what can they ask it to do?**

---
## Creating the `User`

We need to think about ***necessary*** information on the user of our the application.

**Internally**:

- How do we identify them?
- When were they created?
- What are they allowed to do?

**Client-facing**:

- What is their name (username, real name, email, etc)?
- Can they customize their presence (avatar, photo, bio, etc)?

**General**:

- Over which content (Posts) do they have ownership?
- How does a user validate access to our application (passwords)?

For now, let's focus on the basics of our `User` by creating a model with a few key properties:

1. Inside the `data` package, create a class named `User`


2. Give the `User` the following private fields:

- long id
- String username
- String email
- String password
- Date createdAt
- Role role

For our `Role`, we will create an `enum` as the *very* first piece inside the `User` class like so:

```JAVA
public class User {

    public enum Role {USER, ADMIN};
    ...
```

3. Create our standard POJO items:

- Empty and full constructors
- All getters and setters

---
## The `UsersController`

We can now set up a REST Controller for the purpose of running CRUD operations related to the `User`.

***After completing each method, be sure to test in Swagger***

1. In the package `web`, create a class called `UsersController`.


2. For filling out the class, follow the same pattern as found in [Rest Controllers](6-rest-controllers.md)
   and [Rest Controllers, Pt II](7-rest-controllers.md).
    - **Make sure the `@RequestMapping` value is set to `/api/users`**
    - Similarly, ***don't copypasta***. You will more than likely forget to replace one of those `Post` references
      with `User`
      and waste your own time tracking down the issue.


3. Did we mention you should test each method in Swagger as you are writing them?

---
## Additional Functionality for the `UsersController`

Looking forward, we are going to need more than just the ability to perform basic CRUD for our `User`.

We should also have ways to:

- Search by the user's
    - ID
    - Username
    - Email

- Change the user's password (super important!)

This informs us we will need add 4 new methods in `UsersController` and expose related endpoints to the client:

1. ***As you complete each method, test in Swagger***


2. `findById()` listening on `/api/users/{id}`
    - returns a `User`
    - takes in `@PathVariable Long id` as parameter
   

3. `findByUsername()` listening on `/api/users/findByUsername`
    - returns a `User`
    - takes in `@RequestParam String username` as parameter
   

4. `findByEmail()` listening on `/api/users/findByEmail`
    - returns a `User`
    - takes in `@RequestParam String email` as parameter
   

5. `updatePassword()` listening on `/api/users/{id}/updatePassword`
    - returns void
    - takes in 
   ```JAVA
      @PathVariable Long id, @RequestParam(required = false) String oldPassword, @Valid @Size(min = 3) @RequestParam String newPassword
   ```
    - with these parameters, we can:
        - obtain the `User` record
        - check the old password against the new
        - ensure the new password meets our criteria.


---

## Next Up: [Building Relationships](9-building-relationships.md)







