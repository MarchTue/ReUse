package marchtue.reuse.user.application.service;

import lombok.RequiredArgsConstructor;
import marchtue.reuse.user.application.dto.request.NicknameCheckRequest;
import marchtue.reuse.user.domain.repository.UserRepository;
import marchtue.reuse.user.exception.BusinessException;
import marchtue.reuse.user.exception.ErrorCode;
import marchtue.reuse.user.global.dto.ApiResponse;
import marchtue.reuse.user.global.util.NicknameFilter;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;

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
    if (userRepository.findByNickname(nickname.toLowerCase()) != null) {
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

  // 회원가입-회원유무확인
//  public ApiResponse checkUser(CheckUserRequest req) {
//    // ci_hs 가 일치하는 회원 찾기
//
//
//    // 없다면 회원가입 추가정보 요청 응답
//
//    // 있고, 새로운 did면 추가
//
//    // 있고, 기존의 did면 로그인 처리
//  }
}
