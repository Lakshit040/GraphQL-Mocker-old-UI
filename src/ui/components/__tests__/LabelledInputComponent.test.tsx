import { render, fireEvent } from '@testing-library/react';
import LabelledInputComponent from '../LabelledInputComponent';

describe('LabelledInputComponent', () => {
  it('renders correctly', () => {
    const onChangeMock = jest.fn();

    const { getByLabelText, getByPlaceholderText } = render(
      <LabelledInputComponent
        htmlInputId="test-id"
        type="text"
        placeholder="test placeholder"
        value="test value"
        label="test label"
        onChange={onChangeMock}
      />
    );

    const label = getByLabelText('test label');
    const input = getByPlaceholderText('test placeholder') as HTMLInputElement;

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('test value');
  });

  it('calls the onChange handler when input changes', () => {
    const onChangeMock = jest.fn();

    const { getByPlaceholderText } = render(
      <LabelledInputComponent
        htmlInputId="test-id"
        type="text"
        placeholder="test placeholder"
        value=""
        label="test label"
        onChange={onChangeMock}
      />
    );

    const input = getByPlaceholderText('test placeholder');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(onChangeMock).toHaveBeenCalled();
  });
});
