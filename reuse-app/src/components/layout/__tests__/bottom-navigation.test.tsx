import { render, screen, fireEvent } from '@testing-library/react';
import { BottomNavigation } from '../bottom-navigation';
import { NAVIGATION_TABS } from '@/lib/constants';
import { usePathname } from 'next/navigation';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: jest.fn()
}));


describe('BottomNavigation Component', () => {
  beforeEach(() => {
    mockPush.mockClear();
    (require('next/navigation').usePathname as jest.Mock).mockReturnValue('/');
  });

  it('모든 내비게이션 탭이 렌더링 되어야 합니다.', () => {
    (require('next/navigation').usePathname as jest.Mock).mockReturnValue('/main');

    render(<BottomNavigation />);

    NAVIGATION_TABS.forEach((tab) => {
      expect(screen.getByText(tab.label)).toBeInTheDocument();
      expect(screen.getByTestId(`data-${tab.id}`)).toBeInTheDocument();
    });
  });

  it('현재 경로에 해당하는 탭이 active 되어있어야 합니다.', () => {
    (require('next/navigation').usePathname as jest.Mock).mockReturnValue('/product');
    render(<BottomNavigation />);

    const productTabButton = screen.getByTestId('data-product');
    expect(productTabButton).toHaveClass('text-primary-500');
    expect(productTabButton).not.toHaveClass('text-ios-gray');

    const homeTabButton = screen.getByTestId('data-home');
    expect(homeTabButton).not.toHaveClass('text-primary-500');
    expect(homeTabButton).toHaveClass('text-ios-gray');
  });

  it('기본 경로가 아닐땐 첫 탭이 활성화 되어야 합니다.', () => {
    (require('next/navigation').usePathname as jest.Mock).mockReturnValue('/unknown-path');
    render(<BottomNavigation />);

    const homeTabButton = screen.getByTestId('data-home');
    expect(homeTabButton).toHaveClass('text-primary-500');
    expect(homeTabButton).not.toHaveClass('text-ios-gray');
  });

  it('탭 버튼 클릭 시 해당 경로로 이동해야 합니다.', () => {
    render(<BottomNavigation />);

    const chatTabButton = screen.getByText('채팅');

    fireEvent.click(chatTabButton);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/chat');
  });

  it('다른 탭 버튼 클릭 시에도 해당 경로로 이동해야 합니다.', () => {
    render(<BottomNavigation />);

    const myPageTabButton = screen.getByText('마이');
    fireEvent.click(myPageTabButton);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/mypage');
  });

})

