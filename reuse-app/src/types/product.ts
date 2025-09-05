export interface IProduct {
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

export interface IProductDetail {
  product: {
    id: string;
    title: string;
    category: string;
    price: number;
    images: string[];
    content: string;
    is_direct: boolean;
    direct_address: string;
    is_parcel: boolean;
    product_state: string;
    is_fav: boolean;
    post_state: string;
    created_at: string;
    views: number;
  };
  seller: {
    content: string;
    is_direct: boolean;
    direct_address?: string;
    is_parcel: boolean;
    is_fav: boolean;
    post_state: any; // Enum 확인할 것
    created_at: Date;
  };
  proposals?: IProposal[];
}

export interface IProposal {
  prodisal_id: string;
  nickname: string;
  profile: string;
  price: number;
  type: any;  // enum 확인
}