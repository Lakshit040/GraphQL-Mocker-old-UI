import { render } from '@testing-library/react';
import {
  DeleteSVG,
  CreateSVG,
  ChevronUpSVG,
  ChevronDownSVG,
  DocumentationSVG,
  HistorySVG,
  UsersSVG,
  UsersDownSVG,
  DashboardSVG,
} from '../SvgComponents'; 

describe('SvgComponents', () => {
  it('renders DeleteSVG without crashing', () => {
    render(<DeleteSVG />);
  });

  it('renders CreateSVG without crashing', () => {
    render(<CreateSVG />);
  });

  it('renders ChevronUpSVG without crashing', () => {
    render(<ChevronUpSVG />);
  });

  it('renders ChevronDownSVG without crashing', () => {
    render(<ChevronDownSVG />);
  });

  it('renders DocumentationSVG without crashing', () => {
    render(<DocumentationSVG />);
  });

  it('renders HistorySVG without crashing', () => {
    render(<HistorySVG />);
  });

  it('renders UsersSVG without crashing', () => {
    render(<UsersSVG />);
  });

  it('renders UsersDownSVG without crashing', () => {
    render(<UsersDownSVG />);
  });

  it('renders DashboardSVG without crashing', () => {
    render(<DashboardSVG />);
  });
});
