import { render, fireEvent } from "@testing-library/react";
import ExpandedRowComponent from "../ExpandedRowComponent";

describe("<ExpandedRowComponent />", () => {
  const mockProps = {
    id: "1",
    arrayLength: "4",
    stringLength: "8",
    numberStart: "1",
    numberEnd: "1000",
    mockResponse: "test",
    booleanType: "TRUE",
    specialCharactersAllowed: true,
    onArrayLengthChange: jest.fn(),
    onStringLengthChange: jest.fn(),
    onNumberStartChange: jest.fn(),
    onNumberEndChange: jest.fn(),
    onBooleanTypeChange: jest.fn(),
    onMockResponseChange: jest.fn(),
    onPrettifyButtonPressed: jest.fn(),
    onGenerateResponseHereButtonPressed: jest.fn(),
    onSpecialCharactersAllowedChange: jest.fn(),
  };

  it("should render correctly", () => {
    const { getByLabelText, getByPlaceholderText } = render(
      <ExpandedRowComponent {...mockProps} />
    );

    expect(getByLabelText(/Array Length/i)).toHaveValue(mockProps.arrayLength);
    expect(getByLabelText(/String Length/i)).toHaveValue(
      mockProps.stringLength
    );
    expect(getByLabelText(/Number Start/i)).toHaveValue(mockProps.numberStart);
    expect(getByLabelText(/Number End/i)).toHaveValue(mockProps.numberEnd);
    expect(getByPlaceholderText(/Give your response.../i)).toHaveValue(
      mockProps.mockResponse
    );
  });

  it("should call the correct function when change event is fired", () => {
    const { getByLabelText } = render(<ExpandedRowComponent {...mockProps} />);

    fireEvent.change(getByLabelText(/Array Length/i), {
      target: { value: "5" },
    });
    expect(mockProps.onArrayLengthChange).toHaveBeenCalled();

    fireEvent.change(getByLabelText(/String Length/i), {
      target: { value: "10" },
    });
    expect(mockProps.onStringLengthChange).toHaveBeenCalled();
  });

  it("should call onGenerateResponseHereButtonPressed when Randomize Here button is clicked", () => {
    const { getByTitle } = render(<ExpandedRowComponent {...mockProps} />);

    fireEvent.click(getByTitle(/Randomize here/i));
    expect(mockProps.onGenerateResponseHereButtonPressed).toHaveBeenCalledWith(
      mockProps.id
    );
  });

  it("should call onPrettifyButtonPressed when Prettify button is clicked", () => {
    const { getByTitle } = render(<ExpandedRowComponent {...mockProps} />);

    fireEvent.click(getByTitle(/Prettify response/i));
    expect(mockProps.onPrettifyButtonPressed).toHaveBeenCalled();
  });
});
