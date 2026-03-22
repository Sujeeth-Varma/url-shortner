package in.sujeeth.urlshortner.services;

import in.sujeeth.urlshortner.dtos.ClickEventDto;
import in.sujeeth.urlshortner.dtos.UrlMappingDto;
import in.sujeeth.urlshortner.models.ClickEvent;
import in.sujeeth.urlshortner.models.UrlMapping;
import in.sujeeth.urlshortner.models.User;
import in.sujeeth.urlshortner.repositories.ClickEventRepository;
import in.sujeeth.urlshortner.repositories.UrlMappingRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UrlMappingService {

    private UrlMappingRepository urlMappingRepository;

    private UserService userService;

    private ClickEventRepository clickEventRepository;

    public UrlMappingDto createShortUrl(String longUrl, User user) {
        String shortUrl = generateShortUrl();
        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setOriginalUrl(longUrl);
        urlMapping.setShortUrl(shortUrl);
        urlMapping.setUser(user);
        urlMapping.setCreatedAt(LocalDateTime.now());
        UrlMapping savedUrl = urlMappingRepository.save(urlMapping);
        return convertToUrlMappingDto(savedUrl);
    }

    private UrlMappingDto convertToUrlMappingDto(UrlMapping urlMapping) {
        UrlMappingDto dto = new UrlMappingDto();
        dto.setUsername(urlMapping.getUser().getUsername());
        dto.setId(urlMapping.getId());
        dto.setOriginalUrl(urlMapping.getOriginalUrl());
        dto.setShortUrl(urlMapping.getShortUrl());
        dto.setClicks(urlMapping.getClickCount());
        dto.setCreatedAt(urlMapping.getCreatedAt());
        return dto;
    }

    private String generateShortUrl() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder shortUrl = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            shortUrl.append(characters.charAt(random.nextInt(characters.length())));
        }
        return shortUrl.toString();
    }
    
    private ClickEventDto clickEventDtoMapper(ClickEvent event) {
        ClickEventDto dto = new ClickEventDto();
        dto.setClickDate(LocalDate.from(event.getClickDate()));
        dto.setCount((long) event.getUrlMapping().getClickCount());
        dto.setId(event.getId());
        return dto;
    }

    public List<UrlMappingDto> getUserUrls(Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        return urlMappingRepository.getByUser(user)
                .orElseThrow(() -> new UsernameNotFoundException("user not found"))
                .stream()
                .map(this::convertToUrlMappingDto)
                .toList();

    }

    public List<ClickEventDto> getClickEventsByDate(String shortUrl, LocalDateTime start, LocalDateTime end) {
        UrlMapping url = urlMappingRepository.findByShortUrl(shortUrl);
        if (url != null) {
            return clickEventRepository.findByUrlMappingAndClickDateBetween(url, start, end)
                    .stream()
                    .collect(Collectors.groupingBy(e -> e.getClickDate().toLocalDate(), Collectors.counting()))
                    .entrySet().stream().map(entry -> {
                        ClickEventDto dto = new ClickEventDto();
                        dto.setClickDate(entry.getKey());
                        dto.setCount(entry.getValue());
                        return dto;
                    })
                    .toList();
        }
        return null;
    }

    public Map<LocalDate, Long> getClicksByDate(User user, LocalDate start, LocalDate end) {
        List<UrlMapping> urlMappings = urlMappingRepository.findByUser(user);
        List<ClickEvent> clickEvents = clickEventRepository.findByUrlMappingInAndClickDateBetween(urlMappings, start.atStartOfDay(), end.plusDays(1).atStartOfDay());
        return clickEvents.stream()
                .collect(Collectors.groupingBy(click ->  click.getClickDate().toLocalDate(), Collectors.counting()));
    }

    public UrlMapping getOriginalUrl(String shortUrl) {
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
        if (urlMapping == null) {
            throw new RuntimeException("shortUrl not found!");
        }
        urlMapping.setClickCount(urlMapping.getClickCount() + 1);
        urlMappingRepository.save(urlMapping);

        ClickEvent clickEvent = new ClickEvent();
        clickEvent.setClickDate(LocalDateTime.now());
        clickEvent.setUrlMapping(urlMapping);
        clickEventRepository.save(clickEvent);
        return urlMapping;
    }
}
