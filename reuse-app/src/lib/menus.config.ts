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
      { label: "관심 상품", route: "/mypage/favourites" },
      { label: "거래중인 상품", route: "/mypage/active" },
      { label: "판매 내역", route: "/mypage/selling" },
      { label: "구매 내역", route: "/mypage/buying" },
      { label: "선호 카테고리 설정", route: "/mypage/preferences" },
    ],
  },
  {
    title: "거래 메뉴",
    items: [
      { label: "받은 거래 요청", route: "/mypage/trade/incoming" },
      { label: "보낸 거래 요청", route: "/mypage/trade/outgoing" },
      { label: "거래 내역 일괄 조회", route: "/mypage/trade/history" },
    ],
  },
  {
    title: "결제 메뉴",
    items: [
      { label: "토큰 이력", route: "/mypage/payment/tokens" },
      { label: "결제 이력", route: "/mypage/payment/history" },
      { label: "연결된 계좌 설정", route: "/mypage/payment/accounts" },
    ]
  },
  {
    title: "고객 메뉴"
    , items: [
      { label: "신고 이력", route: "/mypage/support/reports" },
      { label: "문의 내역", route: "/mypage/support/inquiries" },
      { label: "자주 묻는 질문", route: "/mypage/support/faq" },
    ]
  }
];