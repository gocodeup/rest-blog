# Data Access in Spring

### *Note: for the next few lessons, we will not run our application. This is to allow for a full set of instruction before seeing the end results.*


---
### This lesson will be a contiuation of: 
## FEA-6: As a user, I can view, edit, and delete information about myself.

### And will introduce, as part of this lesson:
## FEA-12: Creation of and changes to posts will be stored

---

## Treat this lesson as the implementation of FEA-12:
## Repositories + JPA

While there are many ways to interface with a database within Spring,
one of the fastest and most intuitive methods is to use Spring Data with JPA.

In this lesson we will start learning about the **J**ava **P**ersistence **A**PI, and how to
work with **JPA** entities in the Spring framework.

---

## Database Setup
Before we can use the Spring framework's built-in data access abilities, we need
a database user for our application. Configure a new data source in your project
or login into your mysql server using the terminal client and run the following queries:

```sql
CREATE DATABASE IF NOT EXISTS blog_db;

CREATE USER 'blog_user'@'localhost' IDENTIFIED BY 'p@$$w0rd';
GRANT ALL ON blog_db.* TO 'blog_user'@'localhost';
```

Why aren't we setting up a schema yet? 

***Find out on the next episode of Spring.. Data.. Super!***

---
## Configuration

Now we need to configure our data source with Spring.

Add the following to your `application.properties` file, located in
`src/main/resources`:

```
spring.datasource.url=jdbc:mysql://localhost/blog_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=blog_user
spring.datasource.password=p@$$w0rd
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Change the values to be specific for your database setup, if needed.

Next, add the following to your `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```

The above configuration will include the necessary libraries for our
application, and set our database credentials in the `application.properties`
file so that Spring can access them.

---
## What is JPA?

JPA (Java Persistence API) is a Java specification for accessing, persisting, and managing data between
Java objects and a relational database.

JPA is considered the standard industry approach for **Object to Relational
Mapping (ORM)** in the Java World.

JPA itself is just a specification, not a product; it cannot perform persistence
or anything else by itself. JPA is just a set of interfaces, and requires an
implementation. 

Hibernate is one implementation of the JPA specification, and
will be what we use.

---
## JPA Annotations

Previously, we have created POJOs (Plain old Java objects) as our *models*, that
is, a class that represents data from our database. Now we will use some JPA
annotations to formally specify the mapping of our objects to database tables.

The first step is to annotate our POJOs as JPA entities. 

Like many other dependencies, we must import the packages in order to use their functionalities.

Add `@Entity` over your `Post` class declaration as such:


```java
import javax.persistence.*;

@Entity
public class Post {
    /* More code here... */
}
```

Now, hover over that `@Entity` annotation and import the `javax.persistence` package. 

Be *sure* not to accidentally import the Hibernate version of `@Entity`

---
### Primary keys

### `@Id` & `@GeneratedValue`
Each entity has to have a primary key, which you annotate with the `@Id`
annotation.

If you want the database to generate automatically an identifier for each
row, add one more annotation: `@GeneratedValue(strategy = GenerationType.IDENTITY)`. Now, the database is
responsible for determining and assigning the next primary key
(`AUTO_INCREMENT` in MySQL).

```java
@Entity
public class Post {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
}
```

Table names are derived from the entity names. Given the class `Post` with a
simple `@Entity` annotation, the table name would be `posts`.

The table name can be configured via the `@Table` annotation. The `@Table`
annotation provides four attributes, allowing you to override the name of the
table. Typically, you would only provide a substitute table name thus:

```JAVA
@Entity
@Table(name="posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
}
```

### Mapping Properties and Fields


### `@Column`
The `@Column` annotation is used to specify the details of the column to which a
field or property will be mapped. Some of the details are schema related, and
therefore apply only if the schema is generated from the annotated files.

You can customize the values of the following attributes:

* `name` allows us to specify the column name. The default value for a column would be
  the name of the property. You'll want to override the default behavior, for instance,
  when you have a column name `last_name`, but the property in your POJO is
  `lastName`.
* `length` permits the maximum size of the column's contents (particularly a string value) to be
  explicitly defined. The column size defaults to 255 characters.
* `nullable` permits the column to be marked `NOT NULL` when the schema is
  generated. The default permits a column's contents to be `null`, ie
  `nullable = true`.
* `unique` permits the column to be marked as containing only unique values.
  This defaults to false.

```java
@Entity
@Table(name="posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false)
    private String content;
    
    ...
}
```

This mapping is equivalent to the following MySQL table definition:

```sql
CREATE TABLE posts (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    content VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);
```

---
## Repositories

Similar to the DAOs we manually configured and coded, repositories are a tool for interfacing with a database.

In Spring, the Data Access Layer, has a predefined parent class (also called base class) called
`JpaRepository`. 

We will extend `JpaRepository` and define the type of objects it
will be manipulating (`<Post, Long>`), as well as the data type of the entity's id (`Long`).

```java
public interface PostsRepository extends JpaRepository<Post, Long> {

}
```

You may be wondering why we are not defining methods in this interface.

Thanks to extending `JpaRepository<T, ID>`, we have a set of predefined methods from a large web of classes from which `JpaRepository` inherits.

To get an idea, check out methods defined in the documentation on the following inherited interfaces:

- [PagingAndSortingRepository<T, ID](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/PagingAndSortingRepository.html)
- [QueryByExampleExecutor<T>](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/query/QueryByExampleExecutor.html)
- [CrudRespository<T, ID>](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html)


Just by defining an interface that extends `JpaRepository`, we can start using
it in our other classes!

By extending `JpaRepository`, we inherit the CRUD functionality that the Spring
framework provides, including methods for retrieving an Iterable Interface[^1] with all the posts (`findAll`), a
specific ad (`getOne`), inserting or updating an ad (`save`), and deleting an
ad (`delete`).

---
## FEA-6-F: Implement persistence for the `User`

1. Convert the `User` object to an Entity.

2. Inside the `data` package, create a `UserRepository` much like for `PostRepository`.

Why no `Category` repository? More to come!!

---
## Further Reading

- [JPA Reference](https://www.oracle.com/technical-resources/articles/javaee/marx-jpa.html)
- [JPA Repository](https://www.baeldung.com/spring-data-repositories#jprepository)
- [Defining Custom Query Methods](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repositories.query-methods.query-creation)
- [Using the `@Query` Annotation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.query-methods.at-query)
- [The Object Oriented Paradigm of Data Persistence](http://www.javaworld.com/article/2077817/java-se/understanding-jpa-part-1-the-object-oriented-paradigm-of-data-persistence.html)

## Next Up: [Data Persistence, Pt II](13-data-persistence-ii.md)








