# Rest Controllers

## Our first step to developing a RESTful API is to build objects which can handle requests and send meaningful responses.

### To accomplish this, we are going to start with a new type of Spring controller: the `@RestController`.

When we place this annotation above a class declaration, it registers the class with Spring's Dependency Injector and is
handled in particular ways.

Among those ways is it eliminates the need to annotate every controller method with `@ResponseBody`. Less boilerplate ==
more fun!
---
## Creating a REST Controller

1. Add the following dependency to your `pom.xml`:

```XML

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

```
2. Now, let's go create a `Post` class.
   - On the same level as the `web` package, create a new package named `data`
   - Inside `data`, create a class named `Post`
   - Give `Post` the below fields, along with empty constructor, full constructor, and all getters/setters.

```JAVA

private Long id;
private String title;
private String content;

```

3. In the package `web`, create a class called `PostsController`.
    - Annotate that class with `@RestController`
    - Also, annotate this class with
       ```JAVA
       @RequestMapping(value="/api/posts", headers="Accept=application/json")
       ```

With the `@RequestMapping` annotation, we are informing Spring of where to direct requests for our Posts
Controller. Our mapping is for `/api/posts`.

We can also annotate additional routing for individual controller methods. 

For example, adding `@DeleteMapping({id})` on
`PostsController.deletePost()` would allow a client to make a
`DELETE` request to `/api/posts/12`, with 12 being the ID of the post to delete.

Then, it is up to us to add a `@PathVariable` in the method signature with a parameter of the matching type. It's also suggested to name the parameter the same as your incoming parameter from the request.

```JAVA

@DeleteMapping({id})
public void deletePost(@PathVariable Long id){
        ......
        }

```

4. In `PostsController`, create a public method called `getPosts()`
    - This method will return a list of `Post` objects
    - Annotate this method with `@GetMapping`
    - In `getPosts()`, let's make a list of `Post` objects and add 2-3 posts with some fake values
    - Now, return that list to fulfil the return expectation of the method.

---
## Let's Test!

Now that we are using Spring, add this fun little dependency to our `pom.xml`:

```XML

<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-ui</artifactId>
    <version>1.5.9</version>
</dependency>
```

###Introducing: **The Glorious Swagger UI**

With this dependency, we will have a ***very*** handy testing and documentation tool.

Start your application and navigate to `http://localhost:8080/swagger-ui.html`

What you will see is live documentation and endpoint testing tools of currently registered controllers.

You can test any endpoint and even get sample requests/responses to help you along!

For more information on how to effectively use Swagger UI, [start here](https://swagger.io/docs/specification/about/)

---
## Next Up: [REST Controllers, pt Deux](7-rest-controllers-2.md)





