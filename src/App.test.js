import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('enter text and await response', async () => {
  render(<App />);
  const input = document.getElementById('main-input');
  
  fireEvent.change(input, {
    target: {value: 'uni'}
  })

  expect(await screen.findByText("United States of America")).toBeInTheDocument();
})