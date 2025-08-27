import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import CurrentToken from "../currentToken";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("CurrentToken Component", () => {
  const pushMock = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it("토큰 잔액이 표시된다", () => {
    render(<CurrentToken />);
    expect(screen.getByText(/20000\s*RU/)).toBeInTheDocument(); // tqh : 추후 유효한 값으로..
  });

  it("충전하기 버튼 클릭 시 /token/charge로 이동한다", () => {
    render(<CurrentToken />);
    fireEvent.click(screen.getByText("충전하기"));
    expect(pushMock).toHaveBeenCalledWith("/token/charge");
  });

  it("송금하기 버튼 클릭 시 /token/exchange로 이동한다", () => {
    render(<CurrentToken />);
    fireEvent.click(screen.getByText("송금하기"));
    expect(pushMock).toHaveBeenCalledWith("/token/exchange");
  });
});