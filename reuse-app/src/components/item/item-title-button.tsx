
export default function ItemTitleButton({
  title,
  categoryId
}: { title: string; categoryId?: string; }) {
  return (
    <div className="flex px-4 items-center justify-between">
      <h2 className="font-bold text-2xl">{title}</h2>
      <p className="text-ios-gray hover:text-black" onClick={() => { }}>더보기</p>
    </div>
  );
}
