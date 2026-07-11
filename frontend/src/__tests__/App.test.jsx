import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App.jsx';

vi.mock('../Components/Home', () => ({ default: () => <div>Home Component</div> }));
vi.mock('../Components/layout/Header', () => ({ default: () => <div>Header</div> }));
vi.mock('../Components/layout/Footer', () => ({ default: () => <div>Footer</div> }));
vi.mock('../Components/Menu', () => ({ default: () => <div>Menu Component</div> }));
vi.mock('../Components/Cart', () => ({ default: () => <div>Cart Component</div> }));
vi.mock('../Components/Login', () => ({ default: () => <div>Login Component</div> }));
vi.mock('../Components/Register', () => ({ default: () => <div>Register Component</div> }));
vi.mock('../Components/Profile', () => ({ default: () => <div>Profile Component</div> }));
vi.mock('../Components/UpdateProfile', () => ({ default: () => <div>UpdateProfile Component</div> }));
vi.mock('../Components/Shipping', () => ({ default: () => <div>Shipping Component</div> }));
vi.mock('../Components/ConfirmOrder', () => ({ default: () => <div>ConfirmOrder Component</div> }));
vi.mock('../Components/Payment', () => ({ default: () => <div>Payment Component</div> }));
vi.mock('../Components/OrderSuccess', () => ({ default: () => <div>OrderSuccess Component</div> }));
vi.mock('../Components/MyOrders', () => ({ default: () => <div>MyOrders Component</div> }));
vi.mock('../Components/OrderDetails', () => ({ default: () => <div>OrderDetails Component</div> }));
vi.mock('../Components/ForgotPassword', () => ({ default: () => <div>ForgotPassword Component</div> }));

describe('App Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('renders Header component', () => {
    render(<App />);
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('renders Footer component', () => {
    render(<App />);
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
