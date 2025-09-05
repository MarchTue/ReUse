import { IProduct } from '@/types/product';

export const mockProducts: IProduct[] = [
  // 디지털/가전
  {
    id: "digital-1",
    title: "무선 이어폰",
    price: 120000,
    category: "디지털/가전",
    imageUrl: "/mock-item.png",
  },
  {
    id: "digital-2",
    title: "스마트 워치",
    price: 180000,
    category: "디지털/가전",
    imageUrl: "/mock-item.png",
  },
  {
    id: "digital-3",
    title: "블루투스 스피커",
    price: 90000,
    category: "디지털/가전",
    imageUrl: "/mock-item.png",
  },
  {
    id: "digital-4",
    title: "HP 노트북",
    price: 850000,
    category: "디지털/가전",
    imageUrl: "/mock-item.png",
  },
  {
    id: "digital-5",
    title: "태블릿",
    price: 500000,
    category: "디지털/가전",
    imageUrl: "/mock-item.png",
  },

  // 도서
  {
    id: "book-1",
    title: "신곡",
    price: 15000,
    category: "도서",
    imageUrl: "/mock-item.png",
  },
  {
    id: "book-2",
    title: "돈 키호테",
    price: 20000,
    category: "도서",
    imageUrl: "/mock-item.png",
  },
  {
    id: "book-3",
    title: "인간 실격",
    price: 12000,
    category: "도서",
    imageUrl: "/mock-item.png",
  },
  {
    id: "book-4",
    title: "호모 데우스",
    price: 25000,
    category: "도서",
    imageUrl: "/mock-item.png",
  },
  {
    id: "book-5",
    title: "프라도 가이드",
    price: 30000,
    category: "도서",
    imageUrl: "/mock-item.png",
  },

  // 잡화
  {
    id: "goods-1",
    title: "피어싱",
    price: 8000,
    category: "잡화",
    imageUrl: "/mock-item.png",
  },
  {
    id: "goods-2",
    title: "만년필",
    price: 45000,
    category: "잡화",
    imageUrl: "/mock-item.png",
  },
  {
    id: "goods-3",
    title: "연필",
    price: 2000,
    category: "잡화",
    imageUrl: "/mock-item.png",
  },
  {
    id: "goods-4",
    title: "거울",
    price: 5000,
    category: "잡화",
    imageUrl: "/mock-item.png",
  },
  {
    id: "goods-5",
    title: "머그컵",
    price: 10000,
    category: "잡화",
    imageUrl: "/mock-item.png",
  },
];

export const mockCategories = ['디지털/가전', '도서', '잡화'];