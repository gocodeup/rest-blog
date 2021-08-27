# Project Setup

Throughout the course of this module, we will be building a blogging
application.

Building this application will allow you to learn how Spring handles basic CRUD
operations, as well as user authentication. In addition, you can use your blog
as a personal site to show off your Java and JavaScript chops!

---
## IntelliJ Setup

IntelliJ has built-in integration with the [Spring Initializr][1], which we will
be using to bootstrap our application.

[1]: http://start.spring.io/

1. Create a new Project in IntelliJ

1. For the project type, select "Spring Initializr"

    - Choose Java 11 for the Project SDK

1. Project Metadata

    - Make sure "Maven Project" is selected (it should be by default).
    - For the group and package name enter `com.codeup`.
    - For the "Artifact" and "Name" fields enter a name for your project without
      spaces.
    - Choose Java 11 under the Packaging field
    - Enter a brief description of your project in the "Description" field.

1. Next we will be prompted for the dependencies of our project.

   For the "Spring Boot" dropdown, select version 2.1.x

   Here we will select any dependencies that our project will have. This is
   just a shortcut for adding
   [spring-boot-starter](https://github.com/spring-projects/spring-boot/tree/master/spring-boot-project/spring-boot-starters#starters)
   `<dependency>` elements to our `pom.xml`. If you know what pieces of the
   Spring framework you are going to use, you would select them here.

   For now, just check "Web" -> "Web".

1. Now we will be prompted for a project name and location. Choose whatever name
   you prefer (this is just how we will refer to the project on your computer).

1. Add the following line to your `.gitignore` file

        src/main/resources/application.properties

1. Create an empty file at `src/main/resources/example.properties` and add it
   to Git. We'll use this file to communicate to other developers what settings
   are needed to run this application, without sharing our passwords or
   API keys in GitHub.

1. Create a new repository locally and on GitHub for this project.

1. Link the remote repository's SSH address to your local with `git remote add origin [your address]`.

1. Let's code!

##Next Up: [Blog App Features](2a-blog-features.md)

