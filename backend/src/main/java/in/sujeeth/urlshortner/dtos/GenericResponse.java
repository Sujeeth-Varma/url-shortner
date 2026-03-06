package in.sujeeth.urlshortner.dtos;

import lombok.Builder;

@Builder
public class GenericResponse<T> {
    T response;
    String message;
}
