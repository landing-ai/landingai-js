import React from 'react';
import { InferenceContext } from '../lib/context/InferenceContext';
import { InferenceResult } from '../lib/components/InferenceResult';
import { ApiInfo, InferenceResult as InferenceResultType } from 'landingai';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

const INFERENCE_URL =
  'blob:https://test.platform.landingai.io/3828596b-5227-4e40-ab68-343934fc9ebf';

global.URL.createObjectURL = vi.fn(() => INFERENCE_URL);
global.URL.revokeObjectURL = vi.fn(() => {});

const TestComponent: React.FC<{}> = () => {
  const apiInfo: ApiInfo = {
    endpoint: 'http://localhost/predict',
    key: '',
    secret: '',
  };
  const file = new File(['mocked content'], 'mock.png', { type: 'image/png' });

  return (
    <InferenceContext.Provider value={apiInfo}>
      <InferenceResult image={file} />
    </InferenceContext.Provider>
  );
};

const mockFetchResult = (result: InferenceResultType) => {
  const mockedFetch = vi.fn(() => {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(result),
      text: () => Promise.resolve(JSON.stringify(result)),
    });
  });
  // @ts-ignore simple mock fetch for this test need, no need to be too precise
  global.fetch = mockedFetch;
};

it('InferenceResult - basic rendering for bounding boxes', async () => {
  mockFetchResult({
    backbonepredictions: {
      'mocked-uuid': {
        coordinates: { xmin: 100, ymin: 100, xmax: 200, ymax: 200 },
        labelIndex: 1,
        labelName: 'test-label-1',
        score: 0.97,
      },
    },
    predictions: {
      labelIndex: 1,
      labelName: 'NG',
      score: 0.98,
    }
  });

  render(<TestComponent />);
  await screen.findByText('Total: 1 objects detected');
  await screen.findByText('Number of test-label-1');
  expect(screen.queryByText(/Class: .*/)).toBeNull();
});

it('InferenceResult - basic rendering for classification', async () => {
  mockFetchResult({
    backbonepredictions: null,
    predictions: {
      labelIndex: 1,
      labelName: 'Dog',
      score: 0.98,
    }
  });
  render(<TestComponent />);
  await screen.findByText('Class: Dog');
  expect(screen.queryByText(/Total: \d+ objects detected/)).toBeNull();
  expect(screen.queryByText(/Number of .*/)).toBeNull();
});
