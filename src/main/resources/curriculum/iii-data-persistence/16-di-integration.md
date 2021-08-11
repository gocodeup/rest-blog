# Dependency Injection & Controller Integration

Dependency injection means that we will ***inject*** a class' ***dependencies*** instead of instantiating them manually.

Behind the scenes, Spring (and many other frameworks) create what is called a **container** to store instances of our objects which can be called upon whenever we need without having to use the `new` keyword.

Using DI (dependency injection) can be done as simply as follows:

```java
public class PostsController {
    // ...
    private final PostRepository postRepository;
    
    public PostsController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }
    // ...
}
```

We can use DI in most of the classes in our Spring
application. We can even inject services into other services! 

This is how you can use it in order to get the list of all Ads.

```java
import com.example.restblog.data.PostRepository;

public class PostsController {

    // These two next steps are often called dependency injection, 
    // where we create a Repository instance and 
    // initialize it in the controller class constructor.
    private final PostRepository postRepository;

    public PostsController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping
    public List<Post> getPosts() {
        
        // Because of DI, 
        // we don't have to do this:
       
        // PostRepositoryImpl repo = new PostRepositoryImpl()
        
        // Instead, we get this lovely snippet 
        // and can use postRepository over and 
        // again in this class.
        return postRepository.findAll();
    }

    // ...
}
```
Now THAT was easy, huh? 

---
## TODO: Complete Integration

1. Finish integrating `Post` repository/controller


2. Follow the same pattern to integrate `User` repository/controller.


3. If you need more acute querying for your endpoints, see [Data Persistence, Pt II](14-data-persistence-iii.md).

---
## TODO: Testing -> The Moment of Truth.

Now, it's time to spin up your application! 

1. Start it, then check your database to see if the tables were created!

2. From a database console, create at least 3 categories records.
    - Run a SELECT statement to ensure they were created.
    

2. Use a Fetch POST request on `/api/users` to create a few `User` records and verify they are in the database.


3. Then, use another POST request to create Posts.
    - Keep in mind that you MUST have an existing `User` associated with the post
    - Also, make sure to give each new `Post` a category
    
**Things to test**:

- What happens if I create a `Post` with no `User`?
  

- What happens if I create a `Post` with an invalid `User`?
  

- Create a `Post` with an invalid `Category`. What happens?


- Can I delete a `User` which has `Post` records associated?
    
As always, test ***each*** endpoint and ensure the results are what you expect - both in the responses *and* in the database.



---
### Further Reading
- [What is Dependency Injection?](http://stackoverflow.com/questions/130794/what-is-dependency-injection)
- [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection)
- [Spring Beans and dependency injection](https://docs.spring.io/spring-boot/docs/current/reference/html/using-boot-spring-beans-and-dependency-injection.html)

## Next Up: [Services](../iv-business-layer/17-services.md)