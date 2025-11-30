import { Product } from './cart-context';

export const tojiProduct: Product = {
  id: 'toji-sweatpants',
  name: 'Toji Sweatpants',
  price: 250,
  originalPrice: 320,
  image: '/34.jpeg',
  description: 'Premium streetwear comfort meets Islamic modesty. The ultimate sweatpants designed for brothers who value both style and faith.\n\n• High-quality cotton blend for maximum comfort\n• Loose fit that adheres to Islamic guidelines\n• Elastic waistband with drawstring\n• Deep side pockets for practicality\n• Ribbed ankle cuffs for modern style\n• Perfect for prayer, gym, or everyday wear',
  sizes: ['S', 'M', 'L', 'XL', 'XXL']
};

export const tojiProductFeatures = [
  {
    title: 'Premium Cotton Blend',
    description: 'Crafted from high-quality cotton blend fabric for ultimate softness and breathability.'
  },
  {
    title: 'Modest Design',
    description: 'Loose, comfortable fit that maintains Islamic modesty standards while looking stylish.'
  },
  {
    title: 'All-Day Comfort',
    description: 'Soft, stretchy material perfect for prayer, workout, or lounging at home.'
  },
  {
    title: 'Moroccan Craftsmanship',
    description: 'Designed and crafted by Moroccan brothers with attention to detail and quality.'
  },
  {
    title: 'Functional Pockets',
    description: 'Deep side pockets provide secure storage for your essentials.'
  },
  {
    title: 'Durable Construction',
    description: 'Reinforced stitching and quality materials ensure long-lasting wear.'
  }
];

export const tojiReviews = [
  {
    id: '1',
    name: 'Mohamed K.',
    rating: 5,
    date: '2025-10-15',
    comment: 'Macha Allah! Perfect for prayer and everyday wear. Very comfortable and modest. Highly recommend!'
  },
  {
    id: '2',
    name: 'Youssef A.',
    rating: 5,
    date: '2025-10-10',
    comment: 'Best sweatpants I ever bought. الجودة ممتازة والسعر مناسب. جزاكم الله خيرا'
  },
  {
    id: '3',
    name: 'Ibrahim B.',
    rating: 5,
    date: '2025-10-05',
    comment: 'Finally, modest streetwear that doesn\'t compromise on style. The fit is perfect and fabric quality is top-notch!'
  },
  {
    id: '4',
    name: 'Omar L.',
    rating: 4,
    date: '2025-09-28',
    comment: 'Very good quality and comfortable. Would give 5 stars if they had more color options.'
  },
  {
    id: '5',
    name: 'Hamza M.',
    rating: 5,
    date: '2025-09-20',
    comment: 'Perfect for brothers who want comfort and modesty. Fits great and looks amazing. بارك الله فيكم'
  }
];
