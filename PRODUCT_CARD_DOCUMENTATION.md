# ProductCard Component Documentation

## Overview
The `ProductCard` component is a reusable, feature-rich card component designed for displaying product listings in the Farmers Market application. It provides image display, add-to-cart functionality, favorites management, and multiple display variants.

## Features

### ✅ **Core Functionality**
- **Image Display**: Shows product images with fallback placeholders
- **Add to Cart**: Integrated cart functionality with loading states
- **Favorites**: Heart icon for adding/removing favorites
- **View Details**: Eye icon for viewing product details
- **Price Formatting**: Indian Rupee formatting with proper currency display
- **Responsive Design**: Works on all screen sizes

### ✅ **Multiple Variants**
- **Default**: Standard card layout with full information
- **Compact**: Horizontal layout for lists and sidebars
- **Detailed**: Larger card with enhanced visual elements

### ✅ **Interactive Elements**
- **Hover Effects**: Image zoom and overlay actions
- **Loading States**: Button loading indicators
- **Disabled States**: Proper disabled styling
- **Badges**: Category and negotiable badges

## Installation & Usage

### 1. **Basic Import**
```typescript
import { ProductCard, useCart, useFavorites } from './ProductCard';
```

### 2. **Basic Usage**
```typescript
function ProductGrid({ products }) {
  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleAddToCart = async (listingId: string, quantity: number = 1) => {
    try {
      await addToCart(listingId, quantity);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleToggleFavorite = async (listingId: string) => {
    try {
      await toggleFavorite(listingId);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          listing={product}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          isInCart={isInCart(product._id)}
          isFavorite={isFavorite(product._id)}
          variant="default"
        />
      ))}
    </div>
  );
}
```

## Props Interface

```typescript
interface ProductCardProps {
  listing: {
    _id: string;
    title: string;
    description?: string;
    price: number;
    unit: string;
    quantity: number;
    category: string;
    images?: string[];
    sellerId?: {
      name: string;
      _id: string;
    };
    location?: {
      state: string;
      district?: string;
    };
    rating?: number;
    totalRatings?: number;
    negotiable?: boolean;
    minimumOrder?: number;
  };
  onAddToCart?: (listingId: string, quantity?: number) => Promise<void>;
  onViewDetails?: (listingId: string) => void;
  onToggleFavorite?: (listingId: string) => void;
  isInCart?: boolean;
  isFavorite?: boolean;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}
```

## Variants

### **Default Variant**
- **Layout**: Vertical card with image on top
- **Size**: Standard card dimensions
- **Use Case**: Main product grid, marketplace browsing
- **Features**: Full product information, all actions

```typescript
<ProductCard
  listing={product}
  variant="default"
  onAddToCart={handleAddToCart}
  onToggleFavorite={handleToggleFavorite}
  onViewDetails={handleViewDetails}
/>
```

### **Compact Variant**
- **Layout**: Horizontal layout with small image
- **Size**: Smaller, more condensed
- **Use Case**: Product lists, sidebars, related products
- **Features**: Essential information only

```typescript
<ProductCard
  listing={product}
  variant="compact"
  onAddToCart={handleAddToCart}
  onToggleFavorite={handleToggleFavorite}
/>
```

### **Detailed Variant**
- **Layout**: Larger card with enhanced visuals
- **Size**: Bigger image and more spacing
- **Use Case**: Featured products, product highlights
- **Features**: Enhanced visual elements, larger image

```typescript
<ProductCard
  listing={product}
  variant="detailed"
  onAddToCart={handleAddToCart}
  onToggleFavorite={handleToggleFavorite}
  onViewDetails={handleViewDetails}
/>
```

## Hooks

### **useCart Hook**
Manages cart state and operations:

```typescript
const { cartItems, addToCart, removeFromCart, isInCart } = useCart();

// Add item to cart
await addToCart('product-id', 2);

// Remove item from cart
await removeFromCart('product-id');

// Check if item is in cart
const inCart = isInCart('product-id');
```

### **useFavorites Hook**
Manages favorites state and operations:

