import { Card } from "@/components/ui/card";
import { iconMap, menuSections } from "@/lib/menus.config";
import Link from "next/link";

export default function Menus(props: any) {
  return (
    <div>
      {menuSections.map((section) => (
        <MenuSection key={section.title} title={section.title} items={section.items} />
      ))}
    </div>
  );
}

function MenuSection({ title, items }: { title: string; items: { label: string; route: string; }[]; }) {
  return (
    <div className="py-4 p-4">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {/* <div className="grid grid-cols-2 gap-4"> */}
      <div className="">
        {items.map((item) => (
          <MenuItem key={item.label} label={item.label} route={item.route} />
        ))}
      </div>
    </div>
  );
}

function MenuItem({ label, route }: { label: string; route: string; }) {
  const Icon = iconMap[label.replace(/\s/g, "") as keyof typeof iconMap] || null;
  return (
    <Link
      href={route}
      data-testid={`data-${route}`}
      className="flex items-center justify-start pl-6 mt-2 py-4 hover:bg-gray-50 cursor-pointer shadow-sm">
      {Icon && <Icon className="w-6 h-6  text-gray-700 mr-2" />}
      <span className="text-sm">{label}</span>
    </Link>
  );
}

