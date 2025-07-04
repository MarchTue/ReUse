export interface BankType {
  id: string; // 내부적으로 사용할 고유 ID (예: ENUM 키 값)
  label: string; // 사용자에게 보여줄 한국어 이름
}

export const BANKS: BankType[] = [
  { id: 'KAKAO_BANK', label: '카카오뱅크' },
  { id: 'TOSS_BANK', label: '토스뱅크' },
  { id: 'KB_BANK', label: 'KB국민은행' },
  { id: 'SHINHAN_BANK', label: '신한은행' },
  { id: 'HANA_BANK', label: '하나은행' },
  { id: 'WOORI_BANK', label: '우리은행' },
  { id: 'NH_BANK', label: 'NH농협은행' },
  { id: 'IBK_BANK', label: 'IBK기업은행' },
  { id: 'K_BANK', label: '케이뱅크' },
  { id: 'CITY_BANK', label: '씨티은행' },
  { id: 'SC_BANK', label: 'SC제일은행' },
  { id: 'DGB_BANK', label: 'DGB대구은행' },
  { id: 'BNK_BUSAN', label: 'BNK부산은행' },
  { id: 'BNK_KYONGNAM', label: 'BNK경남은행' },
  { id: 'JEONBUK_BANK', label: '전북은행' },
  { id: 'JEJU_BANK', label: '제주은행' },
  { id: 'SH_BANK', label: 'Sh수협은행' },
];

export enum BankEnum {
  KAKAO_BANK,
  TOSS_BANK,
  KB_BANK,
  SHINHAN_BANK,
  HANA_BANK,
  WOORI_BANK,
  NH_BANK,
  IBK_BANK,
  K_BANK,
  CITY_BANK,
  SC_BANK,
  DGB_BANK,
  BNK_BUSAN,
  BNK_KYONGNAM,
  JEONBUK_BANK,
  JEJU_BANK,
  SH_BANK,
}

export enum DidTypeEnum {
  RESIDENT,
  DRIVER,
}

export enum WalletTypeEnum {
  KAKAOPAY,
  TOSSPAY,
  NAVERPAY,
  PAYCO,
  SAMSUNGPAY,
  APPLEPAY,
  GOOGLEPAY,
}

export enum WalletPlatformEnum {
  KAKAOPAY,
  TOSSPAY,
  NAVERPAY,
  PAYCO,
  SAMSUNGPAY,
  APPLEPAY,
  GOOGLEPAY,
}

export interface WalletInfoType {
  address: string | null;
  type: WalletTypeEnum | null,
  platform: WalletPlatformEnum | null;
}

export interface AccountInfoType {
  bank: BankEnum | null,
  account: string | null; // - 처리 고민중, 복붙 고려해서 일단 string
}

// RaonData 에서 가져올 수 있는 사용자 회원가입에 필요한 정보
export interface DefaultSignupDataType {
  ci_hs: string;
  did: string;
  did_type: DidTypeEnum;
  name: string;
  phone: string;
}

export interface AdditionalSignupDataType {
  nickname: string;
  profileImage: string | null;
  accountInfo?: AccountInfoType,
  walletInfo?: WalletInfoType;
  termsAgreements?: {
    service: boolean;
    privacy: boolean;
    marketing: boolean;
  };
}

export interface SignupDataType extends DefaultSignupDataType, AdditionalSignupDataType { }


export interface TermsAgreementData {
  service: boolean;
  privacy: boolean;
  marketing: boolean;
}



export interface RaonData {
  address: string;
  ci: string;
  sex: string | null;
  engsex: string | null;
  birth: string;
  title: string | null;
  telno: string;
  userDid: string;
  uncommitted: unknown;
  ihidnum: string;
  issuanceDate: string | Date;
  foreignflag: string | null;
  vcTypeCodeList: unknown;
  issuerDid: string;
  name: string;
  issude: string;
  issuernm: string | null;
  vcId: string;
  expirationDate: string | Date;
  provider: string;
  locpanm: string | null;
  inorgdonnyn: string | null;
  engnm: string | null;
  lcnscndcdnm: string | null;
  dlno: string | null;
  engaddr: string | null;
  asort: string | null;
  passwordsn: string | null;
  inspctbegend: string | null;
  engbirth: string | null;
}