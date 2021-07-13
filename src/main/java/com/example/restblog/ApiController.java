package com.example.restblog;

import com.example.restblog.data.Post;
import com.example.restblog.data.PostRepository;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Controller
@RequestMapping("api")
public class ApiController {

    private final PostRepository postRepository;

    public ApiController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping("/posts")
    @ResponseBody
    private List<Post> getPosts() {
        List<Post> posts = new ArrayList<>();

        try {
            posts = postRepository.findAll();
        }catch (Exception ex){
            System.out.println(ex.getLocalizedMessage());
        }
        return posts;
    }

    @PostMapping("/posts")
    @ResponseBody
    private void createPost(@RequestBody Post newPost){
        try {
            postRepository.save(newPost);
        }catch (Exception ex){
            System.out.println(ex.getLocalizedMessage());
        }
    }


//
//    @GetMapping("/entities")
//    @ResponseBody
//    private List<TestEntity> getEntities() {
//        List<TestEntity> entities = new ArrayList<>(Arrays.asList(
//                new TestEntity("En 1"),
//                new TestEntity("En 2"),
//                new TestEntity("En 3")
//        ));
//        return entities;
//    }

}