```typescript
const { favorites, toggleFavorite, isFavorite } = useFavorites();

// Toggle favorite status
await toggleFavorite('product-id');

// Check if item is favorited
const favorited = isFavorite('product-id');
```

## Styling & Customization

### **CSS Classes**
The component uses Tailwind CSS classes and can be customized:

```typescript
<ProductCard
  listing={product}
  className="custom-card-class"
  variant="default"
/>
```

### **Custom Styling**
Override default styles by passing custom className:

```css
.custom-card-class {
  @apply shadow-lg border-2 border-green-200;
}

.custom-card-class:hover {
  @apply shadow-xl border-green-300;
}
```

## Image Handling

### **Image Sources**
- **Primary**: Uses `listing.images[0]` if available
- **Fallback**: Category-based placeholder images
- **Default**: Generic placeholder if no category match

### **Image Optimization**
- Uses Next.js `Image` component for optimization
- Responsive sizing based on variant
- Hover zoom effects on default and detailed variants

## Error Handling

### **Cart Operations**
```typescript
const handleAddToCart = async (listingId: string, quantity: number = 1) => {
  try {
    await addToCart(listingId, quantity);
    // Success handling
  } catch (error: any) {
    // Error handling
    console.error('Failed to add to cart:', error.message);
    // Show user-friendly error message
  }
};
```

### **Favorites Operations**
```typescript
const handleToggleFavorite = async (listingId: string) => {
  try {
    await toggleFavorite(listingId);
    // Success handling
  } catch (error: any) {
    // Error handling
    console.error('Failed to toggle favorite:', error.message);
    // Show user-friendly error message
  }
};
```

## Examples

### **Product Grid**
```typescript
function ProductGrid({ products }) {
  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          listing={product}
          onAddToCart={addToCart}
          onToggleFavorite={toggleFavorite}
          isInCart={isInCart(product._id)}
          isFavorite={isFavorite(product._id)}
          variant="default"
        />
      ))}
    </div>
  );
}
```

### **Compact Product List**
```typescript
function ProductList({ products }) {
  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          listing={product}
          onAddToCart={addToCart}
          onToggleFavorite={toggleFavorite}
          isInCart={isInCart(product._id)}
          isFavorite={isFavorite(product._id)}
          variant="compact"
        />
      ))}
    </div>
  );
}
```

### **Read-only Display**
```typescript
function ProductDisplay({ product }) {
  return (
    <ProductCard
      listing={product}
      showActions={false}
      variant="detailed"
    />
  );
}
```

## API Integration

### **Cart API Endpoints**
- `POST /api/farmers-market/cart` - Add item to cart
- `DELETE /api/farmers-market/cart` - Remove item from cart
- `GET /api/farmers-market/cart` - Get cart contents

### **Favorites API Endpoints**
- `POST /api/farmers-market/favorites` - Add to favorites
- `DELETE /api/farmers-market/favorites` - Remove from favorites
- `GET /api/farmers-market/favorites` - Get favorites list

## Best Practices

### **Performance**
- Use `React.memo` for expensive renders
- Implement proper loading states
- Optimize image loading

### **Accessibility**
- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility

### **User Experience**
- Clear loading indicators
- Proper error messages
- Responsive design
- Touch-friendly interactions

## Troubleshooting

### **Common Issues**

1. **Images not loading**
   - Check image URLs
   - Verify placeholder service
   - Check Next.js image configuration

2. **Cart operations failing**
   - Verify authentication token
   - Check API endpoint availability
   - Validate request payload

3. **Styling issues**
   - Check Tailwind CSS configuration
   - Verify className overrides
   - Check responsive breakpoints

### **Debug Mode**
Enable debug logging by setting environment variable:
```bash
NEXT_PUBLIC_DEBUG=true
```

## Migration Guide

### **From Old ProductCard**
1. Import new component and hooks
2. Update props structure
3. Implement new handlers
4. Test functionality

### **Breaking Changes**
- Props interface updated
- Hook-based state management
- New variant system
- Enhanced error handling

The ProductCard component provides a comprehensive, reusable solution for product display across the Farmers Market application with consistent styling, functionality, and user experience.
