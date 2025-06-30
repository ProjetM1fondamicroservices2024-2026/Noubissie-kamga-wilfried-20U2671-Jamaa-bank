package com.jamaa.banks.config;

import org.springframework.graphql.server.WebGraphQlInterceptor;
import org.springframework.graphql.server.WebGraphQlRequest;
import org.springframework.graphql.server.WebGraphQlResponse;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import com.jamaa.banks.utils.JwtUtils;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtGraphQLInterceptor implements WebGraphQlInterceptor {
    
    private final JwtUtils jwtUtils;
    
    @Override
    public Mono<WebGraphQlResponse> intercept(WebGraphQlRequest request, Chain chain) {
        try {
            // Extraire le token du header Authorization
            String authHeader = request.getHeaders().getFirst("Authorization");
            
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new RuntimeException("Token d'authentification manquant");
            }
            
            String token = authHeader.substring(7);
            
            // Valider le token
            var claims = jwtUtils.validateToken(token);
            
            // Ajouter les infos utilisateur au contexte GraphQL
            request.configureExecutionInput((executionInput, builder) -> 
                builder.graphQLContext(contextBuilder -> 
                    contextBuilder
                        .put("userId", claims.get("id", Long.class))
                        .put("userEmail", claims.getSubject())
                        .put("token", token)
                        .build()
                ).build()
            );
            
            return chain.next(request);
            
        } catch (Exception e) {
            // Retourner une erreur GraphQL
            return Mono.error(new RuntimeException("Authentification échouée: " + e.getMessage()));
        }
    }
}