//package com.example.restblog.security;
//
//import io.swagger.v3.oas.models.Components;
//import io.swagger.v3.oas.models.OpenAPI;
//import io.swagger.v3.oas.models.info.Info;
//import io.swagger.v3.oas.models.security.SecurityRequirement;
//import io.swagger.v3.oas.models.security.SecurityScheme;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//
//public class OpenApiConfig {
//    TODO: Attempted to add Auth component to Swagger. Didn't have time to flesh out
//    private static final String SECURITY_SCHEME_NAME = "Bearer oAuth Token";
//
//    /**
//     * Open API Configuration Bean
//     *
//     * @param title
//     * @param version
//     * @param description
//     * @return
//     */
//    @Bean
//    public OpenAPI openApiConfiguration(
//            @Value("${openapi.title}") final String title,
//            @Value("${openapi.version}") final String version,
//            @Value("${openapi.description}") final String description
//    ) {
//        return new OpenAPI()
//                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
//                .components(
//                        new Components()
//                                .addSecuritySchemes(SECURITY_SCHEME_NAME,
//                                        new SecurityScheme()
//                                                .name(SECURITY_SCHEME_NAME)
//                                                .type(SecurityScheme.Type.HTTP)
//                                                .scheme("bearer")
//                                                .bearerFormat("JWT")
//                                )
//                )
//                .info(new Info()
//                        .title(title)
//                        .version(version)
//                        .description(description)
//                );
//    }
//}
