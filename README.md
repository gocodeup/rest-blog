# REST Blog

This project is a sandbox for various SPA solutions to build a frontend interface for a basic blogging API. Various branches will contain different approaches to this, including using only "vanilla JS," Vue JS, and React.

## General Architecture

The application is divided into 2 pieces:

- A backend Spring Server which handles:
    - Security
  - Data Persistence (communication w/ our DB)
  - Data Resources (as JSON)
  - Serving Static Resources (the frontend)
    
- A frontend Javascript Client which is responsible for:
    - Rendering the UI
    - Handling interactivity with the UI
    - Making requests for data resources to the backend
    
In addition, this application comes with a dependency on ```springdoc-openapi-ui```

We can use this tool to quickly test resource endpoints by navigating to http://localhost:8080/swagger-ui.html

Swagger is an excellent tool which provides full documentation of exposed endpoints, including sample requests and responses - makes the job of testing very smooth!

##Security
### Security for this project will handled using an implementation of OAuth2.0 in Spring Boot / Spring Security
#### Further Reading from Sergio Moretti @ [toptal](https://www.toptal.com/spring/spring-boot-oauth2-jwt-rest-protection)

#### Credit to Sergio Moretti for providing the template for this project under the GNU License
#### Check out his [GitHub Here](https://github.com/sermore)

#### Security Breakdown:

There are 4 essential components of OAuth2.0 security:

- Client
  - The application used to access protected resources
- Authorization Server
  - Responsible for verifying the Client (frontend) 
    and Resource Owner trying to access protected resources
- Resource Owner
  - The end-user in our application context
- Resource Server
    - The provider of endpoints from which a client can request protected resources

Normally, these components are divided into two applications: one for the Auth server and one for the Resource server

In our case, we can use Spring Security OAuth2 Autoconfigure to bring all of these components under the same umbrella.
This makes the development experience much more seamless because we are already placing the Client and Resource server in one project.

###Auth Flow

(If the user exists already, skip to step 3)
1. The Client sends a POST request to ```/api/users``` to make a new User
2. On successful creation, server redirects to ```/oauth/token``` with User credentials
3. ```/oauth/token``` responds to ORIGINAL request route with an ```access_token``` and ```refresh_token```
4. Client accepts the response and places tokens into ```localStorage```
5. The Resource Owner (new User) is now 'logged in' and may begin making requests to protected endpoints.
    - When making requests to ```/api/*```, the Client must include the ```access_token``` as an ```Authorization``` header of type ``Bearer``
  ```
  {
  "headers": {
    "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiYXBpIl0sInVzZXJfbmFtZSI6InNhbXVlbEBjb2RldXAuY29tIiwic2NvcGUiOlsicmVhZCIsIndyaXRlIl0sImV4cCI6MTYyNzEwMzU3OSwiYXV0aG9yaXRpZXMiOlsiVVNFUiJdLCJqdGkiOiJhYTFiZGE5MS0zZjAxLTQ4YzMtYmNiNC03MzYyZTkwMWJlMzQiLCJjbGllbnRfaWQiOiJyZXN0LWJsb2ctY2xpZW50In0.gmEVUs2xYgmCGxVc7IYPC0Lhw5LUuiAQVjLQD_UrOpA",
    "content-type": "application/json",
  },
  "referrer": "http://localhost:8080/posts",
  "method": "GET"
}
```

#### ***Of Note:*** 
If the server shuts down, the tokens become invalid. The User must "log in" again.

