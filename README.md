# OpenFoodFacts Explorer

A modern, responsive web application for exploring and discovering food products from the OpenFoodFacts database.

## Features

### 1. Homepage
- **Product List Display**: Browse a comprehensive list of food products from the OpenFoodFacts API
- **Product Cards**: Each product shows:
  - Product name and brand
  - Product image
  - Category tags
  - Ingredients preview
  - Nutrition Grade (A-E) with color coding
- **Pagination**: Navigate through products with Previous/Next buttons

### 2. Search Functionality
- **Dual Search Modes**:
  - Search by product name
  - Search by barcode
- **Real-time Results**: Instant search results with loading states
- **Search Type Toggle**: Easy switching between name and barcode search

### 3. Category Filter
- **Dynamic Categories**: Dropdown filter populated from OpenFoodFacts API
- **Category Count**: Shows number of products in each category
- **Filter Integration**: Works seamlessly with sorting functionality

### 4. Sort Functionality
Sort products by:
- **Popularity** (unique scans)
- **Product Name** (A-Z)
- **Nutrition Grade** (A-E)
- **Sort Order Toggle**: Ascending/descending with visual indicator

### 5. Product Detail Page
Comprehensive product information including:
- **Main Info**: Name, brand, barcode, categories
- **Full Ingredients List**: Complete ingredient information
- **Nutritional Values**: Detailed nutrition facts per 100g
  - Energy (kJ and kcal)
  - Fat, Saturated Fat
  - Carbohydrates, Sugars
  - Fiber, Proteins
  - Salt, Sodium
- **Labels**: Vegan, gluten-free, organic, etc.
- **Allergens**: Clear allergen information
- **Additional Images**: Ingredient and nutrition label photos
- **Favorite Feature**: Save products to favorites

### 6. Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Responsive Grid**: Adaptive layout (1-4 columns based on screen size)
- **Touch-Friendly**: Large tap targets and smooth interactions
- **Dark Mode Support**: Automatic dark mode based on system preference

## Technical Implementation

### State Management
- **Redux Toolkit**: Centralized state management
- **Redux Slices**:
  - `homeSlice`: Homepage products and pagination
  - `searchSlice`: Search results, categories, filters
  - `productSlice`: Product details, favorites, recently viewed

### Caching
- **In-Memory Cache**: Reduces API calls and improves performance
- **TTL-Based**: Different cache durations for different data types
  - Products: 5 minutes
  - Product details: 15 minutes
  - Categories: 1 hour
- **Smart Cache Keys**: Context-aware caching for searches and filters

### Performance Features
- **Lazy Loading**: Images load on demand
- **Error Boundaries**: Graceful error handling
- **Loading States**: Clear feedback during data fetching
- **Optimized Re-renders**: Memoized selectors and callbacks

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
  ├── page.tsx                 # Homepage
  ├── layout.tsx               # Root layout with Redux provider
  ├── product/[barcode]/
  │   └── page.tsx            # Product detail page
  └── api/                    # API routes
      ├── home/
      ├── product/
      └── search/
components/
  ├── ProductCard.tsx         # Product card component
  ├── SearchBar.tsx           # Search input with type toggle
  ├── CategoryFilter.tsx      # Category dropdown filter
  ├── SortControl.tsx         # Sort by dropdown
  ├── LoadingSpinner.tsx      # Loading indicator
  └── ReduxProvider.tsx       # Redux store provider
store/
  ├── store.ts               # Redux store configuration
  └── slices/
      ├── homeSlice.ts       # Home state and actions
      ├── searchSlice.ts     # Search state and actions
      └── productSlice.ts    # Product state and actions
lib/
  ├── axios.ts               # Axios configuration
  └── cache.ts               # API caching utility
```

## API Endpoints

- `/api/home?page={n}` - Get paginated products
- `/api/product?barcode={code}` - Get product by barcode
- `/api/search/name?searchTerm={term}` - Search by name
- `/api/search/barcode?barcode={code}` - Search by barcode
- `/api/search/category?category={cat}&sortBy={field}&order={dir}` - Filter by category
- `/api/search/category-all` - Get all categories

## Features in Action

### Navigation Flow
1. Browse products on homepage
2. Use search/filters to narrow results
3. Click product card to view details
4. Add to favorites
5. Return to browse more products

### Responsive Breakpoints
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
- Large Desktop: 4 columns

## Future Enhancements

- Infinite scroll option
- Advanced filters (price range, stores)
- User accounts and persistent favorites
- Product comparison feature
- Shopping list functionality
- Nutritional recommendations
- Multi-language support

## License

MIT

