import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignIn from './SignIn';  // Adjust the import based on your structure
import { loginUser } from '../fetch/SignIn';  // Import the login function
import { setStatus } from "../utils/Auth";  // Import any utility functions you need

// Mock the API call and utility functions
jest.mock('../fetch/SignIn', () => ({
    loginUser: jest.fn(),
}));

jest.mock('../utils/Auth', () => ({
    setStatus: jest.fn(),
}));

describe('SignIn Component', () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>
        );
    });

    test('renders SignIn component', () => {
        expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    });

    test('displays toast when email or password is invalid', async () => {
        const emailInput = screen.getByPlaceholderText(/email/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);
        const button = screen.getByRole('button', { name: /sign in/i });

        // Enter invalid credentials
        fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(button);

        // Check that the error toast is displayed
        expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    });

    test('navigates to dashboard on successful login', async () => {
        const emailInput = screen.getByPlaceholderText(/email/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);
        const button = screen.getByRole('button', { name: /sign in/i });

        // Mock the successful login response
        loginUser.mockResolvedValueOnce({
            access_token: 'fakeAccessToken',
        });

        // Enter valid credentials
        fireEvent.change(emailInput, { target: { value: 'admin@unwita.com' } });
        fireEvent.change(passwordInput, { target: { value: '123' } });
        fireEvent.click(button);

        // Expect to navigate to dashboard (you might want to use useNavigate from react-router-dom)
        // In a test environment, we can't test actual navigation; instead, you can check for side effects.
        expect(setStatus).toHaveBeenCalledWith('Loggedin Successfully');
        // Here you might add more assertions based on what happens after login
    });

    test('toggles password visibility', () => {
        const passwordInput = screen.getByPlaceholderText(/password/i);
        const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });

        // Click to show the password
        fireEvent.click(toggleButton);
        expect(passwordInput.type).toBe('text');

        // Click again to hide the password
        fireEvent.click(toggleButton);
        expect(passwordInput.type).toBe('password');
    });
});
