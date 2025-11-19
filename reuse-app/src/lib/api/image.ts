
const IMAGE_API_BASE = process.env.NEXT_PUBLIC_IMAGE_API_URL;

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  let response: Response;

  try {
    response = await fetch(`${IMAGE_API_BASE}/image/upload`, {
      method: "POST",
      body: formData
    });
  } catch (error) {
    console.error("네트워크 에러 : ", error);
    throw new Error("네트워크 연결에 문제 발생");
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`이미지 업로드 실패 :${errorData.msg || response.statusText}`);
  }

  const data = await response.json();
  return data;

}

export async function getImageFromServer(hash: string) {

  let response: Response;

  try {
    response = await fetch(`${IMAGE_API_BASE}/image/${hash}`, {
      method: "GET"
    });
  } catch (error) {
    console.error(error);
    throw new Error(`이미지 조회 실패 ${error}`);
  }

  // const data = await response.json();

  console.log(response.url);
}