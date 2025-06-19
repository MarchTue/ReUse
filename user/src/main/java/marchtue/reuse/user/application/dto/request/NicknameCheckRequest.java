package marchtue.reuse.user.application.dto.request;

import jakarta.validation.constraints.NotBlank;

public record NicknameCheckRequest(

    @NotBlank String nickname
) {

}
