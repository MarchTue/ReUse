import { render, screen, fireEvent } from '@testing-library/react';
import { AppHeader } from '../app-header';


const mockonNotificationClick = jest.fn();
const mockonProfileClick = jest.fn();
const mockonSearchClick = jest.fn();


const defaultProps = {
  userName: 'TestUser',
  onNotificationClick: mockonNotificationClick,
  onProfileClick: mockonProfileClick,
  onSearchClick: mockonSearchClick,
};


describe('AppHeader Component 테스트', () => {

  beforeEach(() => {
    mockonNotificationClick.mockClear();
    mockonProfileClick.mockClear();
    mockonSearchClick.mockClear();
  });

  it('컴포넌트가 올바르게 렌더링 되어야 합니다.', () => {
    render(<AppHeader {...defaultProps} />);

    expect(screen.getByText('Re-Use')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '검색' }));
    expect(screen.getByRole('button', { name: '알림' }));
    expect(screen.getByRole('button', { name: '프로필' }));

  });

  it('검색 버튼 클릭 시 onSearchClick 핸들러가 호출되어야 합니다.', () => {
    render(<AppHeader {...defaultProps} />);

    const searchButton = screen.getByRole('button', { name: '검색' });

    fireEvent.click(searchButton);
    expect(mockonSearchClick).toHaveBeenCalled();
  });

  it('프로필 버튼 클릭 시 onProfileClick 핸들러가 호출되어야 합니다.', () => {
    render(<AppHeader {...defaultProps} />);

    const profileButton = screen.getByRole('button', { name: '프로필' });

    fireEvent.click(profileButton);
    expect(mockonProfileClick).toHaveBeenCalled();
  });

  it('알림 버튼 클릭 시 onNotificationClick 핸들러가 호출되어야 합니다.', () => {
    render(<AppHeader {...defaultProps} />);

    const notificationButton = screen.getByRole('button', { name: '알림' });

    fireEvent.click(notificationButton);
    expect(mockonNotificationClick).toHaveBeenCalled();
  });

  it('children prop이 제공된 경우, children이 랜더링 되어야 합니다', () => {
    // 1. 문자열
    const testTextChild = '커스텀 텍스트';
    render(<AppHeader {...defaultProps}>{testTextChild}</AppHeader>);
    expect(screen.getByText(testTextChild)).toBeInTheDocument();

    // 2. 단일 요소
    const testPElement = (<p data-testid="custom-p">커스텀 P</p>);
    render(<AppHeader {...defaultProps}>{testPElement}</AppHeader>);
    expect(screen.getByTestId('custom-p')).toBeInTheDocument();

    // 3. 중첩된 jsx 요소
    const testDivWithP = (<div data-testid="custom-div"><p>중첩된 P</p></div>);
    render(<AppHeader {...defaultProps}>{testDivWithP}</AppHeader>);
    expect(screen.getByTestId('custom-div')).toBeInTheDocument();
    expect(screen.getByText('중첩된 P')).toBeInTheDocument();

    // 4. 배열 형태의 요소
    const testArrChildren = [
      <span key='span' data-testid='child-span'>첫 번째 자식</span>,
      <strong key="strong" data-testid='child-strong'>두 번째 자식 </strong>
    ];
    render(<AppHeader {...defaultProps}>{testArrChildren}</AppHeader>);
    expect(screen.getByTestId("child-span"));
    expect(screen.getByTestId("child-strong"));
    expect(screen.getByText("첫 번째 자식"));
    expect(screen.getByText("두 번째 자식"));
  });

  // tqh 이미지 테스트 코드
  // it('유저의 프로필 이미지가 제공된 경우 렌더링 되어야 합니다.', () => {
  // });
});