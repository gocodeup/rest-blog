# Method-Specific Access

---

## Appending to the Path

When restricting access to controller methods, we have a couple of approaches in Spring Security.

We can:

Append to the path with routes to that method:

```JAVA
    @PostMapping
    private void create(){...}

    // becomes..

    @PostMapping("/create")
    private void create(){...}
```

And our `ResourceServerConfiguration` would then change in some way, possibly like:

```JAVA
 // ..other restrictions above
 .antMatchers("/api/users/create").permitAll()
 // more permissions below...
```


Is it an approach which works? Yes!

However, as you can imagine, this can lead to a bulky 
and difficult to navigate set of configurations in a single method.

Take for instance the concept that you took this approach to customize each and every controller method's path. 
That could lead to dozens of individual endpoints and a `ResourceServerConfiguration.configure()` which is unmanageable!

---

## Applying `@PreAuthorize`

In this approach, we add `@PreAuthorize` to the top of a controller method.

### Of note: Your annotated method *must* not be private!

This annotation can contain a boolean expression which compares the authority of a given user (via the ***token*** present in the header)
against a set of conditions (as a ***boolean expression***). 

If the conditions are met, Spring Security will allow the request to continue to the associated controller method.

For example:

```JAVA
    @PostMapping
    @PreAuthorize("!hasAuthority('USER')")
    public void create(@RequestBody User newUser) {
        return repository.save(newUser);
    }
```

Here `!hasAuthority('USER')` indicates that if the user is currently does not have the role of `USER`, then the method is allowed to be invoked.

Realistically, this means that we are expecting this method to be invoked *ONLY* if the request comes from a non-registered user OR an `ADMIN` user.

Aka: a regular user can't create a new user.

`!hasAuthority('USER')` is simply a boolean expression. You can expand this into a more robust expression 
in the same way you can create a boolean expression for an `if` statement:

```JAVA
    @PreAuthorize("!hasAuthority('USER') && !hasAuthority('ADMIN')")
```

Here, we declared that neither the `USER` role *nor* the `ADMIN` role can create a new user.

---
## Method Parameters and Class Fields in `@PreAuthorize`

### `#`

To use a method's parameter in your `@PreAuthorize` expression, simply add `#` in front of the parameter, like so:

```JAVA
    @PutMapping("/{id}/changePassword")
    @PreAuthorize("!hasAuthority('USER') || (#oldPassword != null && !#oldPassword.isEmpty())")
    public void changePassword(@PathVariable Long id, @RequestParam(required = false) String oldPassword, @RequestParam String newPassword) {
```

Above, we used the `String oldPassword` parameter in `updatePassword` to make sure the `oldPassword` was not `null` or `empty` before even invoking the method.


### `@`

To use a class field in your expression, simply call for the field with the `@` sign in front:

```JAVA
    @PreAuthorize( ...@userRepository.findById(#id).get()...)
```

From here, you can use the return value of `findById(#id)` in a `@PreAuthorize` expression to make comparisons and determine whether the expression is `true` or `false`.

---

## `@PostAuthorize`

Much like `@PreAuthorize`, `@PostAuthorize` will check a boolean expression 
to determine method access.

*However*, `@PostAuthorize` will allow the method to execute 
*then* check for access authorization.

If the authorization is granted, the value of the method can be returned. 
If not, a `401` status will be issued in the response.

This may be useful in the event that code must be executed 
and a database record must be updated before authorization can be evaluated.


---

For more method-level security annotations and examples, check out this article:

[Baeldung: Method Security](https://www.baeldung.com/spring-security-method-security)


## Next Up: [Wrapping Up](23-wrapping-up.md)
