"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/customInput";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SignupStepProps } from "@/types/signup.props";
import { BankEnum, BANKS, BankType } from "@/types/user";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";


export default function SignupAccountSelection({ goNextStep, initialData }: SignupStepProps) {
  const initialBankId = (initialData as any)?.accountInfo?.bank || '';
  const [selectedBankId, setSelectedBankId] = useState<string>(initialBankId);
  const [accountNumber, setAccountNumber] = useState<string>((initialData as any)?.accountInfo?.account || '');
  const [errors, setErrors] = useState<{ bank?: string; account?: string; }>({});
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const getSelectedBankLabel = (id: string): string => {
    const bank = BANKS.find(b => b.id === id);
    return bank ? bank.label : "은행을 선택해주세요";
  };


  const handleNext = () => {
    let newErrors: { bank?: string; account?: string; } = {};

    if (!selectedBankId) {
      newErrors.bank = "은행을 선택해주세요.";
    }

    if (!accountNumber.trim()) {
      newErrors.account = "계좌번호를 입력해주세요.";
    } else if (!/^\d+$/.test(accountNumber.trim())) {
      newErrors.account = "계좌번호는 숫자만 입력 가능합니다.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    goNextStep({
      accountInfo: {
        bank: selectedBankId as BankEnum,
        account: accountNumber.trim()
      }
    });
  };

  const handleBankSelect = (bank: BankType) => {
    setSelectedBankId(bank.id);
    setErrors(prev => ({ ...prev, bank: undefined }));
    setIsPopoverOpen(false);
  };

  const isFormValid = !!selectedBankId && accountNumber.trim() !== '' && /^\d+$/.test(accountNumber.trim());

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-3  mt-1 text-center">계좌 정보 입력</h2>
        <hr />
        <p className="text-gray-600 mt-4">서비스 이용을 위해 계좌 정보를 입력해주세요.</p>
      </div>
      {/* 팝오버 */}
      <div className="space-y-2">
        <label htmlFor="bank-select-trigger" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          은행 선택
        </label>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role="combobox"
              aria-expanded={isPopoverOpen}
              id="bank-select-trigger"
              className="w-full justify-between"
            >
              {getSelectedBankLabel(selectedBankId)}
              <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <div className="max-h-60 overflow-y-auto">
              {BANKS.map((bank) => (
                <div
                  key={bank.id}
                  onClick={() => handleBankSelect(bank)}
                  className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 ${selectedBankId === bank.id ? `bg-blue-200 text-primary font-semibold` : ''
                    }`}
                  role='option'
                  aria-selected={selectedBankId === bank.id}
                >
                  {/* tqh : 은행 로고 구해올 것 */}
                  {bank.label}
                </div>)
              )}
            </div>
          </PopoverContent>
        </Popover>
        {errors.bank && <p className="text-red-500 text-sm">{errors.bank}</p>}
      </div>

      {/* 번호 입력 tqh : 백엔드 계좌 검증 로직 호출?  */}
      <div className="space-y-2">
        <label htmlFor="account-number" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          계좌 번호
        </label>
        <Input
          id="account-number"
          type="text"
          placeholder="계좌번호를 입력해주세요 (숫자만)"
          value={accountNumber}
          onChange={(e) => {
            const cleanedValue = e.target.value.replace(/[^0-9]/g, '');
            setAccountNumber(cleanedValue);
            setErrors(prev => ({ ...prev, account: undefined }));
          }}
          inputMode="numeric"
          pattern="[0-9]*"
        />
        {errors.account && <p className="text-red-500 text-sm">{errors.account}</p>}
      </div>

      {/* 다음 단계 버튼 */}
      <Button
        type="button"
        className="w-full h-14 bg-primary  hover:bg-primary-600 text-white font-semibold text-base rounded-2xl mt-12"
        disabled={!isFormValid}
        onClick={handleNext}
      >
        다음으로
      </Button>
    </div>);
}