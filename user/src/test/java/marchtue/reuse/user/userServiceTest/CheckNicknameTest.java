package marchtue.reuse.user.userServiceTest;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import marchtue.reuse.user.application.dto.request.NicknameCheckRequest;
import marchtue.reuse.user.application.service.UserService;
import marchtue.reuse.user.domain.model.User;
import marchtue.reuse.user.domain.repository.CredentialRepository;
import marchtue.reuse.user.domain.repository.UserRepository;
import marchtue.reuse.user.domain.repository.WalletRepository;
import marchtue.reuse.user.exception.BusinessException;
import marchtue.reuse.user.exception.ErrorCode;
import marchtue.reuse.user.global.dto.ApiResponse;
import marchtue.reuse.user.global.util.NicknameFilter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class CheckNicknameTest {

  private UserService userService;

  private UserRepository userRepository = Mockito.mock(UserRepository.class);
  private CredentialRepository credentialRepository = Mockito.mock(CredentialRepository.class);
  private WalletRepository walletRepository = Mockito.mock(WalletRepository.class);

  @BeforeEach
  void setUp() {
    userService = new UserService(userRepository, credentialRepository, walletRepository);
  }

  @Test
  void failedWithShort() {

    // given
    NicknameCheckRequest req = new NicknameCheckRequest("김");

    // when & then
    assertThatThrownBy(() -> userService.checkNickname(req))
        .isInstanceOf(BusinessException.class)
        .hasMessage(ErrorCode.INVALID_NICKNAME.getMessage());
  }

  @Test
  void failedWithBarcode() {

    // given
    NicknameCheckRequest req = new NicknameCheckRequest("lilili1");

    // when & then
    assertThatThrownBy(() -> userService.checkNickname(req))
        .isInstanceOf(BusinessException.class)
        .hasMessage(ErrorCode.INVALID_NICKNAME.getMessage());
  }

  @Test
  void failedWithBadWords() {

    // given
    NicknameCheckRequest req = new NicknameCheckRequest("씨이발");

    try (MockedStatic<NicknameFilter> mocked = Mockito.mockStatic(NicknameFilter.class)) {
      mocked.when(() -> NicknameFilter.isOffensiveNickname("씨이발", 1)).thenReturn(true);

      // when & then
      assertThatThrownBy(() -> userService.checkNickname(req))
          .isInstanceOf(BusinessException.class)
          .hasMessage(ErrorCode.BADWORD_NICKNAME.getMessage());
    }

  }

  @Test
  void failedWithDuplicatedNickname() {

    // given
    NicknameCheckRequest req = new NicknameCheckRequest("스타벅스");
    when(userRepository.findByNickname("스타벅스")).thenReturn(Mockito.mock(User.class));

    try (MockedStatic<NicknameFilter> mocked = Mockito.mockStatic(NicknameFilter.class)) {
      mocked.when(() -> NicknameFilter.isOffensiveNickname("스타벅스", 1)).thenReturn(false);

      // when & then
      assertThatThrownBy(() -> userService.checkNickname(req))
          .isInstanceOf(BusinessException.class)
          .hasMessage(ErrorCode.DUPLICATED_NICKNAME.getMessage());
    }
  }

  @Test
  void successWithValidNickname() {

    // given
    NicknameCheckRequest req = new NicknameCheckRequest("스타벅스");
    when(userRepository.findByNickname("스타벅스")).thenReturn(null);
    try (MockedStatic<NicknameFilter> mocked = Mockito.mockStatic(NicknameFilter.class)) {
      mocked.when(() -> NicknameFilter.isOffensiveNickname("hanbit", 1)).thenReturn(false);

      // when
      ApiResponse result = userService.checkNickname(req);

      // then
      assertEquals(200, result.code());
      assertEquals("succeeded", result.msg());
    }


  }

}
