"use client";

import { useCallback, useEffect, useState } from "react";


/**
 * 스크롤 이벤트 너무 많을 수 있으므로 Throttle 구현
 */
const throttle = (func: (...args: any[]) => void, delay: number) => {
  let lastTime = 0;
  return function (...args: any[]) {
    const now = new Date().getTime();
    if (now - lastTime < delay) {
      return;
    }
    lastTime = now;
    func(...args);
  };
};

export default function PostButton() {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const curY = window.scrollY;
    setIsScrolled(curY > 150);
  }, []);

  useEffect(() => {
    const throttleHandleScroll = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttleHandleScroll);

    return () => {
      window.removeEventListener('scroll', throttleHandleScroll);
    };
  }, [handleScroll]);

  const contentText = isScrolled ? "+" : "+ Add";

  const containerClasses = isScrolled
    ? "w-10" // 스크롤 시: 작은 정사각형 버튼
    : "w-auto px-4"; // 스크롤 안 할 시: 'Add' 텍스트를 포함할 수 있는 너비

  // 텍스트 크기 변화를 위한 클래스
  const textClasses = isScrolled
    ? "text-2xl" // 스크롤 시: '+' 텍스트 크기
    : "text-xl"; // 스크롤 안 할 시: '+ Add' 텍스트 크기

  return (

    <div className={`
        flex justify-center items-center 
        rounded-full fixed z-100 bg-primary-500 bottom-20 right-2 
        shadow-lg
        transition-all duration-200 
        p-0 h-10 overflow-hidden
        ${containerClasses}
    `}>

      <span className={`
          text-white font-semibold whitespace-nowrap
          transition-all duration-200 ease-in
          flex justify-center items-center h-full
          ${textClasses}
      `}>
        {contentText}
      </span>
    </div>
  );
}