import { render, screen } from "@testing-library/react";
// import "@testing-library/jest-dom";
import ErrorMessage from "../index";

describe("ErrorMessage", () => {
  it("renders nothing when no message is provided", () => {
    const { container } = render(<ErrorMessage />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the error message when provided", () => {
    const errorMessage = "This is an error message";
    render(<ErrorMessage message={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    const errorMessage = "This is an error message";
    const customClass = "custom-error-class";
    render(<ErrorMessage message={errorMessage} className={customClass} />);
    const element = screen.getByText(errorMessage);
    expect(element).toHaveClass("text-red-600");
    expect(element).toHaveClass(customClass);
  });

  it("renders ReactNode as message", () => {
    const message = (
      <span>
        Custom error <strong>message</strong>
      </span>
    );
    render(<ErrorMessage message={message} />);
    expect(screen.getByText("Custom error")).toBeInTheDocument();
    expect(screen.getByText("message")).toBeInTheDocument();
  });
});
