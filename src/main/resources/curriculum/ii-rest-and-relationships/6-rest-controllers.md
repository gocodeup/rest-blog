# Rest Controllers

## Our first step to developing a RESTful API is to build objects which can handle requests and send meaningful responses.

### To accomplish this, we are going to start with a *different* type of Spring controller: 

### `@RestController`

When we place this annotation above a class declaration, it registers the class with Spring's Dependency Injector (*more on that later*) and is
handled in particular ways.

Among those ways is it eliminates the need to annotate every controller method with `@ResponseBody`. Less boilerplate ==
more fun!

Most importantly, `@RestController` allows us to signify that a controller exists for the **purpose** of sending/receiving data. 

---

### This lesson will help us complete the below feature and associated tasks:

## FEA-1: As a user, I can view any posts.
### FEA-1-A: Create a REST Controller to allow a client to make requests/responses related to Blog Posts.

---
#### 1. Add the following dependency to your `pom.xml`:

```XML
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```
---
#### 2. Now, let's go create a `Post` class.
    - On the same level as the `web` package, create a new package named `data`
    - Inside `data`, create a class named `Post`
    - Give `Post` the below fields, along with empty constructor, full constructor, and all getters/setters.

```JAVA
private Long id;
private String title;
private String content;
```
---
#### 3. In the package `web`, create a class called `PostsController`.
 - Annotate that class with `@RestController`

### `@RequestMapping`

With the `@RequestMapping` annotation, we are informing Spring of how to direct requests to `PostsController`, as well
as what type of data is accepted.

We will inform Spring to send requests on `/api/posts` to this controller. It will also accept `application/json` in
requests.

```JAVA

@RestController
@RequestMapping(value = "/api/posts", headers = "Accept=application/json")
public class PostsController {
    ...
}
```

From `api/posts`, we can further define what requests go to which methods.

ie: `GET` requests on `api/posts` go to the method annotated with `@GetMapping`.

Or, `DELETE` requests on `api/posts/{id}` go to `@DeleteMapping("{id}")`.

Also, with *Spring*, we do not need to convert objects to and from JSON with another dependency. ***Spring will handle
serializing/deserializing for us!***
---

## CRUD Mapping By Method

With Spring, we can be specific about which controller methods listen on what route by use of annotations.

### `@GetMapping` - (`GET`, aka: the Read operation)

This handy annotation is what is called a *composed annotation*. Meaning, it is an amalgamation of the actions of one or
more annotations. Per the Spring Docs:


```
...@GetMapping is a composed annotation that acts as a shortcut for @RequestMapping(method = RequestMethod.GET).
```

To use it, simply place this annotation over your desired REST controller method:

```JAVA
@GetMapping
private List<Post> getAll() {
        ...
}
```

From this point, any valid `GET` request sent to `/api/posts` will be routed to `getPosts()`.

---
### `@PathVariable`
We can also annotate additional path extensions for controller methods.

For example, adding `@GetMapping("{id}")` on
`PostsController.getPost(...)` would allow a client to make a
`GET` request to `/api/posts/12`, with `12` being the ID of the post to retrieve.

Then, it is up to us to add a `@PathVariable` in the method signature with a parameter of the matching type. It's also
suggested to name the *method* parameter the same as your incoming path variable in order to save confusion.

```JAVA
@GetMapping("{id}")
public void getById(@PathVariable Long id){
        ...
        }
```


---

## TODO: `getAll()`
In `PostsController`, create a `public` method called `getAll()`

- This method will return a list of `Post` objects


- Annotate this method with `@GetMapping`


- In `getPosts()`, let's make a list of `Post` objects and add 2-3 posts to that list with believable values.


- Now, return that list to fulfil the return expectation of the method.

---

## TODO: Let's Test!

Now that we are using Spring, add this fun little dependency to our `pom.xml`:

```XML

<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-ui</artifactId>
    <version>1.5.9</version>
</dependency>
```

### Introducing: **The Glorious Swagger UI**

With this dependency, we will have a ***very*** handy testing and documentation tool.

Start your application and navigate to `http://localhost:8080/swagger-ui.html`

What you will see is live documentation and endpoint testing tools of currently registered controllers.

You can test any endpoint and even get sample requests/responses to help you along!

For more information on how to effectively use Swagger UI, [start here](https://swagger.io/docs/specification/about/)


---

## TODO: `getById()`

Using examples from above, create another `public` method in `PostsController` named `getById()`

- This method will return a single `Post` object
  

- It will accept `GET` requests on `api/posts/{id}`


- `getById()` has one parameter mapped by `@PathVariable` to the route's `{id}`.
    - The parameter is of type `Long` and is named `id`.


- Create and return a new `Post` object with all fields populated. 


- Test your endpoint in Swagger!

---

## Next Up: [REST Controllers, pt Deux](7-rest-controllers-2.md)





