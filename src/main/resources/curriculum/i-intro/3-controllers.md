# Controllers

When we weren't using Spring, we had an object called the `HttpServlet`. Extending this class allowed us to register a custom class as a Servlet.
That servlet could have a predefined path which requests would be routed to:

```JAVA
@WebServlet(name = "MovieServlet", urlPatterns = "/movies")
```

As we experienced, using Javax's Persistence API was *quite* verbose. We had to manually handle getting our **request body**, writing to our **response**, and converting to/from **JSON**.

Well, fret no more! With Spring, so much of that boilerplate code will be handled by our framework! 

Understand that, under the hood, Spring is mostly doing what we did for ourselves. 

By implementing servlets manually, we have a greater appreciation for what a robust framework can bring to the table and how Spring will speed up your development time!

---

## Our First Controller

The first step in building our application will be to define a *controller* and
define what routes the controller responds to. Luckily, Spring gives us a very
easy way to do this. The following code defines a controller that responds to
requests for `/hello`:

```java
@Controller
public class HelloController {

    @GetMapping("/hello")
    @ResponseBody
    public String hello() {
        return "Hello from Spring!";
    }
}
```

Notice the fairly heavy use of annotations. Spring can be configured in a number
of ways, and one of the easiest and most modern ways to do this is with
annotations. We will be using annotations fairly extensively to configure our
application, as opposed to the more traditional (and verbose) approach of
XML-based configuration.

Lets take a look at the annotations above in more detail.

- `@Controller`: defines that our class is a controller
- `@GetMapping`: defines a method that should be invoked when a GET request is
  received for the specified URI
- `@ResponseBody`: tells Spring that whatever is returned from this method
  should be the body of our response

---
### `@PathVariable`

Spring allows us to use *path variables*, that is, dynamic additions to the path of a request. 

Here is an example of a method which uses a path variable:

```java
@GetMapping("/hello/{name}")
@ResponseBody
public String sayHello(@PathVariable String name) {
    return "Hello, " + name + "!";
}
```

By adding `@PathVariable` in front of the `String name` parameter, 
we let Spring know that the *value* of `{name}` (our actual path variable) from `@GetMapping("/hello/{name}")` 
should be mapped to our annotated method parameter.

ie: A request to `/hello/Laura` would result in sayHello() returning:

```JAVA
"Hello, Laura!"
```

`{name}` is *variable* because it can change. We can make a request to `/hello/Laura` or `/hello/Bob`. Our `sayHello()` method will treat both names the same!

---
Notice that we can also use annotations in the definition of method parameters.

If the path variable we are looking for is not a string, we can simply define
the parameter with a different type

For example, an `int`:

```java
@GetMapping("/increment/{number}")
public String addOne(@PathVariable int number) {
    return number + " plus one is " + (number + 1) + "!";
}
```

Making a request to `/increment/10` would result in `addOne()` returning:

```JAVA
  "10 plus one is 11!"
```

---
## Further Reading

- [Web MVC Framework](http://docs.spring.io/spring/docs/4.3.5.RELEASE/spring-framework-reference/htmlsingle/#mvc)
- [URI Template Patterns](http://docs.spring.io/spring/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-requestmapping-uri-templates)
- [RequestMapping javadoc](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/RequestMapping.html)


##Next Up: [Views](4-views.md)