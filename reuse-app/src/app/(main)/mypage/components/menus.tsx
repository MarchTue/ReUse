import { Card } from "@/components/ui/card";
import { iconMap, menuSections } from "@/lib/menus.config";

export default function Menus(props: any) {
  return (
    <div>
      {menuSections.map((section) => (
        <MenuSection key={section.title} title={section.title} items={section.items} />
      ))}
    </div>
  );
}

function MenuSection({ title, items }: { title: string; items: { label: string; }[]; }) {
  return (
    <div className="py-4 p-4">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {/* <div className="grid grid-cols-2 gap-4"> */}
      <div className="">
        {items.map((item) => (
          <MenuItem key={item.label} label={item.label} />
        ))}
      </div>
    </div>
  );
}

function MenuItem({ label }: { label: string; }) {
  const Icon = iconMap[label.replace(/\s/g, "") as keyof typeof iconMap] || null;
  return (
    <div className="flex items-center justify-start pl-6 mt-2 py-4 hover:bg-gray-50 cursor-pointer shadow-sm">
      {Icon && <Icon className="w-6 h-6  text-gray-700 mr-2" />}
      <span className="text-sm">{label}</span>
    </div>

  );
}

// tqh 해당 경로에 해당하는 라우트 넣어주기.

function MenuItem2({ label }: { label: string; }) {
  const Icon = iconMap[label.replace(/\s/g, "") as keyof typeof iconMap] || null;
  return (
    <Card className="flex flex-col items-center justify-center p-4 hover:bg-gray-50 cursor-pointer shadow-sm">
      {Icon && <Icon className="w-6 h-6 mb-2 text-gray-700" />}
      <span className="text-sm">{label}</span>
    </Card>
  );
}
