import Home from "@/app/home/page";
import { render } from "@testing-library/react";


describe("Home", () => {
  it('홈 화면 랜더링 확인', () => {
    const home = render(<Home />);
    expect(home).toMatchSnapshot();
  });
});