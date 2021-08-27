# Data Persistence, Pt III

This lesson gives us a deeper dive into using `JpaRepository`.

---

## Defining Query Methods

We can define custom queries by following Spring's naming
convention for queries. If we ***name*** our method the correct way, and define the
correct ***return type***, Spring will automatically fill in the functionality for us:

```java
public interface PostRepository extends JpaRepository<Post, Long> {
    Post findByTitle(String title); // select * from posts where title = ?
    Post findFirstByTitle(String title); // select * from posts where title = ? limit 1
}
```

The naming convention is as follows:

```JAVA
ObjectToReturn findByColumnName(columnValue);
        
ie:
Post findByUserId(long userId);
```

---
## Custom Queries
If we need something more fine-tuned, we can use the `@Query` annotation to specify
the query that should be run for the method. 

The string we put inside of the `@Query` annotation is HQL, or Hibernate Query Language. 

It is very similar to, but slightly different from SQL.

By default, Spring Data JPA uses position-based parameter binding, as described in all the preceding examples. 

This makes query methods a little error-prone when refactoring regarding the parameter position.

To solve this issue, you can use `@Param` to give a method parameter a concrete name and bind the name in the query, as shown in the following example:

```java
public interface PostRepository extends JpaRepository<Post, Long> {
     // The following method is equivalent to the built in `getOne` method, there's no need to create this example
    @Query("from posts a where a.id like ?1")
    Post getPostById(long id);
    
    // The following method shows you how to use named parameters in a HQL custom query:    
    @Query("from posts a where a.title like %:term%")
    List<Post> searchByTitleLike(@Param("term") String term);
}
```
---

### Use the above examples as templates to complete:

## FEA-6-G: Add `findByUsername` and `findByEmail` to `UsersRepository`

---

## Next Up: [Code-First Database Design](15-code-first.md)