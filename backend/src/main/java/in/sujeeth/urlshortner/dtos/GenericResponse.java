package in.sujeeth.urlshortner.dtos;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class GenericResponse<T> {
    T response;
    String message;
}
