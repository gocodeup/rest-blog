package com.example.restblog;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Controller
@RequestMapping("api")
public class ApiController {

    @GetMapping("/posts")
    @ResponseBody
    private List<Post> getPosts() {
        List<Post> posts = new ArrayList<>(Arrays.asList(
                new Post(1, "Post 1"),
                new Post(2, "Post 2"),
                new Post(3, "Post 3")
        ));
        return posts;
    }

    @GetMapping("/entities")
    @ResponseBody
    private List<TestEntity> getEntities() {
        List<TestEntity> entities = new ArrayList<>(Arrays.asList(
                new TestEntity("En 1"),
                new TestEntity("En 2"),
                new TestEntity("En 3")
        ));
        return entities;
    }

}
