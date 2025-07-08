// app constant
export const APP_CONFIG = {
  name: "Re-Use",
  description: "안전한 중고거래 플랫폼",
  version: '0.1.0',
  author: "Team MarchTue",
  keywords: ["중고거래", "DID", "블록체인", "거래", "erc-20", "토큰",]
} as const;

// 추후 수정. 
export const API_ENDPOINTS = {

} as const;


export const PRODUCT_CONDITIONS = [
  { value: "new", label: "새상품" },
  { value: "like_new", label: "최상" },
  { value: "good", label: "상" },
  { value: "fair", label: "중" },
  { value: "poor", label: "하" },
] as const;


export const NAVIGATION_TABS = [
  { id: "home", label: "홈", path: "/main" },
  { id: "product", label: "상품", path: "/product" },
  { id: "chat", label: "채팅", path: "/chat" },
  { id: "favourite", label: "관심 상품", path: "/favourite" },
  { id: "myPage", label: "마이", path: "/mypage" },
] as const;