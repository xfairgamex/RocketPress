export interface SkuMapping {
  artworkFile: string;
  blankSku: string;
}

// mappings are stored per shop to support multi-store setups
const mappings: Record<string, Record<string, SkuMapping>> = {};

export function getSkuMapping(
  shop: string,
  sku: string
): SkuMapping | undefined {
  return mappings[shop]?.[sku];
}

export function addSkuMapping(
  shop: string,
  sku: string,
  mapping: SkuMapping
) {
  if (!mappings[shop]) {
    mappings[shop] = {};
  }
  mappings[shop][sku] = mapping;
}

export function clearSkuMappings(shop?: string) {
  if (shop) {
    delete mappings[shop];
  } else {
    for (const key of Object.keys(mappings)) {
      delete mappings[key];
    }
  }
}

export default mappings;
