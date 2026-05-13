import { render } from '@testing-library/react';
import App from './App';

jest.mock('react-router-dom', () => ({
  RouterProvider: () => <div data-testid="app" />,
}), { virtual: true });
jest.mock('./routes', () => ({}));
jest.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
}));

test('renders without crashing', () => {
  // arrange / act
  const { container } = render(<App />);

  // assert
  expect(container).toBeInTheDocument();
});
