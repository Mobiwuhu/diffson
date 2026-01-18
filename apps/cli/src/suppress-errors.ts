/**
 * Suppress specific console errors
 * This file is loaded before the main application
 */

const originalConsoleError = console.error;

console.error = (...args: any[]) => {
  const message = String(args[0] || '');
  
  // Suppress "Identifier already exists" errors from dependency injection
  if (message.includes('Identifier') && message.includes('already exists')) {
    return;
  }
  
  originalConsoleError.apply(console, args);
};

