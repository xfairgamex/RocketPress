import { getSkuMapping, addSkuMapping, clearSkuMappings } from './skuMapper';

describe('skuMapper', () => {
  const shop = 'shop1.myshopify.com';

  beforeEach(() => {
    clearSkuMappings();
    addSkuMapping(shop, 'SKU1', {
      artworkFile: 'designs/sku1.png',
      blankSku: 'BLANK1',
    });
  });

  test('returns mapping for known SKU', () => {
    const mapping = getSkuMapping(shop, 'SKU1');
    expect(mapping).toEqual({
      artworkFile: 'designs/sku1.png',
      blankSku: 'BLANK1',
    });
  });

  test('returns undefined for unknown SKU', () => {
    const mapping = getSkuMapping(shop, 'UNKNOWN');
    expect(mapping).toBeUndefined();
  });

  test('maintains separate mappings per shop', () => {
    addSkuMapping('shop2.myshopify.com', 'SKU1', {
      artworkFile: 'designs/sku1_alt.png',
      blankSku: 'BLANK2',
    });

    expect(getSkuMapping(shop, 'SKU1')).toEqual({
      artworkFile: 'designs/sku1.png',
      blankSku: 'BLANK1',
    });
    expect(getSkuMapping('shop2.myshopify.com', 'SKU1')).toEqual({
      artworkFile: 'designs/sku1_alt.png',
      blankSku: 'BLANK2',
    });
  });
});
