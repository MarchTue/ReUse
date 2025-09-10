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


export enum ECategory {
  ELECTRONICS = "ELECTRONICS",
  INTERIOR = "INTERIOR",
  KIDS_BABY = "KIDS_BABY",
  WOMENS_CLOTHING = "WOMENS_CLOTHING",
  MENS_CLOTHING = "MENS_CLOTHING",
  ACCESSORIES = "ACCESSORIES",
  HOUSEHOLD = "HOUSEHOLD",
  SPORTS = "SPORTS",
  HOBBY = "HOBBY",
  BEAUTY = "BEAUTY",
  PLANTS = "PLANTS",
  PETS = "PETS",
  TICKETS = "TICKETS",
  BOOKS = "BOOKS",
  OTHERS = "OTHERS",
}

export const CATEGORIES: ICategory[] = [
  {
    id: ECategory.ELECTRONICS,
    name: "디지털/가전",
    icon: "📱",
    colour: "#007aff",
    // description: "스마트폰, 노트북, 각종 가전",
  }, // 1
  {
    id: ECategory.INTERIOR,
    name: "인테리어",
    icon: "🏠",
    colour: "#34c759",
    // description: "",
  },
  {
    id: ECategory.KIDS_BABY,
    name: "유아동",
    icon: "👶",
    colour: "#FFF106",
    // description: "",
  },
  {
    id: ECategory.WOMENS_CLOTHING,
    name: "여성의류",
    icon: "👗",
    colour: "#ff2d55",
    // description: "",
  }, // 3

  {
    id: ECategory.MENS_CLOTHING,
    name: "남성의류",
    icon: "👔",
    colour: "#5856d6",
    // description: "",
  },
  {
    id: ECategory.ACCESSORIES,
    name: "잡화",
    icon: "👜",
    colour: "#ff9500",
    // description: "",
  },
  {
    id: ECategory.HOUSEHOLD,
    name: "생활/주방",
    icon: "🥣",
    colour: "#a2845e",
    // description: "",
  },
  {
    id: ECategory.SPORTS,
    name: "스포츠",
    icon: "⚽",
    colour: "#5ac8fa",
    // description: "",
  },
  {
    id: ECategory.HOBBY,
    name: "취미",
    icon: "🎨",
    colour: "#6a4395",
    // description: "",
  }, // 8 
  {
    id: ECategory.BEAUTY,
    name: "뷰티/미용",
    icon: "💄",
    colour: "#ff2d55",
    // description: "",
  },
  {
    id: ECategory.PLANTS,
    name: "식물",
    icon: "🌳",
    colour: "#42F04F",
    // description: "",
  },
  {
    id: ECategory.PETS,
    name: "반려동물",
    icon: "🐾",
    colour: "#d35c1d",
    // description: "",
  },
  {
    id: ECategory.TICKETS,
    name: "티켓/교환권",
    icon: "🎫",
    colour: "#ffcc00",
    // description: "",
  }, // 10

  {
    id: ECategory.BOOKS,
    name: "도서",
    icon: "📚",
    colour: "#4a4a4a",
    // description: "",
  },
  {
    id: ECategory.OTHERS,
    name: "기타",
    icon: "☑️",
    colour: "#4a4a4a",
    // description: "",
  },
];