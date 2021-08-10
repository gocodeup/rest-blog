
# Code-First Database Design

If we follow the conventions of Spring Data with JPA, we will *not* need to create our
database tables manually, Hibernate will create them for us.

This is a design pattern called **Code-First Database Design**. 

Put simply, it means we are creating a database schema from our ***code*** instead of **Database-First Design**, 
which means we script a database before integrating persistence into our code.

You'll notice a line in the `application.properties` file from earlier:

```
spring.jpa.hibernate.ddl-auto=update
```

This tells Hibernate to look through all of our defined entities and make any
updates it needs to our database structure, including creating any tables
that do not exist.

***However, if we drop a field from our entity, we need to either drop that column in the database table or regenerate the table.***

And yes, we have still not run our application!

## Next Up: [Dependency Injection and Controller Integration](16-di-integration.md)