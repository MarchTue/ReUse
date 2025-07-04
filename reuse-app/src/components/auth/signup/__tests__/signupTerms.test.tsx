import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupTerms from "../signupTerms";
import { AdditionalSignupDataType } from "@/types/user";
import '@testing-library/jest-dom';
import { useForm, FormProvider } from "react-hook-form";


describe('SignupTerms Component', () => {
  const mockGoNextStep = jest.fn();

  const mockInitialData: AdditionalSignupDataType = {
    termsAgreements: {
      service: false,
      privacy: false,
      marketing: false,
    },
  };

  // 테스트 전 초기화
  beforeEach(() => {
    mockGoNextStep.mockClear();
    // (window.alert as jest.Mock).mockClear();
    // (console.error as jest.Mock).mockClear();
  });

  // 렌더링 테스트
  it('모든 약관 동의 UI & 버튼 렌더링 확인', () => {
    render(<SignupTerms goNextStep={mockGoNextStep} initialData={mockInitialData} />);


    expect(screen.getByRole('heading', { name: '서비스 약관 동의' })).toBeInTheDocument();
    expect(screen.getByLabelText('모든 약관에 동의합니다')).toBeInTheDocument();
    expect(screen.getByLabelText(/\[필수] 서비스 이용 약관/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/\[필수] 개인정보 수집 및 이용 동의/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/\[선택] 마케팅 정보 수신 동의/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음으로' })).toBeInTheDocument();
  });

  it('"다음으로 버튼"은 필수 약관에 모두 동의되었을 때 활성화되어야 함.', () => {
    render(<SignupTerms goNextStep={mockGoNextStep} initialData={mockInitialData} />);

    const nextButton = screen.getByRole('button', { name: '다음으로' });
    const serviceTermCheckbox = screen.getByLabelText('[필수] 서비스 이용 약관', { exact: false });
    const privacyTermCheckbox = screen.getByLabelText('[필수] 개인정보 수집 및 이용 동의', { exact: false });
    const marketingTermCheckbox = screen.getByLabelText('[선택] 마케팅 정보 수신 동의', { exact: false });

    expect(nextButton).toBeDisabled();
    fireEvent.click(serviceTermCheckbox);
    expect(nextButton).toBeDisabled();
    fireEvent.click(privacyTermCheckbox);
    expect(nextButton).toBeEnabled();
    fireEvent.click(marketingTermCheckbox);
    expect(nextButton).toBeEnabled();
    fireEvent.click(serviceTermCheckbox);
    expect(nextButton).toBeDisabled();
  });

  it('"모든 약관에 동의합니다" 체크박스 클릭 시 모든 약관의 상태가 변경되어야 함.', () => {
    render(<SignupTerms goNextStep={mockGoNextStep} initialData={mockInitialData} />);
    const allAgreeCheckbox = screen.getByLabelText('모든 약관에 동의합니다');
    const serviceTermCheckbox = screen.getByLabelText('[필수] 서비스 이용 약관', { exact: false });
    const privacyTermCheckbox = screen.getByLabelText('[필수] 개인정보 수집 및 이용 동의', { exact: false });
    const marketingTermCheckbox = screen.getByLabelText('[선택] 마케팅 정보 수신 동의', { exact: false });

    const nextButton = screen.getByRole('button', { name: '다음으로' });

    fireEvent.click(allAgreeCheckbox);
    expect(serviceTermCheckbox).toBeChecked();
    expect(privacyTermCheckbox).toBeChecked();
    expect(marketingTermCheckbox).toBeChecked();
    expect(allAgreeCheckbox).toBeChecked();
    expect(nextButton).toBeEnabled();

    fireEvent.click(allAgreeCheckbox);
    expect(serviceTermCheckbox).not.toBeChecked();
    expect(privacyTermCheckbox).not.toBeChecked();
    expect(marketingTermCheckbox).not.toBeChecked();
    expect(allAgreeCheckbox).not.toBeChecked();
    expect(nextButton).toBeDisabled();
  });

  it('다음으로 버튼 클릭 시 goNextStep 호출', async () => {
    const { getByLabelText, getByRole, unmount } = render(
      <SignupTerms goNextStep={mockGoNextStep} initialData={mockInitialData} />
    );

    fireEvent.click(getByLabelText(/\[필수] 서비스 이용 약관/i));
    fireEvent.click(getByLabelText(/\[필수] 개인정보 수집 및 이용 동의/i));
    fireEvent.click(getByLabelText(/\[선택] 마케팅 정보 수신 동의/i));
    fireEvent.click(getByRole('button', { name: '다음으로' }));

    await waitFor(() =>
      expect(mockGoNextStep).toHaveBeenCalledWith({
        termsAgreements: { service: true, privacy: true, marketing: true },
      })
    );
    mockGoNextStep.mockClear();

    unmount();

    const page2 = render(
      <SignupTerms goNextStep={mockGoNextStep} initialData={mockInitialData} />
    );

    fireEvent.click(page2.getByLabelText(/\[필수] 서비스 이용 약관/i));
    fireEvent.click(page2.getByLabelText(/\[필수] 개인정보 수집 및 이용 동의/i));
    fireEvent.click(page2.getByRole('button', { name: '다음으로' }));

    await waitFor(() =>
      expect(mockGoNextStep).toHaveBeenCalledWith({
        termsAgreements: { service: true, privacy: true, marketing: false },
      })
    );
  });

  it('isProcessing이 true일 때 모든 체크박스와 "다음으로" 버튼이 비활성화.', () => {
    render(<SignupTerms goNextStep={mockGoNextStep} initialData={mockInitialData} isProcessing={true} />);

    const allAgreeCheckbox = screen.getByLabelText('모든 약관에 동의합니다');
    const serviceTermCheckbox = screen.getByLabelText('[필수] 서비스 이용 약관', { exact: false });
    const privacyTermCheckbox = screen.getByLabelText('[필수] 개인정보 수집 및 이용 동의', { exact: false });
    const marketingTermCheckbox = screen.getByLabelText('[선택] 마케팅 정보 수신 동의', { exact: false });
    const nextButton = screen.getByRole('button', { name: '다음으로' });

    expect(allAgreeCheckbox).toBeDisabled();
    expect(serviceTermCheckbox).toBeDisabled();
    expect(privacyTermCheckbox).toBeDisabled();
    expect(marketingTermCheckbox).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it('isProcessing이 true일 때 체크박스를 클릭해도 상태가 변하지 않아야 함.', () => {
    render(<SignupTerms goNextStep={mockGoNextStep} initialData={mockInitialData} isProcessing={true} />);

    const serviceTermCheckbox = screen.getByLabelText('[필수] 서비스 이용 약관', { exact: false });

    expect(serviceTermCheckbox).not.toBeChecked();

    fireEvent.click(serviceTermCheckbox);

    expect(serviceTermCheckbox).not.toBeChecked();
    expect(serviceTermCheckbox).toBeDisabled();
  });

});