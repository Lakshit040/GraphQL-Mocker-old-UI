import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar';

describe('Navbar', () => {
  test('renders the component correctly', () => {
    render(<Navbar />);
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Ctrl + /')).toBeInTheDocument();
  });
});
