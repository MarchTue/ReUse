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
  product: IProductInfo;
  seller: ISeller;
  proposals?: IProposal[];
}

export interface IProductInfo {
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
}

export interface ISeller {
  seller_id: string;
  profile: string;
  nickname: string;
  created_at: Date | string;
  rating: number;
  in_progress_trade: number;
  completed_trade: number;
}

export interface IProposal {
  prodisal_id: string;
  nickname: string;
  profile: string;
  price: number;
  type: any;  // enum 확인
}

/**
 * 상품 상태 ENUM
 */
export type TProductState = 'HIGHEST' | 'HIGH' | 'UPPER_HIGH' | 'MID' | 'LOWER_MID' | 'LOW' | '';

export interface IProductForm {
  title: string;
  category: string;
  price: number;
  images: string[];
  content: string;
  is_direct: boolean;
  direct_address: string;
  is_parcel: boolean;  // 직거래 여부
  product_state: TProductState;
}

/**
 * 상품 추가 페이지에서 사용되는 Props의 interface
 */
export interface ProductAddProps {
  formData: IProductForm;
  onNext: () => void;
  onPrev?: () => void;
  onChange: (name: keyof IProductForm, value: IProductForm[keyof IProductForm]) => void;
}