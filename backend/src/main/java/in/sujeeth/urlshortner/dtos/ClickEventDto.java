package in.sujeeth.urlshortner.dtos;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ClickEventDto {
    private Long id;
    private LocalDate clickDate;
    private Long count;
}
