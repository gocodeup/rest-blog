# Data Persistence, Pt II

In this lesson we will look at how do define and work with relationships with
JPA.

---

## ORM

Previously we talked about how JPA is a specification for manipulating database
records with Java objects. In this lesson we will use the ORM (Object to
Relational Mapper) facilities of the JPA.

An ORM lets us treat our relational data as if it is object-oriented. For
example, instead of saying that we have a record for an ad in the database and
the ad record has a column for `user_id` that identifies the user record who
created the ad, we can simply say that an `Ad` object has a `User` property.
Similarly, we will be able to say that a `User` object has a property `ads` that
is a list of `Ad` objects. This allows us to focus less on the database details
and more on our application-specific logic.

---
## One-to-One

Mapping a one-to-one relationship with JPA is as easy as adding the `@OneToOne`
annotation. Following our example, ads belong to a single `User`.

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

    @OneToOne
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
## One-to-Many

A many-to-one association and a one-to-many association are the same association
seen from the perspective of the owning and subordinate entities, respectively.

Going back to our `Post` class, a post can have several images; we can map this as a
bi-directional association as follows:

```java
@Entity
@Table(name="posts")
public class Post {
    /* ... */

   @OneToMany(cascade = CascadeType.ALL, mappedBy = "post")
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
    @JoinColumn (name = "post_id")
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
## Many-to-Many

Continuing our example, let's create a many-to-many relationship between ads and
categories.

The mapping would look like the following:

```java
@Entity
@Table(name="posts")
public class Post {
    /* ... */

   @ManyToMany(cascade = CascadeType.ALL)
   @JoinTable(
       name="post_category",
       joinColumns={@JoinColumn(name="post_id")},
       inverseJoinColumns={@JoinColumn(name="category_id")}
   )
   private List<PostCategory> categories;
}
```

The key part above is `@JoinTable` with the `name`, `joinColumns`, and `inverseJoinColumns` attributes. This is helping inform how to create the eventual `Join Table` in our database.

```java
@Entity
@Table(name="categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;

    @ManyToMany(mappedBy = "categories")
    private List<Post> posts;
}
```

This would generate the following MySQL code:

```sql
CREATE TABLE categories (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE post_category (
    ad_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    FOREIGN KEY (ad_id) REFERENCES posts(id),
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

Here, we get the username of the user who posted an Ad:

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
## The following is a feature list to be implemented in your blog application
### FEA-9: As a user, I can see previous posts with categories which have been published. 

If you haven't yet, complete the conversion of `User`, `Post`, and `Category` to be entities.
    
- Use annotations in order to do this
    

- Make sure that all **Object Relationships** are in place (1:1, 1:Many, Many:Many)
    

- Create repositories for each object.

---
## Further Reading

- [Getting Started Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/)
- [Relationships The JPA Way](http://www.javaworld.com/article/2077819/java-se/understanding-jpa-part-2-relationships-the-jpa-way.html)
- [Creating A Database Seeder](/appendix/further-reading/spring/seeder)


## Next Up: [Data Persistence, Pt III](14-data-persistence-iii.md)