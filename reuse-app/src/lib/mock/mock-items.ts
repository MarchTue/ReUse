import { IItem } from '@/types/item';



export const mockCategories = ['디지털/가전', '도서', '잡화'];

const sampleNames: Record<string, string[]> = {
  "디지털/가전": ["무선 이어폰", "스마트 워치", "블루투스 스피커", "노트북", "태블릿"],
  "도서": ["신곡", "돈 키호테", "인간 실격", "호모 데우스", "프라도 가이드"],
  "잡화": ["피어싱", "만년필", "연필", "거울"]
};

export const mockItems: IItem[] = [];

let idCounter = 1;

mockCategories.forEach((category) => {
  for (let i = 0; i < 20; i++) {
    const name = sampleNames[category][Math.floor(Math.random() * sampleNames[category].length)];
    mockItems.push({
      id: crypto.randomUUID(),
      title: `${name} ${i + 1}`,
      price: Math.floor(Math.random() * 200000) + 10000,
      category,
      imageUrl: '/mock-item.png',
    });
  }
});