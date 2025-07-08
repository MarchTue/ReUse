"use client";

import { NAVIGATION_TABS } from "@/lib/constants";
import { Heart, Home, MessageCircle, Search, ShoppingCart, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const iconMap = {
  home: Home,
  product: ShoppingCart,
  chat: MessageCircle,
  favourite: Heart,
  myPage: User
};

export function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const getActiveTab = () => {
    const currentTab = NAVIGATION_TABS.find((tab) => pathname.startsWith(tab.path));
    return currentTab?.id || "home";
  };

  const handleTabClick = (tab: (typeof NAVIGATION_TABS)[number]) => {
    router.push(tab.path);
  };

  const activeTab = getActiveTab();

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-l-ios-gray5">
      <div className="flex justify-around py-2">
        {NAVIGATION_TABS.map((tab) => {
          const IconCompnent = iconMap[tab.id as keyof typeof iconMap];
          return (
            <button
              key={tab.id}
              data-testid={`data-${tab.id}`}
              className={`flex flex-col items-center py-2 px-3 min-w-8 min-y-8 active:scale-95 transition-all ${activeTab === tab.id ? "text-primary-500" : "text-ios-gray"
                }`}
              onClick={() => handleTabClick(tab)}
            >
              <IconCompnent className="w-6 h-6 mb-1" />
              <span className="text-ios-caption2 font-medium">{tab.label}</span>
            </button>);
        })}
      </div>
    </div>
  );
}