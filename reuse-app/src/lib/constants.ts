import { ICategory } from "@/types/common";

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

export const CATEGORIES: ICategory[] = [
  {
    id: "electronics",
    name: "디지털/가전",
    icon: "📱",
    colour: "#007aff",
    // description: "스마트폰, 노트북, 각종 가전",
  }, // 1
  {
    id: "home",
    name: "가구/인테리어",
    icon: "🏠",
    colour: "#34c759",
    // description: "",
  },
  {
    id: "WFashion",
    name: "여성의류",
    icon: "👗",
    colour: "#ff2d55",
    // description: "",
  }, // 3
  {
    id: "MFashion",
    name: "남성의류",
    icon: "👔",
    colour: "#5856d6",
    // description: "",
  },
  {
    id: "accessories",
    name: "잡화",
    icon: "👜",
    colour: "#ff9500",
    // description: "",
  },
  {
    id: "living",
    name: "생활/주방",
    icon: "🥣",
    colour: "#a2845e",
    // description: "",
  },
  {
    id: "sports",
    name: "스포츠",
    icon: "⚽",
    colour: "#5ac8fa",
    // description: "",
  },
  {
    id: "hobbies",
    name: "취미",
    icon: "🎨",
    colour: "#6a4395",
    // description: "",
  }, // 8 
  {
    id: "beauty",
    name: "뷰티/미용",
    icon: "💄",
    colour: "#ff2d55",
    // description: "",
  },
  {
    id: "tickets",
    name: "티켓/교환권",
    icon: "🎫",
    colour: "#ffcc00",
    // description: "",
  }, // 10
  {
    id: "pet",
    name: "반려동물",
    icon: "🐾",
    colour: "#d35c1d",
    // description: "",
  },
  {
    id: "books",
    name: "도서",
    icon: "📚",
    colour: "#4a4a4a",
    // description: "",
  },
];