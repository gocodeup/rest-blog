# Controllers

## Our First Controller

The first step in building our application will be to define a *controller* and
define what routes the controller responds to. Luckily, Spring gives us a very
easy way to do this. The following code defines a controller that responds to
requests for `/hello`:

```java
@Controller
class HelloController {

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

## Path Variables

Spring allows us to use *path variables*, that is, variables that are part of
the URI of a request, as opposed to being passed as a query string, or as part
of the request body. Here is an example of a method that uses a path variable:

```java
@GetMapping("/hello/{name}")
@ResponseBody
public String sayHello(@PathVariable String name) {
    return "Hello " + name + "!";
}
```

Notice that we can also use annotations in the definition of method parameters.

If the path variable we are looking for is not a string, we can simply define
the parameter with a different type.

```java
@RequestMapping(path = "/increment/{number}", method = RequestMethod.GET)
@ResponseBody
public String addOne(@PathVariable int number) {
    return number + " plus one is " + (number + 1) + "!";
}
```

Notice in the above example we also used the `@RequestMapping` annotation, which
is just the longer version of `@GetMapping`. There, of course, also exists a
`@PostMapping` annotation that tells the controller to respond to POST requests.

## Further Reading

- [Web MVC Framework](http://docs.spring.io/spring/docs/4.3.5.RELEASE/spring-framework-reference/htmlsingle/#mvc)
- [URI Template Patterns](http://docs.spring.io/spring/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-requestmapping-uri-templates)
- [RequestMapping javadoc](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/RequestMapping.html)

## Exercises

1. Create a `HomeController` class. This class should have one method with a
   `GetMapping` for `/`. It should return a string that says "This is the
   landing page!".

   This will eventually be the page that users see when they first visit your
   page. Later on, when we learn about views, you can swap it out for something
   more fancy.

---

1. Create a `MathController` class.
1. This controller should listen for requests for several routes that correspond
   to basic arithmetic operations and produce the result of the arithmetic.

Example

|         url           | response   |
| --------------------- | :--------: |
| `/add/3/and/4`        | `7`        |
| `/subtract/3/from/10` | `7`        |
| `/multiply/4/and/5`   | `20`       |
| `/divide/6/by/3`      | `2`        |

---

1. Create a `PostController` class. This controller should return strings for
   the following routes that describe what will ultimately be there.

|  method  |          url          |            description            |
| :------: | --------------------- |            :--------:             |
|   GET    |       `/posts`        |         posts index page          |
|   GET    |     `/posts/{id}`     |      view an individual post      |
|   GET    |    `/posts/create`    | view the form for creating a post |
|   POST   |    `/posts/create`    |         create a new post         |


##Next Up: [Views](4-views.md)