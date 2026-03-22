package in.sujeeth.urlshortner.controllers;

import in.sujeeth.urlshortner.dtos.ClickEventDto;
import in.sujeeth.urlshortner.dtos.GenericResponse;
import in.sujeeth.urlshortner.dtos.UrlMappingDto;
import in.sujeeth.urlshortner.dtos.UrlRequest;
import in.sujeeth.urlshortner.models.User;
import in.sujeeth.urlshortner.services.UrlMappingService;
import in.sujeeth.urlshortner.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

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

    @GetMapping("/myurls")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<GenericResponse<List<UrlMappingDto>>> getUserUrls(Principal principal) {
        try {
            List<UrlMappingDto> userUrls = urlMappingService.getUserUrls(principal);
            var response = GenericResponse.<List<UrlMappingDto>>builder()
                    .response(userUrls)
                    .message("success")
                    .build();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            var response = GenericResponse.<List<UrlMappingDto>>builder()
                    .response(null)
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/analytics/{shortUrl}")
    @PreAuthorize(("hasRole('USER')"))
    public ResponseEntity<GenericResponse<List<ClickEventDto>>> getUrlAnalytics(@PathVariable String shortUrl,
                                                                                @RequestParam("startDate") String startDate,
                                                                                @RequestParam("endDate") String endDate) {
        try {
            LocalDateTime start = LocalDateTime.parse(startDate, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            LocalDateTime end = LocalDateTime.parse(endDate, DateTimeFormatter.ISO_LOCAL_DATE_TIME);

            List<ClickEventDto> events = urlMappingService.getClickEventsByDate(shortUrl, start, end);
            var response = GenericResponse.<List<ClickEventDto>>builder()
                    .response(events)
                    .message("success")
                    .build();
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            var response = GenericResponse.<List<ClickEventDto>>builder()
                    .response(null)
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/totalClicks")
    @PreAuthorize(("hasRole('USER')"))
    public ResponseEntity<GenericResponse<Map<LocalDate, Long>>> getClicksByDate(Principal principal,
                                                                                 @RequestParam("startDate") String startDate,
                                                                                 @RequestParam("endDate") String endDate) {
        try {
            LocalDate start = LocalDate.parse(startDate, DateTimeFormatter.ISO_LOCAL_DATE);
            LocalDate end = LocalDate.parse(endDate, DateTimeFormatter.ISO_LOCAL_DATE);
            User user = userService.getUserByUsername(principal.getName());
             Map<LocalDate, Long> totalClicks = urlMappingService. getClicksByDate(user, start, end);

            var response = GenericResponse.<Map<LocalDate, Long>>builder()
                    .response(totalClicks)
                    .message("success")
                    .build();
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            var response = GenericResponse.<Map<LocalDate, Long>>builder()
                    .response(null)
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.status(500).body(response);
        }
    }
}
