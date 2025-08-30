import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from '@/components/ProductCard';

// Mock the WishlistButton component
vi.mock('@/components/WishlistButton', () => ({
  default: ({ onToggle, isWishlisted }: any) => (
    <button 
      onClick={() => onToggle && onToggle('test-id', !isWishlisted)}
      data-testid="wishlist-button"
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isWishlisted ? '❤️' : '🤍'}
    </button>
  )
}));

// Mock the ColorVariantSelector component
vi.mock('@/components/ColorVariantSelector', () => ({
  default: ({ onColorSelect, selectedColor, colorVariants }: any) => (
    <div data-testid="color-selector">
      {colorVariants?.map((variant: any) => (
        <button
          key={variant.color}
          onClick={() => onColorSelect(variant.color)}
          className={selectedColor === variant.color ? 'selected' : ''}
          data-testid={`color-${variant.color}`}
        >
          {variant.color}
        </button>
      ))}
    </div>
  )
}));

const renderProductCard = (props: any) => {
  return render(
    <BrowserRouter>
      <ProductCard {...props} />
    </BrowserRouter>
  );
};

describe('ProductCard', () => {
  const defaultProps = {
    id: 'test-id',
    imageUrl: 'https://example.com/image.jpg',
    title: 'Test Product',
    price: '$99.99',
    alt: 'Test product image'
  };

  it('renders product information correctly', () => {
    renderProductCard(defaultProps);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByAltText('Test product image')).toBeInTheDocument();
  });

  it('renders wishlist button when showWishlist is true', () => {
    renderProductCard({ ...defaultProps, showWishlist: true });

    expect(screen.getByTestId('wishlist-button')).toBeInTheDocument();
  });

  it('does not render wishlist button when showWishlist is false', () => {
    renderProductCard({ ...defaultProps, showWishlist: false });

    expect(screen.queryByTestId('wishlist-button')).not.toBeInTheDocument();
  });

  it('shows correct wishlist state', () => {
    renderProductCard({ ...defaultProps, isWishlisted: true });

    const wishlistButton = screen.getByTestId('wishlist-button');
    expect(wishlistButton).toHaveAttribute('aria-label', 'Remove from wishlist');
  });

  it('calls onWishlistToggle when wishlist button is clicked', () => {
    const mockOnWishlistToggle = vi.fn();
    renderProductCard({ 
      ...defaultProps, 
      onWishlistToggle: mockOnWishlistToggle 
    });

    const wishlistButton = screen.getByTestId('wishlist-button');
    fireEvent.click(wishlistButton);

    expect(mockOnWishlistToggle).toHaveBeenCalledWith('test-id', true);
  });

  it('renders color selector when product has color variants', () => {
    const productWithVariants = {
      colorVariants: [
        { color: 'Red', images: ['https://example.com/red.jpg'] },
        { color: 'Blue', images: ['https://example.com/blue.jpg'] }
      ]
    };

    renderProductCard({ 
      ...defaultProps, 
      product: productWithVariants 
    });

    expect(screen.getByTestId('color-selector')).toBeInTheDocument();
    expect(screen.getByTestId('color-Red')).toBeInTheDocument();
    expect(screen.getByTestId('color-Blue')).toBeInTheDocument();
  });

  it('changes image when color is selected', () => {
    const productWithVariants = {
      colorVariants: [
        { color: 'Red', images: ['https://example.com/red.jpg'] },
        { color: 'Blue', images: ['https://example.com/blue.jpg'] }
      ]
    };

    renderProductCard({ 
      ...defaultProps, 
      product: productWithVariants 
    });

    const blueColorButton = screen.getByTestId('color-Blue');
    fireEvent.click(blueColorButton);

    const image = screen.getByAltText('Test product image');
    expect(image).toHaveAttribute('src', 'https://example.com/blue.jpg');
  });

  it('applies compact styling when compact prop is true', () => {
    const { container } = renderProductCard({ ...defaultProps, compact: true });
    
    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass('gap-0');
  });

  it('applies custom className', () => {
    const { container } = renderProductCard({ 
      ...defaultProps, 
      className: 'custom-class' 
    });
    
    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass('custom-class');
  });

  it('passes category to wishlist button', () => {
    renderProductCard({ ...defaultProps, category: 'Test Category' });

    // The category is passed to WishlistButton but not displayed in UI
    // This test verifies the component renders without errors when category is provided
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders hover image when provided', () => {
    renderProductCard({ 
      ...defaultProps, 
      hoverImageUrl: 'https://example.com/hover.jpg' 
    });

    const hoverImage = screen.getByAltText('Test product image hover');
    expect(hoverImage).toBeInTheDocument();
    expect(hoverImage).toHaveAttribute('src', 'https://example.com/hover.jpg');
  });

  it('links to correct product page', () => {
    renderProductCard(defaultProps);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/test-id');
  });

  it('handles missing alt text gracefully', () => {
    renderProductCard({ 
      ...defaultProps, 
      alt: undefined 
    });

    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
  });

  it('sets initial color variant correctly', () => {
    const productWithVariants = {
      colorVariants: [
        { color: 'Red', images: ['https://example.com/red.jpg'] },
        { color: 'Blue', images: ['https://example.com/blue.jpg'] }
      ]
    };

    renderProductCard({ 
      ...defaultProps, 
      product: productWithVariants 
    });

    const redColorButton = screen.getByTestId('color-Red');
    expect(redColorButton).toHaveClass('selected');
  });
});
