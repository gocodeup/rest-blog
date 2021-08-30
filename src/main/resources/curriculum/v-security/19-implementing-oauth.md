# Implementing OAuth 2.0

This setup will involve a lot of follow-along!

Be sure to pay **close attention** to details in this lesson. Naming, placement, and ordering are paramount!

---
### The following is a feature list to be implemented in your application

## FEA-14: As a validated user, I can create, edit and delete posts.

## FEA-15: As an anonymous user, I can neither create, edit, nor delete posts.

## FEA-16: As an ADMIN user, I have full access to create, edit, and delete any posts.

---
## TODO: Create the Resource Owner

### 1. Let's drop a few dependencies into our `pom.xml`:

```XML
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
  <groupId>org.springframework.security.oauth.boot</groupId>
  <artifactId>spring-security-oauth2-autoconfigure</artifactId>
  <version>2.1.0.RELEASE</version>
</dependency>
```

### 2. Create a package named `security`

### 3. Inside `security`, create a class named `UserService`.

- This class begins registering our Resource Owner with Spring Security
  

- As well, it pulls the `Role` from our `User` in order to allow Spring Security to do Authorizations.

```JAVA

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = repository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found: " + email));
        GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().name());
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), Arrays.asList(authority));
    }
}
```

---

## TODO: Create the Authorization Server

### 1. In `security`, create a class named `ServerSecurityConfig`.

- This class begins orchestrating a more full picture of the `User` in relation to our application
  

- It authenticates the source of the `User` (`UserService` / `UserRepository`)
  

- Also, it provides an injection point for our password encryption tool (`BCryptPasswordEncoder`)
  

- Lastly, it tells Spring Security to enable our ability to set Auth on individual methods within the application.

```JAVA

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, proxyTargetClass = true)
public class ServerSecurityConfig extends WebSecurityConfigurerAdapter {


    private final UserDetailsService userDetailsService;

    public ServerSecurityConfig(@Qualifier("userService")
                                        UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder());
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

}
```
---
### 2. In `security` Create a class named `OAuthConfiguration`.

Here, we bind together our 
  - Resource Owner -> `User`/`UserDetailsService`, 
  - `AuthenticationManager` -> provided through delegation via `ServerSecurityConfig`, 
  - `PasswordEncoder` -> Defined in `ServerSecurityConfig` as a Bean (`@Bean`)
    
We bring together these resources in order to help create the definition of our token, as well as the mechanisms to be used for: 
- building the token
- converting the token to/from a JWT to a Java object
- inform Spring Security of how to compare claims in a token to our registered `UserDetailsService` implementation (`UserService`).


```JAVA

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;

@Configuration
@EnableAuthorizationServer
public class OAuthConfiguration extends AuthorizationServerConfigurerAdapter {

    private final AuthenticationManager authenticationManager;

    private final PasswordEncoder passwordEncoder;

    private final UserDetailsService userService;

    @Value("${jwt.clientId:rest-blog-client}")
    private String clientId;

    @Value("${jwt.client-secret:secret}")
    private String clientSecret;

    @Value("${jwt.signing-key:123}")
    private String jwtSigningKey;

    @Value("${jwt.accessTokenValidititySeconds:43200}") // 12 hours
    private int accessTokenValiditySeconds;

    @Value("${jwt.authorizedGrantTypes:password,authorization_code,refresh_token}")
    private String[] authorizedGrantTypes;

    @Value("${jwt.refreshTokenValiditySeconds:2592000}") // 30 days
    private int refreshTokenValiditySeconds;

    public OAuthConfiguration(AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder, UserDetailsService userService) {
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }

    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        clients.inMemory()
                .withClient(clientId)
                .secret(passwordEncoder.encode(clientSecret))
                .accessTokenValiditySeconds(accessTokenValiditySeconds)
                .refreshTokenValiditySeconds(refreshTokenValiditySeconds)
                .authorizedGrantTypes(authorizedGrantTypes)
                .scopes("read", "write")
                .resourceIds("api");
    }

    @Override
    public void configure(final AuthorizationServerEndpointsConfigurer endpoints) {
        endpoints
                .accessTokenConverter(accessTokenConverter())
                .userDetailsService(userService)
                .authenticationManager(authenticationManager);
    }

    @Bean
    JwtAccessTokenConverter accessTokenConverter() {
        JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
        return converter;
    }

}
```

In this class, we see the following fields are for the purpose of defining the content and claims within our token:

```JAVA
    @Value("${jwt.clientId:rest-blog-client}")
    private String clientId;

    @Value("${jwt.client-secret:secret}")
    private String clientSecret;

    @Value("${jwt.signing-key:123}")
    private String jwtSigningKey;

    @Value("${jwt.accessTokenValidititySeconds:43200}") // 12 hours
    private int accessTokenValiditySeconds;

    @Value("${jwt.authorizedGrantTypes:password,authorization_code,refresh_token}")
    private String[] authorizedGrantTypes;

    @Value("${jwt.refreshTokenValiditySeconds:2592000}") // 30 days
    private int refreshTokenValiditySeconds;
```

