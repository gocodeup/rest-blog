# Data Persistence, Pt II

In this lesson we will look at how do define and work with relationships with
JPA.

---

## ORM

Previously we talked about how JPA is a specification for manipulating database
records with Java objects. In this lesson we will use the ORM (Object to
Relational Mapper) facilities of the JPA.

An ORM lets us treat our relational data as if it is object-oriented. For
example, instead of saying that we have a record for an post in the database and
the post record has a column for `user_id` that identifies the user record who
created the post, we can simply say that an `Post` object has a `User` property.
Similarly, we will be able to say that a `User` object has a property `posts` that
is a list of `Post` objects. This allows us to focus less on the database details
and more on our application-specific logic.

---
## `@ManyToOne`

Mapping a many-to-one relationship with JPA is as easy as adding the `@ManyToOne`
annotation. Following our example, posts belong to a single `User`.

```java
@Entity
@Table(name="posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String title;

    @Column
    private String content;

    @ManyToOne
    @JsonIgnoreProperties({"posts", "password"})
    private User user;
}
```

This mapping is equivalent to the following MySQL table definition:

```sql
CREATE TABLE posts (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content VARCHAR(255),
    user_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

As you can see, Hibernate generates a column name based on the property name, in
this case, **the property `user` generates a column `user_id`**.

---
## `@OneToMany`

A many-to-one association and a one-to-many association are the same association
seen from the perspective of the owning and subordinate entities, respectively.

Going back to our `Post` class, a post can have several images; we can map this as a
bi-directional association as follows:

```java
@Entity
@Table(name="posts")
public class Post {
    /* ... */

   @OneToMany(mappedBy = "post")
   @JsonIgnoreProperties("post")
   private List<PostImage> images;
}
```

```java
@Entity
@Table(name="post_images")
public class PostImage {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String path;

    @ManyToOne
    private Post post;
}
```

The `post_images` definition would look like the following:

```sql
CREATE TABLE post_images (
    id BIGINT NOT NULL AUTO_INCREMENT,
    path VARCHAR(255) NOT NULL,
    post_id BIGINT,
    PRIMARY KEY (id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
);
```

In this case, Hibernate generated a `post_id` column from the `private Post post;` property in `PostImage`

---
## @ManyToMany

Continuing our example, let's create a many-to-many relationship between posts and
categories.

The mapping for a ***Posts-to-Categories*** would look like the following:

```java
@Entity
@Table(name="posts")
public class Post {
    /* ... */

    @ManyToMany(
            fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.REFRESH},
            targetEntity = Category.class)
    @JoinTable(
            name="post_category",
            joinColumns = {@JoinColumn(name = "post_id", nullable = false, updatable = false)},
            inverseJoinColumns = {@JoinColumn(name="category_id", nullable = false, updatable = false)},
            foreignKey = @ForeignKey(ConstraintMode.CONSTRAINT),
            inverseForeignKey = @ForeignKey(ConstraintMode.CONSTRAINT)
    )
    @JsonIgnoreProperties("posts")
    private Collection<Category> categories;
    
    /* ... */
}
```

The key part above is `@JoinTable` with the `name` attribute, `joinColumns`, and `inverseJoinColumns` attributes. 
This is helping inform how to create the eventual `Join Table` in our database.

---
### `fetch`, `cascade`, `targetEntity`

Wondering what those attributes in `@ManyToMany` mean?

Although we won't talk in-depth about each attribute's individual components, here is how they benefit us here:

- `fetch` - [Fetch Types in Hibernate](https://www.baeldung.com/hibernate-lazy-eager-loading)
  - `FetchType.LAZY` - Tells Hibernate to not load child object's data until it is *absolutely* necessary. For example, don't load the categories until the post is serialized to JSON
  - `FetchType.EAGER` - Hibernate should load the categories on a post *immediately*. This is useful if you need to do additional logic on a post's categories before sending a response to the client.
- `cascade`
  - For a thorough explanation, check [this](https://www.baeldung.com/jpa-cascade-types) out!
- `targetEntity`
  - This attribute's value will inform Hibernate to serialize the `categories` list as a collection of `Category` objects
  - This is useful when our Many-To-Many relationship is *bidirectional* with no true *owning* side (neither categories table nor posts table is the owner).

---

### From the `Category` side
```java
@Entity
@Table(name="categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;

    @ManyToMany(
            fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.REFRESH},
            targetEntity = Post.class)
    @JoinTable(
            name="post_category",
            joinColumns = {@JoinColumn(name = "category_id", nullable = false, updatable = false)},
            inverseJoinColumns = {@JoinColumn(name="post_id", nullable = false, updatable = false)},
            foreignKey = @ForeignKey(ConstraintMode.CONSTRAINT),
            inverseForeignKey = @ForeignKey(ConstraintMode.CONSTRAINT)
    )
    @JsonIgnoreProperties("categories")
    private Collection<Post> posts;
    
   /* ... */
}
```

Notice we are also adding the `@JoinTable` to `Category`? 

Not all Many-To-Many relationships are evaluated equally. Some have an *owner* table and some do not. 

In our case, we do *not* want an owner side of the relationship. 
This means that the `Post` and `Category` are treated equally, 
despite the relationship between them.

By adding `@JoinTable` and inverting the `joinColumns` and `inverseJoinColumns` 
(with swapped foreign key column names),
we are instructing Hibernate to allow *transactional* operations to be performed on either the `categories` or `posts` tables without adverse consequences (such as cascading a delete of category from the post to the deleting a record from the categories table).

Not *all* Many-To-Many relationships share in the behavior. For our context, it is very necessary!


The above would generate the following MySQL code:

```sql
CREATE TABLE categories (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE post_category (
    post_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```



###Of Note:

Notice that we did not have to create a POJO for `PostCategory`, yet we have a generated SQL Table called `post_category`?

Hibernate infers that the `@ManyToMany` designation, along with a `List<Post>` on the `Category` object and `List<Category>` on the `Post` object, means you want a Many-To-Many relationship -> meaning, a Join Table called `post_category` should be created.


Aren't ORMs great?

---
## Working With Relationships

These are *examples* of using relationships to discover information with Java code.

Here, we get the username of the user who posted a Post:

```java
Post post  = postRepository.getOne(1L);
String username = post.getUser().getUsername();
System.out.println(username);
```

Here, we set the `User` before creating a `Post`:

```java
User user = userRepository.getOne(1L); // just use the first user in the db
Post post = new Post();
post.setTitle("Why Use Spring?");
post.setContent("Because OMG it makes development so much faster!");
post.setUser(user);
postRespository.save(post);
```

Notice we are not setting the ID of the `Post`? 

The `id` column is auto-incrementing, so MySQL will take care of this!

---
### The following is a feature list to be implemented in your blog application:
## FEA-13: As a user, I can see previous posts with categories which have been published. 

If you haven't yet, complete the conversion of `User`, `Post`, and `Category` to be entities.
    
- Use annotations in order to do this
    

- Make sure that all **Object Relationships** are in place (1:1, 1:Many, Many:Many)
    

- Create repositories for each object.


- **TEST, TEST, TEST** (in Swagger and the UI)

---
## Further Reading

- [Getting Started Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/)
- [Relationships The JPA Way](http://www.javaworld.com/article/2077819/java-se/understanding-jpa-part-2-relationships-the-jpa-way.html)
- [Creating A Database Seeder](/appendix/further-reading/spring/seeder)


## Next Up: [Data Persistence, Pt III](14-data-persistence-iii.md)