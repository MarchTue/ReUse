import { ECategory } from "@/lib/constants";

export interface ICategory {
  id: ECategory;
  name: string;
  icon: string;
  colour: string;
  // description?: string;
}