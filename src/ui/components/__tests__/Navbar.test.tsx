import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar';

describe('Navbar', () => {
  test('renders the component correctly', () => {
    render(<Navbar />);
    
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Ctrl + /')).toBeInTheDocument();

    expect(screen.getByTestId('search-svg')).toBeInTheDocument();
    expect(screen.getByTestId('notification-svg')).toBeInTheDocument();

    const image = screen.getByAltText('Image Description') as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toContain('https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80');
  });
});
