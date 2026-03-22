package in.sujeeth.urlshortner.controllers;

import in.sujeeth.urlshortner.models.UrlMapping;
import in.sujeeth.urlshortner.services.UrlMappingService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class RedirectController {

    private UrlMappingService urlMappingService;

    @GetMapping("/{shortUrl}")
    public ResponseEntity<Void> redirect(@PathVariable String shortUrl) {
        try {
            UrlMapping urlMapping = urlMappingService.getOriginalUrl(shortUrl);
            String target = urlMapping.getOriginalUrl();

            // Ensure absolute URL in Location header. If scheme missing, default to https.
            if (target != null) {
                String trimmed = target.trim();
                if (trimmed.startsWith("//")) {
                    // Protocol-relative URL -> assume https
                    target = "https:" + trimmed;
                } else if (!(trimmed.regionMatches(true, 0, "http://", 0, 7)
                        || trimmed.regionMatches(true, 0, "https://", 0, 8))) {
                    target = "https://" + trimmed;
                } else {
                    target = trimmed;
                }
            }

            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.add("Location", target);
            return ResponseEntity.status(302).headers(httpHeaders).build();
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }
}
