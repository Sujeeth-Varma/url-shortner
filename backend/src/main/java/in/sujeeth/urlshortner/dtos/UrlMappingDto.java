package in.sujeeth.urlshortner.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UrlMappingDto {
    private String originalUrl;
    private String shortUrl;
    private Long id;
    private int clicks;
    private LocalDateTime createdAt;
    private String username;
}
