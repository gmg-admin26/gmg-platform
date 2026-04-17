// =============================================================================
// LOCKED DATA CONTRACT — Collections product catalog
// Do NOT reassign images from one product to another.
// Each product's primaryImage/hoverImage must refer ONLY to that product's assets.
// If an image file is missing, leave the path as-is — ProductCard handles
// broken images gracefully with a safe placeholder state.
// Never substitute one product's image path for another product.
// Image base path: /images/collections/{collection-name}/
// =============================================================================

export interface Product {
  title: string;
  price: string;
  status: string;
  primaryImage: string;
  hoverImage?: string;
  bg?: string;
  fit?: 'cover' | 'contain';
}

export const troubleAndrewProducts: Product[] = [
  {
    title: 'Tour Art Cardigan',
    price: '$220',
    status: 'Pre-Order',
    primaryImage: '/images/collections/trouble-andrew/tour-art-cardigan-primary.png',
    hoverImage: '/images/collections/trouble-andrew/tour-art-cardigan-hover.png',
    bg: 'bg-neutral-100',
    fit: 'cover',
  },
  {
    title: 'Music Man A&R Shirt',
    price: '$78',
    status: 'Pre-Order',
    primaryImage: '/images/collections/trouble-andrew/music-man-ar-shirt-primary.png',
    hoverImage: '/images/collections/trouble-andrew/music-man-ar-shirt-hover.png',
    bg: 'bg-neutral-100',
    fit: 'cover',
  },
  {
    title: 'Luv Music Heart Monogram Track Pant',
    price: '$120',
    status: 'Pre-Order',
    primaryImage: '/images/collections/trouble-andrew/heart-monogram-track-pant-primary.png',
    hoverImage: '/images/collections/trouble-andrew/heart-monogram-track-pant-hover.png',
    bg: 'bg-neutral-100',
    fit: 'cover',
  },
  {
    title: 'Pop Star Workit Set',
    price: '$180',
    status: 'Pre-Order',
    primaryImage: '/images/collections/trouble-andrew/pop-star-workit-set-primary.png',
    hoverImage: '/images/collections/trouble-andrew/pop-star-workit-set-hover.png',
    bg: 'bg-neutral-100',
    fit: 'cover',
  },
  {
    title: 'Tour Art Puffer',
    price: '$160',
    status: 'Pre-Order',
    primaryImage: '/images/collections/trouble-andrew/hero-primary.png',
    hoverImage: '/images/collections/trouble-andrew/hero-hover.png',
    bg: 'bg-neutral-100',
    fit: 'cover',
  },
  {
    title: 'Skull Records Long Sleeve',
    price: '$75',
    status: 'Pre-Order',
    primaryImage: '/images/collections/trouble-andrew/Screenshot_2026-03-14_at_1.04.35_PM.png',
    hoverImage: '/images/collections/trouble-andrew/Screenshot_2026-03-14_at_1.04.52_PM.png',
    bg: 'bg-neutral-100',
    fit: 'cover',
  },
];

export const accessoriesProducts: Product[] = [
  {
    title: 'Arctic Fox x Tour Collection',
    price: '',
    status: 'SOLD OUT',
    primaryImage: '/images/collections/accessories/arctic-fox-tour-collection-primary.png',
    hoverImage: '/images/collections/accessories/arctic-fox-tour-collection-hover.jpg',
    bg: 'bg-zinc-50',
    fit: 'contain',
  },
  {
    title: 'Arctic Fox x Tour Art Scrunchie Collection',
    price: '$25',
    status: 'SOLD OUT',
    primaryImage: '/images/collections/accessories/arctic-fox-scrunchie-set-primary.png',
    bg: 'bg-zinc-50',
    fit: 'contain',
  },
  {
    title: 'Arctic Fox Artist Feature',
    price: '',
    status: 'Featured',
    primaryImage: '/images/collections/accessories/arctic-fox-artist-feature-primary.png',
    bg: 'bg-zinc-50',
    fit: 'cover',
  },
  {
    title: 'DD Crew Cap',
    price: '$45',
    status: 'Pre-Order',
    primaryImage: '/images/collections/accessories/dd-crew-cap-primary.png',
    hoverImage: '/images/collections/accessories/dd-crew-cap-hover.png',
    bg: 'bg-zinc-100',
    fit: 'cover',
  },
  {
    title: 'Tour Art Crossbody Crew Bag',
    price: '$65',
    status: 'Pre-Order',
    primaryImage: '/images/collections/accessories/tour-art-crossbody-crew-bag-primary.png',
    hoverImage: '/images/collections/accessories/tour-art-crossbody-crew-bag-hover.png',
    bg: 'bg-zinc-100',
    fit: 'cover',
  },
  {
    title: 'Tour Art Hip Bag',
    price: '$55',
    status: 'Pre-Order',
    primaryImage: '/images/collections/accessories/tour-art-hip-bag-primary.png',
    hoverImage: '/images/collections/accessories/tour-art-hip-bag-hover.png',
    bg: 'bg-white',
    fit: 'cover',
  },
  {
    title: 'Tour Art Luv Crew Bag',
    price: '$75',
    status: 'Pre-Order',
    primaryImage: '/images/collections/accessories/tour-art-luv-crew-bag-primary.png',
    hoverImage: '/images/collections/accessories/tour-art-luv-crew-bag-hover.png',
    bg: 'bg-zinc-900',
    fit: 'cover',
  },
];

export const gpsBrandProducts: Product[] = [
  {
    title: 'WOW Hoodie',
    price: '$80',
    status: 'Pre-Order',
    primaryImage: '/images/collections/gps-brand/wow-hoodie-primary.png',
    hoverImage: '/images/collections/gps-brand/wow-hoodie-hover.png',
    bg: 'bg-neutral-200',
    fit: 'cover',
  },
];

export const artistDropsProducts: Product[] = [];
