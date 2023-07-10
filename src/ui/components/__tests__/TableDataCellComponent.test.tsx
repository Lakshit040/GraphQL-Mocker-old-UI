import { render, fireEvent, screen } from '@testing-library/react';
import TableDataCellComponent from '../TableDataCellComponent';

describe('TableDataCellComponent', () => {
  test('renders text input correctly and handles changes', () => {
    const handleChange = jest.fn();

    render(
      <TableDataCellComponent 
        type="text" 
        placeholder="Test Placeholder" 
        onChange={handleChange} 
        value="Test Value" 
      />
    );
    
    const input = screen.getByPlaceholderText('Test Placeholder') as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(input.value).toBe('Test Value');

    fireEvent.change(input, { target: { value: 'New Value' } });
    expect(handleChange).toHaveBeenCalled();
  });

  test('renders checkbox correctly and handles changes', () => {
    const handleChange = jest.fn();

    render(
      <TableDataCellComponent 
        type="checkbox" 
        onChange={handleChange} 
        checked={false} 
      />
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

    expect(checkbox).toBeInTheDocument();
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalled();
  });
});
