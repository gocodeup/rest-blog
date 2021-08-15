#REST Controllers, Part II

##Finishing `PostsController`

We should now complete our CRUD methods for the `PostsController`.

So far, we have made the `getPosts()` method and still need `createPost()`, `updatePost()`, and `deletePost()`.
Later, we will create methods for more fine-tuned CRUD operations (ie: `getById()`, `getByUser()`, etc).


Consider this an extended exercise. You will be guided at times and left to work independently at others.

---

### `@RequestBody`

Remember: `POST`, `PUT`, and `DELETE` requests, there exists a ***body*** property.

This request body will contain pertinent data for our controller method.

In order to access the request body, we add a parameter to our method signature which matches what we expect in the request body.

Then we add `@RequestBody` in *front* of that parameter, like so:

```JAVA
private void getSomeThings(@RequestBody Stuff myStuff){
    ...
}
```

From this point, Spring will attempt to convert the incoming request body to our desired object (or collection of objects). 

Now, we are free to use the newly acquired parameter same as any other method!

---
## The following is a feature list to be implemented in your blog application

### FEA-1: As a User, I can create posts.

### FEA-2: As a User, I can edit posts.

### FEA-3: As a User, I can delete posts.

---

### FEA-1 ->  `createPost()` & `@PostMapping`

1. This method will be private, return void (Spring will handle the response), and accept a `Post` object. 
   - Name the `Post` parameter in a way which indicates it is to be created.
    

2. Annotate `createPost()` with `@PostMapping` to allow Spring to direct `POST` requests to this method.


3. Just before your incoming `Post` parameter add the annotation: `@RequestBody`.
    - This tells Spring to look at the requests body in order to find our incoming `Post`.


4. For now, simply `sout` the incoming `Post` object's properties in order to confirm the object was received and deserialized correctly.


5. **Start the server and navigate to `http://localhost:8080/swagger-ui.html`. Then test the POST route on `/api/posts`.**

---
### FEA-2 -> `updatePost()` & `@PutMapping`

1. Set up this method much like `createPost()`, replacing `@PostMapping` with `@PutMapping("{id}")`.


2. In addition to `@RequestBody Post post` as a parameter, include `@PathVariable Long id` as the first parameter.
   - Later, this will help us get the `Post` from the database by ID, update it in the code, the save it back to the database.


3. **Start the server and navigate to `http://localhost:8080/swagger-ui.html`. Then test the UPDATE route on `/api/posts`.**

---
### FEA-3 ->  `deletePost()` & `@DeleteMapping`

If we remember from the Movies Backend, deleting a record is super easy!
   
Because MySQL only needs the ID of a record in order to run a delete operation, that's all we need from the client.

Instead of getting the `Post` ID from the request body, we can grab it from the path.

1. Set up the method signature much like `updatePost()` and `createPost()`.
   - private, returns void


2. Annotate your `deletePost()` method with `@DeleteMapping("{id}")`. This allows Spring to direct a 
   DELETE request to `/api/posts/12` if your `Post` object's ID is 12.
   
 
3. In the method signature, add a parameter of type `Long` named `id`. Annotate that parameter with `@PathVariable`.
   - As was described earlier, this directs Spring to use the ID on the routing path as a parameter in your `deletePost()` method.


4. **Start the server and navigate to `http://localhost:8080/swagger-ui.html`. Then test the DELETE route on `/api/posts/{id}`.**

---

## Back to Javascript!

Now, the time has *finally* come for us to venture back into our client-side!

Your bare-bones JavaScript application could use some love right now as we finish implementing our feature list!

Using your knowledge of Fetch API, jQuery, Bootstrap, and more, it's time to implement Create, Update, and Delete functionality on our Posts!

But be patient with yourself: ***it's been a while since we dove into JavaScript headlong!***

- Use **Fetch API** to make requests to `http://localhost:8080/api/posts`
- Use **Vanilla JS** or **jQuery** to create elements and retrieve data from the DOM
- Use **Bootstrap** once you are done do make a pleasing layout

### TODO: Complete the implementations of FEA-1, FEA-2, FEA-3 on the client-side.

How to implement JavaScript additions for Posts:

1. Add DOM Elements to the existing file - `PostIndex.js`.

In the export default function PostIndex, use the current code to add new elements such as the post's content.

```JAVASCRIPT
<div>
    ${props.posts.map(post => 
        `
           <h3>${post.title}</h3> 
           /* This is where you may want to add the post's content, etc*/
        `)
        .join('')}   
</div>
```



2. In PostIndex, above the `.map()` call but inside the html, add a form and input elements for creating a new post.
   - You do not need `action` or `method` attributes, only inputs and a button.


3. In the file `PostIndex.js`, add a new export function - `PostEvent()`.
   This function will call on functions which add click event listeners for when a user:
   - submits a new post
   - edits an existing post
   - deletes an existing post
   

4. Allow the user to submit a new post
   - Give your create form button a CSS selector id attribute which reflects the purpose of the button (creating a post).
   - Create a function which attaches a *click event listener* to that button
   - When the user clicks the button, your code needs to:
      - Grab the input field values and place them in a new `post` object with `title` and `content` properties.
      - Create a request object with `method`, `headers`, and `body` properties.
         - The `method` value is `"POST"`
         - The `headers` value is `{'Content-Type': 'application/json'}`
         - The `body` value is `JSON.stringify(post)`
      - Pass the request object to a new fetch() call
         - URL is `http:localhost:8080/api/posts`
         - Request is your newly-created request object
   
Here is a sample of what your fetch call may look like:

```JAVASCRIPT
fetch("http://localhost:8080/api/posts", request)
            .then(res => {
                console.log(res.status);
                createView("/posts")
            }).catch(error => {
            console.log(error);
            createView("/posts");
        });
```

Notice we are not doing anything with the response aside from looking at the `status` property?

This is because *most* of the time, `POST`, `PUT`, and `DELETE` requests do not require a **response** to have a `body`.




5. Update router.js
   - Using the "/login" property in this file as a template, add a viewEvent property to the object "/posts"
   - Before you can call upon that exported function from PostIndex.js, you must import it like so:

```JAVASCRIPT
import { PostsEvent } from "./views/PostIndex.js"
```

And implement like this:

```JAVASCRIPT
'/posts': {
returnView: PostIndex,
state: {
posts: '/api/posts'
},
uri: '/posts',
title: 'All Posts',
viewEvent: PostsEvent //<-- Use PostsEvent as a callback here!
}
```

If you investigate the flow of our code, you will find that the `viewEvent` property is invoked inside `render.js`. The `viewEvent` is only a property name for our custom `PostsEvent` function.


6. Test!
   - Make sure that when you 'create' a new post, you see the logging occur on the Spring side. This means your request was received by the backend!
   

7. Create the edit and delete functionality
   - You will attach event listeners to new edit and delete buttons much like for the create button.
   - It is ***highly*** advisable to add a `data-id` attribute to each, so we can know which post is being edited/deleted.
   - How you allow the user to edit via inputs is up to you!  
   - For edit, on click, follow the same flow:
      - Get the data, bind into a post's `content` and `title` properties
      - Make a request object
      - Send in a fetch request.
   - After writing each function, call the function inside `PostsEvent`, remembering that function is our orchestrator for invoking all the events in the `PostIndex` view.
---


##Next Up: [The User](8-the-user.md)


