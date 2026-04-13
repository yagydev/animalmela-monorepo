/** Livestock listing extensions stored in MarketplaceListing.specifications (+ category livestock). */

export type AnimalType = 'cow' | 'buffalo' | 'goat' | 'sheep' | 'poultry' | 'other';
export type SellerType = 'farmer' | 'trader';

export interface LivestockSpecifications {
  animalType?: AnimalType | string;
  breed?: string;
  ageYears?: number;
  ageMonths?: number;
  lactationStatus?: string;
  milkYieldPerDay?: number;
  pregnant?: boolean;
  healthSummary?: string;
  vaccinationSummary?: string;
  sellerType?: SellerType | string;
  videoUrl?: string;
  negotiable?: boolean;
  /** Listing-level trust badge (manual / future verification pipeline). */
  verifiedListing?: boolean;
  lat?: number;
  lng?: number;
  city?: string;
  state?: string;
}

export const ANIMAL_TYPES: { id: AnimalType; label: string; emoji: string }[] = [
  { id: 'cow', label: 'Cow', emoji: '🐄' },
  { id: 'buffalo', label: 'Buffalo', emoji: '🐃' },
  { id: 'goat', label: 'Goat', emoji: '🐐' },
  { id: 'sheep', label: 'Sheep', emoji: '🐑' },
  { id: 'poultry', label: 'Poultry', emoji: '🐔' },
  { id: 'other', label: 'Other', emoji: '🐾' }
];

/** Controlled vocabulary for breed autocomplete (MVP). */
export const BREEDS_BY_TYPE: Record<string, string[]> = {
  cow: ['Sahiwal', 'Gir', 'Red Sindhi', 'Tharparkar', 'Rathi', 'Ongole', 'Kankrej', 'Jersey cross', 'HF cross', 'Desi'],
  buffalo: ['Murrah', 'Jaffarabadi', 'Bhadawari', 'Nili-Ravi', 'Pandharpuri', 'Surti', 'Mehsana'],
  goat: ['Boer cross', 'Jamnapari', 'Beetal', 'Barbari', 'Sirohi', 'Black Bengal', 'Totapuri'],
  sheep: ['Marwari', 'Magra', 'Nali', 'Pugal', 'Muzaffarnagri', 'Deccani'],
  poultry: ['Kadaknath', 'Aseel', 'Rhode Island Red', 'Broiler Cobb', 'Layer hybrid'],
  other: []
};

export function parseLivestockSpec(raw: unknown): LivestockSpecifications {
  if (!raw || typeof raw !== 'object') return {};
  return raw as LivestockSpecifications;
}

export function priceInsightLabel(
  price: number,
  avg: number | null,
  sampleSize: number
): { label: string; tone: 'neutral' | 'good' | 'high' } {
  if (avg == null || sampleSize < 2) {
    return { label: 'Not enough similar listings nearby to compare price.', tone: 'neutral' };
  }
  const ratio = price / avg;
  if (ratio <= 0.92) return { label: 'Priced below typical range for this breed — could be a good deal.', tone: 'good' };
  if (ratio >= 1.12) return { label: 'Priced above typical range — confirm quality and papers with the seller.', tone: 'high' };
  return { label: 'Close to typical asking price for similar animals.', tone: 'neutral' };
}
