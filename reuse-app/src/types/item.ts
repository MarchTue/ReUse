export interface IItem {
  id: number | string;
  title: string;
  price: number;
  category: string;
  imageUrl: string;
  rating?: {
    rate: number;
    count: number;
  };
}