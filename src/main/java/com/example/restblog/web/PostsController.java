package com.example.restblog.web;

import com.example.restblog.data.Post;
import com.example.restblog.data.PostRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping(value="/api/posts", headers="Accept=application/json")
public class PostsController {

    private final PostRepository postRepository;

    public PostsController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping
    private List<Post> getPosts() {
        List<Post> posts = new ArrayList<>();
        try {
            posts = postRepository.findAll();
            System.out.println(posts);
        } catch (Exception ex) {
            System.out.println(ex.getLocalizedMessage());
        }
        return posts;
    }

    @PostMapping
    private void createPost(@RequestBody Post newPost) {
        try {
            postRepository.save(newPost);
        } catch (Exception ex) {
            System.out.println(ex.getLocalizedMessage());
        }
    }
}