Later on, we will change the `jwtSigningKey` to be something a *little* more secure than `123`. For now, as we are just beginning our learning process, let's move on.

---

## TODO: Create the Resource Server

### In `security`, create a class named `ResourceServerConfiguration`.

- This class is responsible for the actual securing of individual endpoints defined in our controllers.
- We can define
    - which endpoints are accessible by all
    - which require authentication
    - what methods of Auth are to be used in order to allow/deny access to our endpoints

```JAVA

import com.example.restblog.errors.CustomAccessDeniedHandler;
import com.example.restblog.errors.CustomAuthenticationEntryPoint;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;

@Configuration
@EnableResourceServer
public class ResourceServerConfiguration extends ResourceServerConfigurerAdapter {

    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    public ResourceServerConfiguration(CustomAuthenticationEntryPoint customAuthenticationEntryPoint) {
        this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
    }

    @Override
    public void configure(ResourceServerSecurityConfigurer resources) {
        resources.resourceId("api");
    }

  @Override
  public void configure(HttpSecurity http) throws Exception {
      http
          .formLogin()
              .disable()
          .sessionManagement()
              .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
          .and()
              .authorizeRequests()
              .antMatchers("/api/users")
                .hasAnyAuthority("ADMIN", "USER")
              .antMatchers("/api/posts")
                .hasAnyAuthority("ADMIN", "USER")
              .antMatchers("/swagger-ui/**", "/v3/api-docs/**")
                .permitAll()
              .antMatchers("/api/users/create")
                .permitAll()
              .antMatchers("/**")
                .permitAll()
              .anyRequest().authenticated()
          .and()
              .exceptionHandling()
                .authenticationEntryPoint(customAuthenticationEntryPoint)
                .accessDeniedHandler(new CustomAccessDeniedHandler());
  }
}

```

### `configure(ResourceServerSecurityConfigurer resources)`

This method allows us to simply define the overall context of our resource. Often you may hear this referred to as a `realm`, `resource`, or `audience`.

Basically, we want to let Spring Security know that `/api` is the beginning of our security context and concern.

---
### `configure(HttpSecurity http)` 

This is where define top-level restrictions to protected resources, as well as declare what endpoints are allowed by everyone (even anonymous users).

### Restricting Access:

```JAVA
.antMatchers("/api/users")
    .hasAnyAuthority("ADMIN", "USER")
.antMatchers("/api/posts/**")
    .hasAnyAuthority("ADMIN", "USER")
```

We are declaring that anyone making requests to `/api/users` must have the Role of `ADMIN` or `USER`.

We do the same for `api/posts`, but use a subsequent method chain for visual purposes.

### Permitting Access

```JAVA
  .antMatchers("/swagger-ui/**", "/v3/api-docs/**")
    .permitAll()
  .antMatchers("/api/users/create")
    .permitAll()
  .antMatchers("/**")
    .permitAll()
```

In this snippet (from above, as well), we declare that our Open API endpoints (Swagger), are allowed access by any anonymous user. This is for continuity of our development process in regards to testing.


Importantly, the next `antMatcher` shows that we are allowing anonymous access to `api/users/create`.

Think about it: if a user hasn't registered with our system, how could we begin to authenticate them through a Password Grant auth flow? So, in this case, we allow a request through to this endpoint.

Lastly, the pattern `/**` is indicating that any path after an initial `/` is permitted.

Now, while this may seem counter-intuitive to our entire idea of locking down endpoints, the ***order*** of our pattern matching ensures that the endpoints `api/users` and `api/posts` are secured *then* anything remaining is allowed.

---
### For your consideration

Will this be exactly the configuration per-endpoint you use? Probably not! This is a very draconian approach in that we are totally locking down our `api/**` endpoints aside from `api/users/create`.

Think of our anonymous user: should they be able to see all posts? See information on the User who posted?

We may need a way to be specific on the access provided to endpoints under each umbrella (`api/users`, `api/posts`, etc).

This could be accomplished by appending to our paths in each controller method but that could get a bit... overwhelming:

```
omg/make/it/stop/how/will/anyone/ever/remember/this/path
```

Instead, we will later learn how to use **more** annotations with very familiar boolean expressions to apply specific access requirements to individual methods without changing anything about the path or method behavior.

---

## Testing

At this point, it's time for us to explore what this security buys us.

As well, we are going to begin understanding the constraints it places on access to our application's endpoints.

## Next Up: [Testing with OAuth 2.0](20-testing-oauth.md)







