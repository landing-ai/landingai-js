import { countBy } from '../lib/utils/mathUtils';

it('counts by key correctly', () => {
  expect(
    countBy([{ name: 'Alice', sex: 'female' }, { name: 'Bob', sex: 'male' }, { name: 'Choe', sex: 'female' }], 'sex'),
  ).toEqual({ female: 2, male: 1 });
});
