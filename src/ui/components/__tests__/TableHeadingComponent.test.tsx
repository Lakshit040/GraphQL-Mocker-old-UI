import { render, screen } from '@testing-library/react';
import TableHeadingComponent from '../TableHeadingComponent';

describe('TableHeadingComponent', () => {
  test('renders the component correctly', () => {
    render(<TableHeadingComponent />);
    
    expect(screen.getByText('Rule')).toBeInTheDocument();
    expect(screen.getByText('Response Delay')).toBeInTheDocument();
    expect(screen.getByText('Status Code')).toBeInTheDocument();
    expect(screen.getByText('Randomize')).toBeInTheDocument();
  });
});
