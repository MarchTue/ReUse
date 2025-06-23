package marchtue.reuse.user.userServiceTest;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Map;
import java.util.UUID;
import marchtue.reuse.user.application.dto.request.AccountInfo;
import marchtue.reuse.user.application.dto.request.UserAddInfoRequest;
import marchtue.reuse.user.application.dto.request.WalletInfo;
import marchtue.reuse.user.application.service.UserService;
import marchtue.reuse.user.domain.enums.BankEnum;
import marchtue.reuse.user.domain.enums.DidTypeEnum;
import marchtue.reuse.user.domain.enums.EWalletPlatformEnum;
import marchtue.reuse.user.domain.enums.EWalletTypeEnum;
import marchtue.reuse.user.domain.model.User;
import marchtue.reuse.user.domain.repository.CredentialRepository;
import marchtue.reuse.user.domain.repository.UserRepository;
import marchtue.reuse.user.domain.repository.WalletRepository;
import marchtue.reuse.user.exception.BusinessException;
import marchtue.reuse.user.global.dto.ApiResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class RegisterUserTest {

  private UserService userService;

  private UserRepository userRepository = mock(UserRepository.class);
  private CredentialRepository credentialRepository = mock(CredentialRepository.class);
  private WalletRepository walletRepository = mock(WalletRepository.class);


  @BeforeEach
  void setUp() {
    userService = new UserService(userRepository, credentialRepository, walletRepository);
  }

  @Test
  void successRegisterUser() {
    // given
    UUID userId = UUID.randomUUID();
    User mockUser = mock(User.class);
    when(mockUser.getId()).thenReturn(userId);

    when(userRepository.findByNickname("스타벅스")).thenReturn(null);
    when(userRepository.save(any(User.class))).thenReturn(mockUser);

    UserAddInfoRequest request = new UserAddInfoRequest(
        "ciHash",
        "did",
        DidTypeEnum.DRIVER,
        "김이름",
        "010-1234-5678",
        "스타벅스",
        "https://image.png",
        new AccountInfo(BankEnum.KB_BANK, "123-456-7890"),
        new WalletInfo("0-1234-56-789-1", EWalletTypeEnum.APPLEPAY, EWalletPlatformEnum.APPLEPAY)
    );

    // when
    ApiResponse response = userService.registerUser(request);

    // then
    assertEquals(200, response.code());
    assertEquals("succeeded", response.msg());
    assertEquals(userId, ((Map<?, ?>) response.data()).get("user_id"));

    verify(userRepository, times(2)).save(any(User.class)); // 최초 저장 + bank 추가
    verify(walletRepository).save(any());
  }

  @Test
  void throwsException_registerUser_duplicateNickname() {
    // given
    when(userRepository.findByNickname("스타벅스")).thenReturn(mock(User.class));

    UserAddInfoRequest request = new UserAddInfoRequest(
        "ciHash",
        "did",
        DidTypeEnum.DRIVER,
        "김이름",
        "010-1234-5678",
        "스타벅스",
        "https://image.png",
        null,
        null
    );

    // when & then
    assertThrows(BusinessException.class, () -> userService.registerUser(request));
    verify(userRepository, never()).save(any());
    verify(walletRepository, never()).save(any());
  }

}
