import React from 'react';
import { PhotoCollector } from '../lib/components/PhotoCollector';
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('should return correct image blob', async () => {
  const setImage = vi.fn();
  render(<PhotoCollector setImage={setImage} />);

  const file = new File(['mocked content'], 'mock.png', { type: 'image/png' });
  userEvent.upload(await screen.findByTestId('select-photo-input'), [file]);

  await new Promise((resolve) => setTimeout(resolve, 100));

  expect(setImage.mock.lastCall[0]).toBeInstanceOf(File);
});