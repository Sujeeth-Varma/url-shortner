package in.sujeeth.urlshortner.dtos;

import lombok.Data;

@Data
public class SigninRequest {
    private String username;
    private String password;
}
