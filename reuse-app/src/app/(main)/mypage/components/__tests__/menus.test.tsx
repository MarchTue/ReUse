import { render, screen } from "@testing-library/react";
import Menus from "../menus";
import { menuSections } from "@/lib/menus.config";

jest.mock("next/link", () => {
  return ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>;
});

describe("Menus Component", () => {
  it("모든 메뉴 섹션과 항목이 표시된다", () => {
    render(<Menus />);
    menuSections.forEach((section) => {
      expect(screen.getByText(section.title)).toBeInTheDocument();
      section.items.forEach((item) => {
        expect(screen.getByText(item.label)).toBeInTheDocument();
      });
    });
  });

  it("메뉴 항목에는 올바른 data-testid와 href가 설정된다", () => {
    render(<Menus />);
    menuSections.forEach((section) => {
      section.items.forEach((item) => {
        const menuLink = screen.getByTestId(`data-${item.route}`);
        expect(menuLink).toBeInTheDocument();
        expect(menuLink).toHaveAttribute("href", item.route);
      });
    });
  });
});