import {
  Heart, ShoppingCart, List,
  History, Settings, HelpCircle,
  MessageSquare, AlertTriangle, Coins,
  CreditCard, Banknote, Folder
} from "lucide-react";


export const iconMap = {
  관심상품: Heart,
  거래중인상품: ShoppingCart,
  판매내역: List,
  구매내역: History,
  선호카테고리설정: Settings,

  받은거래요청: MessageSquare,
  보낸거래요청: MessageSquare,
  거래내역일괄조회: Folder,

  토큰이력: Coins,
  결제이력: CreditCard,
  연결된계좌설정: Banknote,

  신고이력: AlertTriangle,
  문의내역: MessageSquare,
  자주묻는질문: HelpCircle
};

export const menuSections = [
  {
    title: "주요 메뉴",
    items: [
      { label: "관심 상품" },
      { label: "거래중인 상품" },
      { label: "판매 내역" },
      { label: "구매 내역" },
      { label: "선호 카테고리 설정" },
    ],
  },
  {
    title: "거래 메뉴",
    items: [
      { label: "받은 거래 요청" },
      { label: "보낸 거래 요청" },
      { label: "거래 내역 일괄 조회" },
    ],
  },
  {
    title: "결제 메뉴",
    items: [
      { label: "토큰 이력" },
      { label: "결제 이력" },
      { label: "연결된 계좌 설정" },
    ]
  },
  {
    title: "고객 메뉴"
    , items: [
      { label: "신고 이력" },
      { label: "문의 내역" },
      { label: "자주 묻는 질문" },
    ]
  }
];