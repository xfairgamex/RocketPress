export interface SkuMapping {
  artworkFile: string;
  blankSku: string;
}

const mappings: Record<string, SkuMapping> = {
  SKU1: { artworkFile: 'designs/sku1.png', blankSku: 'BLANK1' },
  SKU2: { artworkFile: 'designs/sku2.png', blankSku: 'BLANK2' },
};

export function getSkuMapping(sku: string): SkuMapping | undefined {
  return mappings[sku];
}

export function addSkuMapping(sku: string, mapping: SkuMapping) {
  mappings[sku] = mapping;
}

export function clearSkuMappings() {
  for (const key of Object.keys(mappings)) {
    delete mappings[key];
  }
}

export default mappings;
