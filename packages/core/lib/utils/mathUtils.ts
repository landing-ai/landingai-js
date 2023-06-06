/**
 * Count object array by a field.
 * 
 * E.g. 
 * ```
 * countBy([{name: 'Alice', sex: 'female'}, {name: 'Bob', sex: 'male'}, {name: 'Choe', sex: 'female'}], 'sex')
 * // returns { female: 2, male: 1 }
 * ```
 */
export const countBy = (arr: any[], key: string): Record<string, number> => {
  return arr.reduce((res, item) => {
    if (key in item) {
      const value = item[key];
      if (!(value in res)) {
        res[value] = 0;
      }
      res[value]++;
    }
    return res;
  }, {} as Record<string, number>);
};