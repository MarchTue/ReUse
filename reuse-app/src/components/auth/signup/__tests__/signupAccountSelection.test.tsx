import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupAccountSelection from '../signupAccountSelection';
import { BANKS } from '@/types/user';


const mockGoNextStep = jest.fn();

const defaultProps = {
  goNextStep: mockGoNextStep,
  initialData: {}
};

describe('Signup - Account Selection Component', () => {
  beforeEach(() => {
    mockGoNextStep.mockClear();
  });

  it('필수 UI 요소들이 렌더링 되어야 합니다.', () => {
    render(<SignupAccountSelection {...defaultProps} />);

    expect(screen.getByText('계좌 정보 입력')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: '은행 선택' })).toBeInTheDocument();
    expect(screen.getByLabelText('계좌 번호')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '회원 가입' })).toBeInTheDocument();
  });

  it('은행 팝오버를 열고 은행을 선택하면, 선택한 은행이 표시되고, 팝오버가 닫혀야 합니다.', async () => {
    render(<SignupAccountSelection {...defaultProps} />);
    const bankSelectTrigger = screen.getByRole('combobox', { name: '은행 선택' });

    fireEvent.click(bankSelectTrigger);

    await waitFor(() => {
      expect(screen.getByText(BANKS[0].label)).toBeInTheDocument();
    });

    const selectedBank = BANKS[1];
    fireEvent.click(screen.getByText(selectedBank.label));

    await waitFor(() => {
      expect(screen.getByText(BANKS[1].label)).toBeInTheDocument();
    });
  });

  it('계좌번호 입력 필드에 숫자만 입력 가능해야 합니다.', () => {
    render(<SignupAccountSelection {...defaultProps} />);
    const accountNumberInput = screen.getByLabelText('계좌 번호');

    // 숫자와 문자가 섞인 입력 시도
    fireEvent.change(accountNumberInput, { target: { value: '123abc456def' } });
    expect(accountNumberInput).toHaveValue('123456'); // 숫자만 필터링되어야 함

    // 하이픈 등 특수문자가 섞인 입력 시도
    fireEvent.change(accountNumberInput, { target: { value: '987-654_321' } });
    expect(accountNumberInput).toHaveValue('987654321'); // 특수문자 제거 확인
  });

  it('계좌번호가 비어있을 때 "회원 가입" 버튼 클릭 시 에러 메시지가 표시되어야 합니다.', async () => {
    render(<SignupAccountSelection {...defaultProps} />);
    const registerButton = screen.getByRole('button', { name: '회원 가입' });
    const bankSelectTrigger = screen.getByRole('combobox', { name: '은행 선택' });

    // 은행을 먼저 선택하여 은행 에러가 발생하지 않도록 함
    fireEvent.click(bankSelectTrigger);
    fireEvent.click(screen.getByText(BANKS[0].label));

    // 제출 불가능
    await waitFor(() => {
      expect(registerButton).toBeDisabled();
    });
  });
  it('"회원 가입" 버튼은 초기 상태에서 비활성화되어야 합니다.', () => {
    render(<SignupAccountSelection {...defaultProps} />);
    const registerButton = screen.getByRole('button', { name: '회원 가입' });
    expect(registerButton).toBeDisabled();
  });

  it('은행과 계좌번호가 모두 유효할 때 "회원 가입" 버튼이 활성화되어야 합니다.', async () => {
    render(<SignupAccountSelection {...defaultProps} />);
    const bankSelectTrigger = screen.getByRole('combobox', { name: '은행 선택' });
    const accountNumberInput = screen.getByLabelText('계좌 번호');
    const registerButton = screen.getByRole('button', { name: '회원 가입' });

    expect(registerButton).toBeDisabled();

    // 은행 선택
    fireEvent.click(bankSelectTrigger);
    fireEvent.click(screen.getByText(BANKS[0].label)); 

    // 계좌번호 입력
    fireEvent.change(accountNumberInput, { target: { value: '1234567890' } });
    
    await waitFor(() => {
      expect(registerButton).toBeEnabled();
    });
  });

  it('유효한 계좌 정보 입력 후 "회원 가입" 버튼 클릭 시 goNextStep이 호출되어야 합니다.', async () => {
    render(<SignupAccountSelection {...defaultProps} />);
    const bankSelectTrigger = screen.getByRole('combobox', { name: '은행 선택' });
    const accountNumberInput = screen.getByLabelText('계좌 번호');
    const registerButton = screen.getByRole('button', { name: '회원 가입' });

    fireEvent.click(bankSelectTrigger);
    fireEvent.click(screen.getByText(BANKS[0].label));

    fireEvent.change(accountNumberInput, { target: { value: '1234567890' } });

    await waitFor(() => {
      expect(registerButton).toBeEnabled();
    });

    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(mockGoNextStep).toHaveBeenCalledTimes(1);
      expect(mockGoNextStep).toHaveBeenCalledWith({
        accountInfo: {
          bank: BANKS[0].id as BankEnum, // 선택된 은행의 ID (BankEnum으로 타입 캐스팅)
          account: '1234567890',
        },
      });
    });
  });

  it('initialData가 있을 경우 필드에 반영되어야 합니다.', () => {
    const initialBank = BANKS[1]; 
    const initialAccountData = {
      accountInfo: {
        bank: initialBank.id,
        account: '9876543210'
      }
    };
    render(<SignupAccountSelection goNextStep={mockGoNextStep} initialData={initialAccountData} />);

    // 은행 선택 콤보박스에 초기 은행 레이블이 표시되는지 확인
    expect(screen.getByRole('combobox', { name: '은행 선택' })).toHaveTextContent(initialBank.label);
    // 계좌 번호 입력 필드에 초기 계좌 번호가 표시되는지 확인
    expect(screen.getByLabelText('계좌 번호')).toHaveValue('9876543210');
    // 초기 데이터가 유효하므로 "회원 가입" 버튼이 활성화되어야 함
    expect(screen.getByRole('button', { name: '회원 가입' })).toBeEnabled();
  });
});
