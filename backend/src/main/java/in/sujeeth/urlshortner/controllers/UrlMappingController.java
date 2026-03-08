package in.sujeeth.urlshortner.controllers;

import in.sujeeth.urlshortner.dtos.GenericResponse;
import in.sujeeth.urlshortner.dtos.UrlMappingDto;
import in.sujeeth.urlshortner.dtos.UrlRequest;
import in.sujeeth.urlshortner.models.User;
import in.sujeeth.urlshortner.services.UrlMappingService;
import in.sujeeth.urlshortner.services.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/urls")
@AllArgsConstructor
public class UrlMappingController {

    @Autowired
    private UrlMappingService urlMappingService;

    @Autowired
    private UserService userService;

    @PostMapping("/shorturl")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<GenericResponse<UrlMappingDto>> createShortUrl(@RequestBody UrlRequest request, Principal principal) {
        try {
            String longUrl = request.getLongUrl();
            User user = userService.getUserByUsername(principal.getName());
            UrlMappingDto result = urlMappingService.createShortUrl(longUrl, user);
            var response = GenericResponse.<UrlMappingDto>builder()
                    .response(result)
                    .message("success")
                    .build();
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
             var response = GenericResponse.<UrlMappingDto>builder()
                    .response(null)
                    .message("success")
                    .build();
            return ResponseEntity.status(500).body(response);
        }
    }
}
