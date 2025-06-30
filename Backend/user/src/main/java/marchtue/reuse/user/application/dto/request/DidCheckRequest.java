package marchtue.reuse.user.application.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record DidCheckRequest(
    @JsonProperty("user_id") String userId,
    String did
) {

}
