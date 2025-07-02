package marchtue.reuse.user.application.service;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import marchtue.reuse.user.application.dto.request.CheckUserRequest;
import marchtue.reuse.user.application.dto.request.NicknameCheckRequest;
import marchtue.reuse.user.application.dto.request.UserAddInfoRequest;
import marchtue.reuse.user.application.dto.response.MypageResponse;
import marchtue.reuse.user.domain.enums.UserRoleEnum;
import marchtue.reuse.user.domain.model.Credential;
import marchtue.reuse.user.domain.model.User;
import marchtue.reuse.user.domain.model.UserRating;
import marchtue.reuse.user.domain.model.Wallet;
import marchtue.reuse.user.domain.repository.CredentialRepository;
import marchtue.reuse.user.domain.repository.UserRatingRepository;
import marchtue.reuse.user.domain.repository.UserRepository;
import marchtue.reuse.user.domain.repository.WalletRepository;
import marchtue.reuse.user.exception.BusinessException;
import marchtue.reuse.user.exception.ErrorCode;
import marchtue.reuse.user.global.dto.ApiResponse;
import marchtue.reuse.user.global.util.JwtUtil;
import marchtue.reuse.user.global.util.NicknameFilter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final CredentialRepository credentialRepository;
  private final WalletRepository walletRepository;
  private final UserRatingRepository userRatingRepository;
  private final JwtUtil jwtUtil;

  public ApiResponse checkNickname(NicknameCheckRequest req) {
    String nickname = req.nickname();
    // 바코드 패턴 검사
    if (nickname.length() < 2 || isBarcodePattern(nickname)) {
      throw new BusinessException(ErrorCode.INVALID_NICKNAME);
    }

    // 금지어 검사
    if (NicknameFilter.isOffensiveNickname(nickname, 1)) {
      throw new BusinessException(ErrorCode.BADWORD_NICKNAME);
    }

    // 중복 검사
    if (findByNickname(nickname) != null) {
      throw new BusinessException(ErrorCode.DUPLICATED_NICKNAME);
    }

    return new ApiResponse(200, "succeeded", null);

  }

  private boolean isBarcodePattern(String nickname) {
    if (nickname == null || nickname.length() < 2) {
      return false;
    }
    String barcodeChars = nickname.replaceAll("[^l1iI|]", "");
    double ratio = (double) barcodeChars.length() / nickname.length();
    return ratio >= 0.8;
  }

  // 회원유무확인
  @Transactional
  public ApiResponse checkUser(CheckUserRequest req) {
    // ci_hs 가 일치하는 회원 찾기
    User user = userRepository.findByCiHs(req.ci_hs());

    // 없다면 회원가입 추가정보 요청 응답
    if (user == null) {
      return new ApiResponse(404, "user not found", "");
    }
    return null;
  }

  // 회원가입
  @Transactional
  public ApiResponse registerUser(UserAddInfoRequest req) {

    // 닉네임 중복 검사
    if (findByNickname(req.nickname()) != null) {
      throw new BusinessException(ErrorCode.DUPLICATED_NICKNAME);
    }

    // Hs unique
    if (findByCi(req.ci_hs()) != null) {
      throw new BusinessException(ErrorCode.EXIST_USER);
    }

    User user = User.create(
        req.ci_hs(),
        req.name(),
        req.phone(),
        req.nickname(),
        req.profileImage());
    user.setCreatedBy(user.getId());
    User savedUser = userRepository.save(user);

    if (req.accountInfo().bank() != null) {
      savedUser.addBank(savedUser, req.accountInfo().bank(), req.accountInfo().account());
      userRepository.save(savedUser);
    }
    // 지갑 정보 등록
    if (req.walletInfo().platform() != null) {
      Wallet wallet = Wallet.create(
          req.walletInfo().address(),
          req.walletInfo().type(),
          req.walletInfo().platform(),
          savedUser);
      walletRepository.save(wallet);
    }
    // 레이팅 정보 생성
    UserRating rating = UserRating.create(savedUser);
    userRatingRepository.save(rating);

    Map<String, UUID> response = Map.of("user_id", savedUser.getId());

    return new ApiResponse(200, "succeeded", response);

  }


  // did check
  public void checkDid(String userId, String did) {
    UUID userUuId = UUID.fromString(userId);
    User user = findById(userUuId);
    if (credentialRepository.findByDid(did) == null) {
      Credential credential = Credential.create(did, user);
      credentialRepository.save(credential);

    }
  }

  public ApiResponse myPage(HttpServletRequest request, UUID userId) throws BusinessException {
    UUID targetUserId = getUserInfoFromToken(request);
    if (!userId.equals(targetUserId)) {
      if (checkUserRole(request) == UserRoleEnum.ROLE_USER) {
        throw new BusinessException(ErrorCode.FORBIDDEN);
      }
    }
    User user = findById(userId);
    UserRating rating = getUserRating(user);
    MypageResponse res = new MypageResponse(
        user.getNickname(),
        rating.getInProgressTrade(),
        rating.getCompletedTrade(),
        user.getToken(),
        rating.getRateScore(),
        user.getBank().getKoreanName(),
        user.getAccount(),
        user.getPhoneNumber()
    );
    return new ApiResponse(200, "succceded", res);
  }

  private User findByNickname(String nickname) {
    return userRepository.findByNickname(nickname.toLowerCase());
  }


  public User findByCi(String ciHs) {
    return userRepository.findByCiHs(ciHs);
  }

  public User findById(UUID userId) {
    return userRepository.findById(userId)
        .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
  }

  private UserRating getUserRating(User user) {
    return userRatingRepository.findByUserId(user.getId());
  }

  private UUID getUserInfoFromToken(HttpServletRequest request) {
    String token = jwtUtil.getTokenFromHeader(request, jwtUtil.AUTHORIZATION_HEADER);
    if (token == null || !jwtUtil.validateToken(token)) {
      throw new BusinessException(ErrorCode.NO_ROLE);
    }
    return UUID.fromString(jwtUtil.getUserInfoFromToken(token).getSubject());
  }

  private UserRoleEnum checkUserRole(HttpServletRequest request) {
    String token = jwtUtil.getTokenFromHeader(request, JwtUtil.AUTHORIZATION_HEADER);
    if (token == null || !jwtUtil.validateToken(token)) {
      throw new BusinessException(ErrorCode.NO_ROLE);
    }

    return jwtUtil.getUserRole(token);

  }


}
