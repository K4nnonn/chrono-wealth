import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import ErrorBoundary from '@/components/ErrorBoundary';

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock data generators
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
  aud: 'authenticated',
  role: 'authenticated',
  email_confirmed_at: '2023-01-01T00:00:00.000Z',
  user_metadata: {
    first_name: 'Test',
    last_name: 'User',
  },
  app_metadata: {},
  identities: [],
};

export const mockSubscriber = {
  id: 'test-subscriber-id',
  user_id: 'test-user-id',
  email: 'test@example.com',
  stripe_customer_id: 'cus_test123',
  subscribed: true,
  subscription_tier: 'Premium',
  subscription_end: '2024-01-01T00:00:00.000Z',
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
};

export const mockFinancialData = {
  accounts: [
    {
      id: 'test-account-1',
      name: 'Test Checking',
      type: 'depository',
      subtype: 'checking',
      balance: 5000,
      available_balance: 4800,
    },
    {
      id: 'test-account-2',
      name: 'Test Savings',
      type: 'depository',
      subtype: 'savings',
      balance: 15000,
      available_balance: 15000,
    },
  ],
  transactions: [
    {
      id: 'test-transaction-1',
      account_id: 'test-account-1',
      amount: -50.00,
      date: '2023-12-01',
      name: 'Coffee Shop',
      category: ['Food and Drink', 'Restaurants'],
    },
    {
      id: 'test-transaction-2',
      account_id: 'test-account-2',
      amount: 1000.00,
      date: '2023-12-01',
      name: 'Salary Deposit',
      category: ['Transfer', 'Deposit'],
    },
  ],
};

// Test helpers for async operations
export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 100));

// Performance testing utilities
export const measureComponentRender = async (component: React.ReactElement) => {
  const start = performance.now();
  const { unmount } = render(component);
  const end = performance.now();
  unmount();
  return end - start;
};

// Accessibility testing helpers
export const checkA11y = async (container: HTMLElement) => {
  // This would integrate with axe-core in a real implementation
  const issues: string[] = [];
  
  // Check for missing alt text on images
  const images = container.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.alt && !img.getAttribute('aria-label')) {
      issues.push('Image missing alt text');
    }
  });
  
  // Check for missing labels on form elements
  const inputs = container.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    const id = input.id;
    const hasLabel = id && container.querySelector(`label[for="${id}"]`);
    const hasAriaLabel = input.getAttribute('aria-label');
    const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
    
    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push('Form element missing label');
    }
  });
  
  return issues;
};