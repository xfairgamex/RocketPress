import { getSkuMapping, addSkuMapping, clearSkuMappings } from './skuMapper';

describe('skuMapper', () => {
  beforeEach(() => {
    clearSkuMappings();
    addSkuMapping('SKU1', { artworkFile: 'designs/sku1.png', blankSku: 'BLANK1' });
  });

  test('returns mapping for known SKU', () => {
    const mapping = getSkuMapping('SKU1');
    expect(mapping).toEqual({ artworkFile: 'designs/sku1.png', blankSku: 'BLANK1' });
  });

  test('returns undefined for unknown SKU', () => {
    const mapping = getSkuMapping('UNKNOWN');
    expect(mapping).toBeUndefined();
  });
});
