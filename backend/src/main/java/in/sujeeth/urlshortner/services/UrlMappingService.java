package in.sujeeth.urlshortner.services;

import in.sujeeth.urlshortner.dtos.UrlMappingDto;
import in.sujeeth.urlshortner.models.UrlMapping;
import in.sujeeth.urlshortner.models.User;
import in.sujeeth.urlshortner.repositories.UrlMappingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class UrlMappingService {

    @Autowired
    private UrlMappingRepository urlMappingRepository;

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
}
