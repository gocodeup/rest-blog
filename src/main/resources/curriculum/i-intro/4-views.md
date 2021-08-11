# Views

We will be using [Thymeleaf](http://www.thymeleaf.org/), a templating language which is often 
used to bind models (POJOs) to HTML. 

However, we will be using Thymeleaf to help serve static assets as our Javascript will be responsible
for binding data to a view via the DOM.

---
## TODO: Include Thymeleaf in the project

Add the following to your `pom.xml`.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

We are adding what Spring Boot calls a 'starter', which is basically a single,
or multiple dependencies that allow us to use some piece of functionality in our
project. Using Spring Boot starters lets us ensure the versions of all the
dependencies we are using play nice together, and do not contain any conflicts.
---
## TODO: Serve Resources With Thymeleaf

First, we will create a controller that returns a view.

```java
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/home")
    public String welcome() {
        return "home";
    }
}
```

Notice that we have the `@Controller` annotation here, as well as the
`@GetMapping` annotation, but no `@ResponseBody` annotation.

Next we will create our view.

`src/main/resources/templates/home.html`

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8" />
    <title>Home</title>
</head>
<body>

    <h1>This is the home page</h1>

</body>
</html>
```

Now when we visit `/home`, we will see the above HTML.

Including the Thymeleaf starter in our application configures Spring to resolve
view names returned from controller methods. This means when we return the
string "home" from our controller, Spring will try to find a file name
`home.html` inside of `resources/templates`.

We must do the following to use Thymeleaf:

- include the `xmlns:th="http://www.thymeleaf.org"` attribute in your `html`
  tag

---
## TODO: Create an endpoint to serve static assets

Our eventual blog application will have two "realms". One will be on 
`/` for the purpose of only serving static assets (HTML, CSS, JS).

The other will be on `/api`. Its job will be to serve up data which our static assets use to show the user content.

For example, if the user wants to see all posts, they could hit `/api/posts` on a `GET` request. The backend would then serve back to the client (frontend) JSON containing all of the posts.

For now, let's focus on creating an endpoint which will serve up the static assets.

1. Inside `src/main/java`, create a packaged titled `web`.
    - This package will be responsible for holding all of our controllers.


2. Inside `web`, create a class named `ViewController`.
    - Annotate `ViewController` with `@Controller`. This will tell Spring to treat it as a controller class.


3. Within `ViewController`, create a public method named `showView()`. It should return a `String`.
    - Annotate `showView()` with `@RequestMapping()`;
    - Within `@RequestMapping()`, we will add our static view routes
        - `{"/", "/about", "/posts", "/login", "/home"}`
    - Have `showView()` return the following:
    
        ```return "forward:/index.html";```
   
   
4. When you complete the above, we have a nice bundle of starter JavaScript to help you visualize your client-side!


---

## Further Reading

- [Thymeleaf Documentation](http://www.thymeleaf.org/documentation.html)
- [Layouts, templating and partials](http://www.thymeleaf.org/doc/articles/layouts.html)
- [Thymeleaf Expression Language](http://www.thymeleaf.org/doc/articles/standarddialect5minutes.html)


##Next Up: [Rest Controllers](../ii-rest-and-relationships/5-rest.md)