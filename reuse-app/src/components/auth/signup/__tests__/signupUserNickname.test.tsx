import { AdditionalSignupDataType } from "@/types/user";
import SignupUserNickname from "../signupUserNickname";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";


describe('Signup - User Nickname Component', () => {
  const mockGoNextStep = jest.fn();
  const mockHandlePrevStep = jest.fn();

  const defaultInitialData: AdditionalSignupDataType = {
    nickname: '',
    profileImage: '',
  };


  beforeEach(() => {
    mockGoNextStep.mockClear();
    mockHandlePrevStep.mockClear();
    (window.alert as jest.Mock).mockClear();

  });

  // 렌더링 테스트
  it('필수 UI 요소들이 올바르게 렌더링되어야 합니다.', () => {
    render(<SignupUserNickname goNextStep={mockGoNextStep} initialData={defaultInitialData} handlePrevStep={mockHandlePrevStep} />);

    // 닉네임 입력 필드 확인
    expect(screen.getByPlaceholderText('닉네임 (2~12자)')).toBeInTheDocument();
    // 중복확인 버튼 확인
    expect(screen.getByRole('button', { name: '중복확인' })).toBeInTheDocument();
    // 다음으로 버튼 확인
    expect(screen.getByRole('button', { name: '다음으로' })).toBeInTheDocument();
    // 프로필 이미지 플레이스홀더 (svg 내부 요소로 확인)
    expect(screen.getByTestId('profile-image-placeholder')).toBeInTheDocument();
  });

  // 닉네임 공백 테스트
  it('닉네임이 비어있을 때 에러 메시지를 표시해야 합니다.', async () => {
    render(<SignupUserNickname goNextStep={mockGoNextStep} initialData={defaultInitialData} handlePrevStep={mockHandlePrevStep} />);
    const nicknameInput = screen.getByPlaceholderText('닉네임 (2~12자)');
    const checkButton = screen.getByRole('button', { name: '중복확인' });
    const nextButton = screen.getByRole('button', { name: '다음으로' });

    expect(checkButton).toBeDisabled();
    expect(nextButton).toBeDisabled();

    fireEvent.change(nicknameInput, { target: { value: 'a' } });
    fireEvent.blur(nicknameInput); // useEffect 활성

    await waitFor(() => {
      expect(screen.getByText('닉네임은 2자 이상, 12자 이하로 입력해주세요')).toBeInTheDocument();
    });
    expect(checkButton).toBeDisabled();
    expect(nextButton).toBeDisabled();

    fireEvent.change(nicknameInput, { target: { value: '' } });
    fireEvent.blur(nicknameInput);

    await waitFor(() => {
      expect(screen.getByText('닉네임을 입력해주세요')).toBeInTheDocument();
    });
    expect(checkButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });
  it('닉네임 길이 제한을 초과할 때 에러 메시지를 표시해야 합니다.', async () => {
    render(<SignupUserNickname goNextStep={mockGoNextStep} initialData={defaultInitialData} handlePrevStep={mockHandlePrevStep} />);
    const nicknameInput = screen.getByPlaceholderText('닉네임 (2~12자)');
    fireEvent.change(nicknameInput, { target: { value: 'verylongnickname12345' } }); // 12자 초과
    fireEvent.blur(nicknameInput);

    await waitFor(() => {
      expect(screen.getByText('닉네임은 2자 이상, 12자 이하로 입력해주세요')).toBeInTheDocument();
    });
  });

  // --- 닉네임 중복 확인 테스트 ---
  it('유효한 닉네임 입력 후 중복확인 시 로딩 상태를 표시해야 합니다.', async () => {
    render(<SignupUserNickname goNextStep={mockGoNextStep} initialData={defaultInitialData} handlePrevStep={mockHandlePrevStep} />);
    const nicknameInput = screen.getByPlaceholderText('닉네임 (2~12자)');
    const checkButton = screen.getByRole('button', { name: '중복확인' });

    fireEvent.change(nicknameInput, { target: { value: 'testuser' } });
    fireEvent.click(checkButton);

    // 로딩 메시지 확인
    expect(screen.getByText('확인 중...')).toBeInTheDocument();
    expect(checkButton).toBeDisabled(); // 로딩 중에는 버튼 비활성화

    // 1초 후 로딩 메시지 사라지고 '사용 가능' 메시지 표시
    await waitFor(() => {
      expect(screen.queryByText('확인 중...')).not.toBeInTheDocument();
      expect(screen.getByText('사용 가능한 닉네임입니다!')).toBeInTheDocument();
    }, { timeout: 1500 }); // setTimeout이 1000ms 보다 길게.
  });

  it('중복확인 후 닉네임을 변경하면 "사용 가능" 메시지가 사라져야 합니다.', async () => {
    render(<SignupUserNickname goNextStep={mockGoNextStep} initialData={defaultInitialData} handlePrevStep={mockHandlePrevStep} />);
    const nicknameInput = screen.getByPlaceholderText('닉네임 (2~12자)');
    const checkButton = screen.getByRole('button', { name: '중복확인' });

    // 닉네임 입력 및 중복 확인 성공
    fireEvent.change(nicknameInput, { target: { value: 'uniqueName' } });
    fireEvent.click(checkButton);
    await waitFor(() => expect(screen.getByText('사용 가능한 닉네임입니다!', { exact: false })).toBeInTheDocument());

    // 닉네임 변경
    fireEvent.change(nicknameInput, { target: { value: 'changedName' } });
    fireEvent.blur(nicknameInput);

    // "사용 가능" 메시지가 사라지고, 새로운 닉네임 유효성 검사 에러 (없다면 메시지 없음)
    await waitFor(() => {
      expect(screen.queryByText('사용 가능한 닉네임입니다!')).not.toBeInTheDocument();
      expect(checkButton).toBeEnabled(); // 닉네임이 유효하다면 다시 활성화
    });
  });

  // --- 버튼 활성화/비활성화 테스트 ---
  it('"다음으로" 버튼은 닉네임이 유효하고 중복 확인이 완료되었을 때만 활성화되어야 합니다.', async () => {
    render(<SignupUserNickname goNextStep={mockGoNextStep} initialData={defaultInitialData} handlePrevStep={mockHandlePrevStep} />);
    const nicknameInput = screen.getByPlaceholderText('닉네임 (2~12자)');
    const checkButton = screen.getByRole('button', { name: '중복확인' });
    const nextButton = screen.getByRole('button', { name: '다음으로' });

    // 초기 상태: 비활성화
    expect(nextButton).toBeDisabled();

    // 유효한 닉네임 입력 후에도 중복 확인 전에는 비활성화
    fireEvent.change(nicknameInput, { target: { value: 'validName' } });
    expect(nextButton).toBeDisabled();

    // 중복 확인 진행 중에도 비활성화
    fireEvent.click(checkButton);
    expect(nextButton).toBeDisabled();
    expect(screen.getByText('확인 중...')).toBeInTheDocument();

    // 중복 확인 완료 후 활성화
    await waitFor(() => {
      expect(screen.getByText('사용 가능한 닉네임입니다!')).toBeInTheDocument();
      expect(nextButton).toBeEnabled();
    }, { timeout: 1500 });

    // 닉네임 에러 발생 시 비활성화
    fireEvent.change(nicknameInput, { target: { value: '' } }); // 닉네임을 다시 비움
    fireEvent.blur(nicknameInput);
    await waitFor(() => {
      expect(screen.getByText('닉네임을 입력해주세요')).toBeInTheDocument();
      expect(nextButton).toBeDisabled();
    });
  });

  // --- 폼 제출 테스트 ---
  it('"다음으로" 버튼 클릭 시 goNextStep이 호출되어야 합니다 (유효한 경우).', async () => {
    render(<SignupUserNickname goNextStep={mockGoNextStep} initialData={defaultInitialData} handlePrevStep={mockHandlePrevStep} />);
    const nicknameInput = screen.getByPlaceholderText('닉네임 (2~12자)');
    const checkButton = screen.getByRole('button', { name: '중복확인' });
    const nextButton = screen.getByRole('button', { name: '다음으로' });

    // 유효한 닉네임 입력
    fireEvent.change(nicknameInput, { target: { value: 'finaluser' } });

    // 중복 확인 수행
    fireEvent.click(checkButton);
    await waitFor(() => expect(screen.getByText('사용 가능한 닉네임입니다', { exact: false })).toBeInTheDocument());

    // "다음으로" 버튼 클릭
    fireEvent.click(nextButton);

    // goNextStep이 올바른 인자(닉네임과 이미지 URL)로 호출되었는지 확인
    await waitFor(() => {
      expect(mockGoNextStep).toHaveBeenCalledTimes(1);
      expect(mockGoNextStep).toHaveBeenCalledWith({
        nickname: 'finaluser',
        profileImage: null, // 초기 imageUrl = null
      });
    });
  });

  it('유효하지 않은 닉네임으로 "다음으로" 버튼 클릭 시 goNextStep이 호출되지 않아야 합니다.', async () => {
    render(<SignupUserNickname goNextStep={mockGoNextStep} initialData={defaultInitialData} handlePrevStep={mockHandlePrevStep} />);
    const nicknameInput = screen.getByPlaceholderText('닉네임 (2~12자)');
    const nextButton = screen.getByRole('button', { name: '다음으로' });

    // 유효하지 않은 닉네임 (1글자)
    fireEvent.change(nicknameInput, { target: { value: 'a' } });
    fireEvent.blur(nicknameInput);
    await waitFor(() => expect(screen.getByText('닉네임은 2자 이상, 12자 이하로 입력해주세요')).toBeInTheDocument());

    fireEvent.click(nextButton);

    expect(mockGoNextStep).not.toHaveBeenCalled(); // goNextStep이 호출되지 않아야 함
  });

  it('중복 확인 없이 "다음으로" 버튼 클릭 시 goNextStep이 호출되지 않아야 합니다.', async () => {
    render(<SignupUserNickname goNextStep={mockGoNextStep} initialData={defaultInitialData} handlePrevStep={mockHandlePrevStep} />);
    const nicknameInput = screen.getByPlaceholderText('닉네임 (2~12자)');
    const nextButton = screen.getByRole('button', { name: '다음으로' });

    fireEvent.change(nicknameInput, { target: { value: 'goodnickname' } }); // 유효한 닉네임이지만 중복 확인 안 함

    expect(nextButton).toBeDisabled(); // 중복확인이 안되었으므로 비활성화
    fireEvent.click(nextButton);

    expect(mockGoNextStep).not.toHaveBeenCalled(); // goNextStep이 호출되지 않아야 함
  });

  // 프로필 이미지 관련 테스트 
  it('카메라 아이콘 버튼 클릭 시 alert가 호출되고 imageUrl이 업데이트되어야 합니다.', async () => {
    render(<SignupUserNickname goNextStep={mockGoNextStep} initialData={defaultInitialData} handlePrevStep={mockHandlePrevStep} />);
    const cameraButton = screen.getByTestId('profile-image-upload-button');

    fireEvent.click(cameraButton);


    await waitFor(() => {
      expect(screen.getByAltText('Profile')).toHaveAttribute('src', 'https://http.cat/images/100.jpg');
    });
    // alert가 호출되었는지 확인
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledTimes(1);
      expect(window.alert).toHaveBeenCalledWith('tqh : 추가 예정입니다.');
    });

  });
});