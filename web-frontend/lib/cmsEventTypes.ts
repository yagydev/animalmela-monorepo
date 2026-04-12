export type CmsEventListItem = {
  _id?: string;
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  date?: string;
  endDate?: string;
  featured?: boolean;
  location?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  image?: {
    url?: string;
    alt?: string;
  };
  status?: string;
  tags?: string[];
  melaMeta?: {
    mandi?: string;
    month?: string;
    focusType?: string;
    visitors?: number;
    isRecurring?: boolean;
    listingStatus?: string;
    source?: string;
  };
};
