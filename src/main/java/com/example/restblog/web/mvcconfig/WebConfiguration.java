//package com.example.restblog.web.mvcconfig;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class WebConfiguration implements WebMvcConfigurer {
//    public static final String INDEX_VIEW_NAME = "forward:index.html";
//
//    public void addViewControllers(final ViewControllerRegistry registry) {
//        registry.addViewController("/").setViewName(INDEX_VIEW_NAME);
//        registry.addViewController("/login").setViewName(INDEX_VIEW_NAME);
//        registry.addViewController("/about").setViewName(INDEX_VIEW_NAME);
//        registry.addViewController("/home").setViewName(INDEX_VIEW_NAME);
//        registry.addViewController("/posts").setViewName(INDEX_VIEW_NAME);
//    }
//}
