package com.example.restblog.web;

import com.example.restblog.data.User;
import com.example.restblog.data.UserRepository;
import com.example.restblog.errors.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.ConstraintViolationException;
import javax.validation.Valid;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.List;

@RestController
@RequestMapping(value="/api/users", headers="Accept=application/json")
@Slf4j
class UsersController {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    UsersController(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    List<User> all(OAuth2Authentication authentication) {
        String auth = (String) authentication.getUserAuthentication().getPrincipal();
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        if (role.equals(User.Role.USER.name())) {
            return repository.findAllByEmail(auth);
        }
        return repository.findAll();
    }

    @GetMapping("/search")
    List<User> search(@RequestParam String email, OAuth2Authentication authentication) {
        String auth = (String) authentication.getUserAuthentication().getPrincipal();
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        if (role.equals(User.Role.USER.name())) {
            return repository.findAllByEmailContainsAndEmail(email, auth);
        }
        return repository.findByEmailContains(email);
    }

    @GetMapping("/findByEmail")
    @PreAuthorize("!hasAuthority('USER') || (authentication.principal == #email)")
    User findByEmail(@RequestParam String email, OAuth2Authentication authentication) {
        return repository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException(User.class, "email", email));
    }

    @GetMapping("/{id}")
    @PostAuthorize("!hasAuthority('USER') || (returnObject != null && returnObject.email == authentication.principal)")
    User one(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException(User.class, "id", id.toString()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("!hasAuthority('USER') || (authentication.principal == @userRepository.findById(#id).orElse(new com.example.restblog.data.User()).email)")
    void update(@PathVariable Long id, @Valid @RequestBody User res) {
        User u = repository.findById(id).orElseThrow(() -> new EntityNotFoundException(User.class, "id", id.toString()));
        res.setPassword(u.getPassword());
        // TODO: implement other response properties here
        repository.save(res);
    }

    @PostMapping
    @PreAuthorize("!hasAuthority('USER')")
    User create(@Valid @RequestBody User res) {
        return repository.save(res);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("!hasAuthority('USER')")
    void delete(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
        } else {
            throw new EntityNotFoundException(User.class, "id", id.toString());
        }
    }

    @PutMapping("/{id}/changePassword")
    @PreAuthorize("!hasAuthority('USER') || (#oldPassword != null && !#oldPassword.isEmpty() && authentication.principal == @userRepository.findById(#id).orElse(new net.reliqs.gleeometer.users.User()).email)")
    void changePassword(@PathVariable Long id, @RequestParam(required = false) String oldPassword, @Valid @Size(min = 3) @RequestParam String newPassword) {
        User user = repository.findById(id).orElseThrow(() -> new EntityNotFoundException(User.class, "id", id.toString()));
        if (oldPassword == null || oldPassword.isEmpty() || passwordEncoder.matches(oldPassword, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(newPassword));
            repository.save(user);
        } else {
            throw new ConstraintViolationException("old password doesn't match", new HashSet<>());
        }
    }
}
