package marchtue.reuse.user.application.service;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import marchtue.reuse.user.application.dto.request.CheckUserRequest;
import marchtue.reuse.user.application.dto.request.NicknameCheckRequest;
import marchtue.reuse.user.application.dto.request.UserAddInfoRequest;
import marchtue.reuse.user.application.dto.response.BuyerInfoResponse;
import marchtue.reuse.user.application.dto.response.MypageResponse;
import marchtue.reuse.user.application.dto.response.ReadSellerResponse;
import marchtue.reuse.user.application.dto.response.UserSimpleInfoResponse;
import marchtue.reuse.user.domain.enums.UserRoleEnum;
import marchtue.reuse.user.domain.model.Credential;
import marchtue.reuse.user.domain.model.User;
import marchtue.reuse.user.domain.model.UserCategory;
import marchtue.reuse.user.domain.model.UserRating;
import marchtue.reuse.user.domain.model.Wallet;
import marchtue.reuse.user.domain.repository.CredentialRepository;
import marchtue.reuse.user.domain.repository.UserCategoryRepository;
import marchtue.reuse.user.domain.repository.UserRatingRepository;
import marchtue.reuse.user.domain.repository.UserRepository;
import marchtue.reuse.user.domain.repository.WalletRepository;
import marchtue.reuse.user.exception.BusinessException;
import marchtue.reuse.user.exception.ErrorCode;
import marchtue.reuse.user.global.dto.ApiResponse;
import marchtue.reuse.user.global.util.NicknameFilter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final CredentialRepository credentialRepository;
  private final WalletRepository walletRepository;
  private final UserRatingRepository userRatingRepository;
  private final UserCategoryRepository userCategoryRepository;
  private final UserRatingService userRatingService;

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

    return ApiResponse.ok();

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
      return ApiResponse.error(404, "user not found");
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

    return ApiResponse.ok(response);

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
    UUID targetUserId = getUserIdFromContext();
    if (!userId.equals(targetUserId)) {
      if (checkUserRole() == UserRoleEnum.ROLE_USER) {
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
    return ApiResponse.ok(res);
  }

  public ApiResponse favCategory(UUID categoryId) {
    UUID userId = getUserIdFromContext();
    UserCategory category = userCategoryRepository.findByUserIdAndCategoryId(userId, categoryId)
        .orElse(null);
    if (category == null) {
      UserCategory favCate = UserCategory.create(userId, categoryId);
      userCategoryRepository.save(favCate);
    } else {
      userCategoryRepository.delete(category);
    }

    return ApiResponse.ok();
  }

  public List<UserSimpleInfoResponse> getUserSimpleInfoList(List<UUID> userIds) {
    return userIds.stream()
        .map(userRepository::findById)
        .filter(Optional::isPresent)
        .map(Optional::get)
        .map(user -> new UserSimpleInfoResponse(
            user.getId(),
            user.getNickname(),
            user.getUserRating().getRateScore()))
        .toList();
  }

  public ReadSellerResponse getSellerInfo(UUID sellerId) {
    User user = findById(sellerId);
    UserRating userRating = userRatingService.findByUserId(sellerId);
    return ReadSellerResponse.from(user, userRating);
  }

  public List<BuyerInfoResponse> getBuyerInfoList(List<UUID> userIds) {

    List<BuyerInfoResponse> userInfos = userIds.stream()
        .map(userRepository::findById)
        .filter(Optional::isPresent)
        .map(Optional::get)
        .map(user -> new BuyerInfoResponse(
            user.getId(),
            user.getNickname(),
            user.getProfileImage()))
        .toList();

    log.info("userInfos: {}", userInfos);
    return userInfos;
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

  private UUID getUserIdFromContext() {
    return (UUID) SecurityContextHolder.getContext().getAuthentication()
        .getPrincipal();
  }

  private UserRoleEnum checkUserRole() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated()) {
      throw new BusinessException(ErrorCode.NO_ROLE);
    }

    return auth.getAuthorities().stream()
        .findFirst()
        .map(authority -> UserRoleEnum.valueOf(authority.getAuthority()))
        .orElseThrow(() -> new BusinessException(ErrorCode.NO_ROLE));
  }


}
