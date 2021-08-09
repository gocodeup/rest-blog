#REST Controllers, Part II

##Finishing `PostsController`

We should now complete our CRUD methods for the `PostsController`.

So far, we have made the `getPosts()` method and still need `createPost()`, `updatePost()`, and `deletePost()`.
Later, we will create methods for more fine-tuned CRUD operations (ie: `getById()`, `getByUser()`, etc).

---
###`createPost()`

1. This method will be private, return void (Spring will handle the response), and accept a `Post` object. 
   - Name the `Post` parameter in a way which indicates it is to be created.
    

2. Annotate `createPost()` with `@PostMapping` to allow Spring to direct `POST` requests to this method.


3. Just before your incoming `Post` parameter add the annotation: `@RequestBody`.
    - This tells Spring to look at the requests body in order to find our incoming `Post`.


4. For now, simply `sout` the incoming `Post` object's properties in order to confirm the object was received and deserialized correctly.


5. **Start the server and navigate to `http://localhost:8080/swagger-ui.html`. Then test the POST route on `/api/posts`.**

---
###`updatePost()`

1. Set up this method much like `createPost()`, replacing `@PostMapping` with `@PutMapping({/{id}})`.

2. In addition to `@RequestBody Post post` as a parameter, include `@PathVariable Long id` as the first parameter.
   - Later, this will help us get the `Post` from the database by ID, update it in the code, the save it back to the database.


3. **Start the server and navigate to `http://localhost:8080/swagger-ui.html`. Then test the UPDATE route on `/api/posts`.**

---
### `deletePost()`

If we remember from the Movies Backend, deleting a record is super easy!
   
Because MySQL only needs the ID of a record in order to run a delete operation, that's all we need from the client.

Instead of getting the `Post` ID from the request body, we can grab it from the path.

1. Set up the method signature much like `updatePost()` and `createPost()`.
   - private, returns void


2. Annotate your `deletePost()` method with `@DeleteMapping({id})`. This allows Spring to direct a 
   DELETE request to `/api/posts/12` if your `Post` object's ID is 12.
   
 
3. In the method signature, add a parameter of type `Long` named `id`. Annotate that parameter with `@PathVariable`.
   - As was described earlier, this directs Spring to use the ID on the routing path as a parameter in your `deletePost()` method.


4. **Start the server and navigate to `http://localhost:8080/swagger-ui.html`. Then test the DELETE route on `/api/posts/{id}`.**

---
##Next Up: [The Users Controller](8-the-user.md)


