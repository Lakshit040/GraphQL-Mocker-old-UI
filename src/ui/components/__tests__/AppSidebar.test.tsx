import React from 'react';
import { render, screen } from '@testing-library/react';
import AppSidebar from '../AppSidebar';
import '@testing-library/jest-dom';

describe('AppSidebar', () => {
  test('renders the component correctly', () => {
    render(<AppSidebar />);
    
    expect(screen.getByText('GraphQL Mocker')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Response History')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();
  });
});
