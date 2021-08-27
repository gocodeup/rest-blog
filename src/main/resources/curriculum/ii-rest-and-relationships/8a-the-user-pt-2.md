## FEA-6: As a user, I can view, edit, and delete information about myself.

---
### FEA-6-A: Make `getAll` and `getById` in `UsersController`
- ***Good news! You already did that!***
---
### FEA-6-B: Make `getByUsername` and `getByEmail`
#### 1. ***As you complete each method, test in Swagger***


#### 2. `getByUsername()` listening on `/api/users/username`
    - returns a `User`
    - takes in `@RequestParam String username` as parameter


#### 3. `getByEmail()` listening on `/api/users/email`
    - returns a `User`
    - takes in `@RequestParam String email` as parameter

---
### FEA-6-C: Create client-side User view

#### 1. Inside `views`, create a new `User.js` file. Use this file to create a view for allowing the `User` to see/edit information about themselves.
- In your capstone project, this will be essential! So it's highly advisable that you attempt this view!


#### 2. For now, let's only be concerned with letting the user see their information and update their password.
- Here is where your `findBy[whatever field]` controller method comes in handy
- For editing the password, you will need to implement `updatePassword` (as seen in #5 of the previous section).


#### 3. Follow the same pattern as in the past:
- Make the view
- Make the event(s)
- Add a new property to `router.js`
- Test!

---

### FEA-6-D: Make `updatePassword` in `UsersController`

Create a `private` method `updatePassword()` listening on `{id}/updatePassword` which:

- returns `void`


- Has the following signature:
   ```JAVA
      @PathVariable Long id, @RequestParam(required = false) String oldPassword, @Valid @Size(min = 3) @RequestParam String newPassword
   ```

- With the above parameters, we can:
    - obtain the `User` record
    - check the old password against the new
    - ensure the new password meets our criteria.

---

### FEA-6-E: Implement the client-side ability to update the user's password

---

## Next Up: [Building Relationships](9-building-relationships.md)

