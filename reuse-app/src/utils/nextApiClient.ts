import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const NEXT_API_BASE_URL = process.env.NEXT_PUBLIC_NEXT_API_BASE_URL;

class NextApiClient {
  private nextApi: AxiosInstance;

  constructor() {
    this.nextApi = axios.create({
      baseURL: NEXT_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
  }
  getNext<T = any, R = T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
    return this.nextApi.get<T, AxiosResponse<R>>(url, config); // 제네릭 명시
  }

  postNext<T = any, R = T>(url: string, data?: T, config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
    return this.nextApi.post<T, AxiosResponse<R>>(url, data, config); // 제네릭 명시
  }

  putNext<T = any, R = T>(url: string, data?: T, config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
    return this.nextApi.put<T, AxiosResponse<R>>(url, data, config); // 제네릭 명시
  }

  deleteNext<T = any, R = T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
    return this.nextApi.delete<T, AxiosResponse<R>>(url, config); // 제네릭 명시
  }

}
const nextClient = new NextApiClient();
export default nextClient;