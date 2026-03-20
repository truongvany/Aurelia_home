const WISHLIST_STORAGE_KEY = 'aurelia_wishlist_product_ids';
const WISHLIST_UPDATED_EVENT = 'aurelia:wishlist-updated';

const normalizeIds = (ids: unknown): string[] => {
  if (!Array.isArray(ids)) {
    return [];
  }

  return ids.filter((id): id is string => typeof id === 'string' && id.length > 0);
};

export const getWishlistProductIds = (): string[] => {
  const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return normalizeIds(parsed);
  } catch {
    return [];
  }
};

const saveWishlistProductIds = (productIds: string[]) => {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(productIds));
  window.dispatchEvent(new Event(WISHLIST_UPDATED_EVENT));
};

export const setWishlistProductIds = (productIds: string[]) => {
  const normalized = normalizeIds(productIds);
  saveWishlistProductIds(normalized);
};

export const isProductWishlisted = (productId: string) => getWishlistProductIds().includes(productId);

export const toggleWishlistProduct = (productId: string) => {
  const current = getWishlistProductIds();
  const exists = current.includes(productId);
  const next = exists ? current.filter((id) => id !== productId) : [productId, ...current];
  saveWishlistProductIds(next);
  return !exists;
};

export const getWishlistUpdatedEventName = () => WISHLIST_UPDATED_EVENT;