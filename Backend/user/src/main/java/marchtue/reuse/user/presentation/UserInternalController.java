package marchtue.reuse.user.presentation;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import marchtue.reuse.user.application.dto.request.DidCheckRequest;
import marchtue.reuse.user.application.dto.request.UserInfoRequest;
import marchtue.reuse.user.application.dto.response.BuyerInfoResponse;
import marchtue.reuse.user.application.dto.response.ReadSellerResponse;
import marchtue.reuse.user.application.dto.response.UserInfoResponse;
import marchtue.reuse.user.application.dto.response.UserInfoWithImgResponse;
import marchtue.reuse.user.application.dto.response.UserSimpleInfoResponse;
import marchtue.reuse.user.application.service.UserService;
import marchtue.reuse.user.domain.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/internal/users")
@RequiredArgsConstructor
public class UserInternalController {

  private final UserService userService;

  @PostMapping("/ci")
  public UserInfoResponse findByCi(
      @RequestBody UserInfoRequest req
  ) {
    // 사용자 존재 여부 확인 후 반환
    User user = userService.findByCi(req.ci_sh());

    if (user == null) {
      return new UserInfoResponse(null, null);
    }

    UserInfoResponse res = new UserInfoResponse(user.getId().toString(), user.getRole());
    return res;
  }

  @PostMapping("/did")
  public ResponseEntity<Void> CheckDid(@RequestBody DidCheckRequest req) {
    userService.checkDid(req.userId(), req.did());
    return ResponseEntity.ok().build();
  }

  @PostMapping("/info-list")
  public List<UserSimpleInfoResponse> getUserSimpleInfoList(@RequestBody List<UUID> userIds) {
    return userService.getUserSimpleInfoList(userIds);
  }

  @GetMapping("/seller-info/{sellerId}")
  public ReadSellerResponse getSellerInfo(
      @PathVariable UUID sellerId
  ) {
    return userService.getSellerInfo(sellerId);
  }

  @PostMapping("/buyer-infos")
  public List<BuyerInfoResponse> getBuyerInfoList(
      @RequestBody List<UUID> userIds) {
    return userService.getBuyerInfoList(userIds);
  }

  @PostMapping("/post-infos")
  public List<UserInfoWithImgResponse> getPostInfoList(
      @RequestBody List<UUID> userIds) {
    return userService.getPostInfoList(userIds);
  }


}
