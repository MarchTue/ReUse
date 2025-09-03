import { render, screen } from "@testing-library/react";
import UserProfile from "../userProfile";

describe("UserProfile Component", () => {
  it("유저 이름과 첫 글자가 표시된다", () => {
    render(<UserProfile />);
    expect(screen.getByText("삼월화")).toBeInTheDocument();
    expect(screen.getByText("삼")).toBeInTheDocument();
  });

  it("편집 아이콘(Edit2)이 존재한다", () => {
    const { container } = render(<UserProfile />);
    const editIcon = container.querySelector("svg");
    expect(editIcon).toBeTruthy();
  });
});