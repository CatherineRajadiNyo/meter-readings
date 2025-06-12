import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import FileUpload from "../index";
import { ExcelMimeType } from "@/enums/file";

describe("FileUpload", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders correctly with default props", () => {
    render(<FileUpload onChange={mockOnChange} />);

    expect(screen.getByText(/Drag & drop a/i)).toBeInTheDocument();
    expect(screen.getByText(/file here, or click to browse/i)).toBeInTheDocument();
  });

  it("renders correctly with acceptType prop", () => {
    render(<FileUpload onChange={mockOnChange} acceptType={[ExcelMimeType.CSV]} />);

    expect(
      screen.getByText(/Drag & drop a CSV file here, or click to browse/i)
    ).toBeInTheDocument();
  });

  it("renders file name when file is provided", () => {
    const file = new File(["test"], "test.csv", { type: ExcelMimeType.CSV });
    render(<FileUpload onChange={mockOnChange} file={file} />);

    expect(screen.getByText("test.csv")).toBeInTheDocument();
  });

  it("handles file upload via click", async () => {
    const file = new File(["test"], "test.csv", { type: ExcelMimeType.CSV });
    render(<FileUpload onChange={mockOnChange} acceptType={[ExcelMimeType.CSV]} />);

    const dropZone = screen.getByText(/Drag & drop a CSV file here/i).parentElement;
    const fileInput = screen.getByTestId("file-input");

    if (!dropZone) throw new Error("Drop zone not found");

    // Click the drop zone to trigger the file input click
    fireEvent.click(dropZone);
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockOnChange).toHaveBeenCalledWith(file);
  });

  it("handles file upload via drag and drop", async () => {
    const file = new File(["test"], "test.csv", { type: ExcelMimeType.CSV });
    render(<FileUpload onChange={mockOnChange} acceptType={[ExcelMimeType.CSV]} />);

    const dropZone = screen.getByText(/Drag & drop a CSV file here/i).parentElement;
    if (!dropZone) throw new Error("Drop zone not found");

    // Simulate drag and drop
    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(mockOnChange).toHaveBeenCalledWith(file);
  });

  it("shows error for invalid file type", async () => {
    const file = new File(["test"], "test.txt", { type: "text/plain" });
    const mockSetErrorMessage = jest.fn();
    render(
      <FileUpload
        onChange={mockOnChange}
        acceptType={[ExcelMimeType.CSV]}
        setErrorMessage={mockSetErrorMessage}
      />
    );

    const dropZone = screen.getByText(/Drag & drop a CSV file here/i).parentElement;
    if (!dropZone) throw new Error("Drop zone not found");

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(mockSetErrorMessage).toHaveBeenCalledWith("Please select a valid file.");
    });
    expect(mockOnChange).toHaveBeenCalledWith(undefined);
  });

  it("clears error when valid file is uploaded after invalid file", async () => {
    const invalidFile = new File(["test"], "test.txt", { type: "text/plain" });
    const validFile = new File(["test"], "test.csv", { type: ExcelMimeType.CSV });
    const mockSetErrorMessage = jest.fn();

    render(
      <FileUpload
        onChange={mockOnChange}
        acceptType={[ExcelMimeType.CSV]}
        setErrorMessage={mockSetErrorMessage}
      />
    );

    const dropZone = screen.getByText(/Drag & drop a CSV file here/i).parentElement;
    if (!dropZone) throw new Error("Drop zone not found");

    // First upload invalid file
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [invalidFile],
      },
    });

    await waitFor(() => {
      expect(mockSetErrorMessage).toHaveBeenCalledWith("Please select a valid file.");
    });
    expect(mockOnChange).toHaveBeenCalledWith(undefined);

    // Then upload valid file
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [validFile],
      },
    });

    await waitFor(() => {
      expect(mockSetErrorMessage).toHaveBeenCalledWith(undefined);
    });
    expect(mockOnChange).toHaveBeenLastCalledWith(validFile);
  });
});
