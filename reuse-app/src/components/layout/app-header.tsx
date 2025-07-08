"use client";

import { Bell, User, Search } from "lucide-react";
import { ReactNode } from "react";


interface AppHeaderProps {
  userName?: string;
  children?: ReactNode;
  userProfileImageUrl?: string;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onSearchClick?: () => void;
}

export function AppHeader({
  userName,
  children,
  userProfileImageUrl,
  onNotificationClick,
  onProfileClick,
  onSearchClick
}: AppHeaderProps) {
  return (
    <div className="bg-white border-b border-ios-gray6 pt-2">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="
              text-3xl font-bold text-transparent bg-clip-text 
              bg-gradient-to-r from-primary-500 to-grad
            ">Re-Use</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              aria-label="검색"
              className="p-2 rounded-full bg-ios-gray6 active:scale-95 transition-all"
              onClick={onSearchClick}
            >
              <Search />
            </button>
            <button
              aria-label="알림"
              className="p-2 rounded-full bg-ios-gray6 active:scale-95 transition-all"
              onClick={onNotificationClick}
            >
              <Bell />
            </button>
            <button
              aria-label="프로필"
              className="p-2 rounded-full bg-ios-gray6 active:scale-95 transition-all"
              onClick={onProfileClick}
            >
              <User />
              {/* tqh 추후 유저 정보의 프로필 사진 들어오면 */}
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
