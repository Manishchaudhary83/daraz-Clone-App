
import React from 'react';
import { Product, Category, OrderStatus, Order } from './types';

export const COLORS = {
  PRIMARY: '#F85606', // Daraz Orange
  NAVY: '#002F6C',
  BG_GRAY: '#F5F5F5',
};

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Electronic Devices', icon: '📱', subCategories: ['Smartphones', 'Feature Phones', 'Tablets', 'Laptops', 'Desktops'] },
  { id: '2', name: 'Electronic Accessories', icon: '🎧', subCategories: ['Mobile Accessories', 'Audio', 'Wearable', 'Console Accessories'] },
  { id: '3', name: 'TV & Home Appliances', icon: '📺', subCategories: ['Televisions', 'Home Audio', 'Kitchen Appliances', 'Cooling & Heating'] },
  { id: '4', name: 'Health & Beauty', icon: '💄', subCategories: ['Skin Care', 'Hair Care', 'Makeup', 'Personal Care'] },
  { id: '5', name: 'Babies & Toys', icon: '🧸', subCategories: ['Diaping', 'Baby Gear', 'Baby Personal Care', 'Toys & Games'] },
  { id: '6', name: 'Groceries & Pets', icon: '🥚', subCategories: ['Beverages', 'Breakfast', 'Cooking Essentials', 'Pet Care'] },
  { id: '7', name: 'Home & Lifestyle', icon: '🏠', subCategories: ['Bedding', 'Bath', 'Furniture', 'Kitchen & Dining'] },
  { id: '8', name: 'Women\'s Fashion', icon: '👗', subCategories: ['Clothing', 'Shoes', 'Accessories', 'Bags'] },
  { id: '9', name: "Men's Fashion", icon: '👔', subCategories: ['Clothing', 'Shoes', 'Accessories', 'Bags'] },
];

/**
 * ENTERPRISE BRANDED IMAGE POOL
 * Each key maps to a prefix in the generator to ensure high visual relevance.
 */
const BRANDED_IMAGE_POOL: Record<string, string[]> = {
  'iPhone': [
    'https://images.unsplash.com/photo-1696446701796-da61225697cc',
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569',
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba3f21'
  ],
  'Samsung Galaxy': [
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf',
    'https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00',
    'https://images.unsplash.com/photo-1583573636246-18cb2246697f'
  ],
  'Xiaomi': [
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97',
    'https://images.unsplash.com/photo-1598327105854-c8674f10ec8c',
    'https://images.unsplash.com/photo-1565849906663-bd443e0c5113'
  ],
  'MacBook Pro': [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853'
  ],
  'Dell XPS': [
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853'
  ],
  'iPad Air': [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0',
    'https://images.unsplash.com/photo-1542751110-97427bbecf20',
    'https://images.unsplash.com/photo-1550029330-8dbccaade873'
  ],
  'Sony Bravia': [
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1',
    'https://images.unsplash.com/photo-1552284169-281ce147858e',
    'https://images.unsplash.com/photo-1461151351821-79734f77ad01'
  ],
  'Samsung OLED': [
    'https://images.unsplash.com/photo-1593784991095-a205069470b6',
    'https://images.unsplash.com/photo-1509281373149-e957c6296406',
    'https://images.unsplash.com/photo-1558885544-2defc62e2e2b'
  ],
  'Sony Wireless': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944'
  ],
  'Apple Watch Ultra': [
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a',
    'https://images.unsplash.com/photo-1508685096489-77a46807e018',
    'https://images.unsplash.com/photo-1434493907317-a46b53b81846'
  ],
  'Anker Power': [
    'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5',
    'https://images.unsplash.com/photo-1625517431411-e67f90374421',
    'https://images.unsplash.com/photo-1622445272461-c6580cab8755'
  ],
  'L\'Oreal Revitalift': [
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908',
    'https://images.unsplash.com/photo-1556229174-5e42a09e45af'
  ],
  'Nike Air Max': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519'
  ],
  'Zara Summer': [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c'
  ],
  'Gucci Leather': [
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
    'https://images.unsplash.com/photo-1591561954557-26941169b79e'
  ],
  'Levi\'s 501': [
    'https://images.unsplash.com/photo-1542272604-787c3835535d',
    'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab',
    'https://images.unsplash.com/photo-1582552938357-32b906df40cb'
  ],
  'Nescafe Gold': [
    'https://images.unsplash.com/photo-1544434553-9415abc9ff3a',
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085'
  ],
  'Real Mixed Fruit': [
    'https://images.unsplash.com/photo-1622597467825-f3cbf7074125',
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd',
    'https://images.unsplash.com/photo-1523362628744-0c144574976d'
  ],
  'Pedigree Dog': [
    'https://images.unsplash.com/photo-1589923188900-85dae523342b',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e'
  ],
  'LEGO Technic': [
    'https://images.unsplash.com/photo-1533512930330-4ac257c86793',
    'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60',
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b'
  ],
  'Whirlpool Pro': [
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a',
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d',
    'https://images.unsplash.com/photo-1527385352018-3c26dd6c38e6'
  ],
  'IKEA Malm': [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36',
    'https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9'
  ],
  'Nespresso Virtuo': [
    'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6',
    'https://images.unsplash.com/photo-1520970014086-2208ef489380',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085'
  ]
};

const DEFAULT_CAT_POOL: Record<string, string[]> = {
  'Smartphones': ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48'],
  'Laptops': ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8'],
  'Clothing': ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b'],
  'Shoes': ['https://images.unsplash.com/photo-1560769629-975ec94e6a86', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'],
  'Beverages': ['https://images.unsplash.com/photo-1544434553-9415abc9ff3a', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd'],
  'Kitchen Appliances': ['https://images.unsplash.com/photo-1556910103-1c02745aae4d', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a'],
  'Furniture': ['https://images.unsplash.com/photo-1524758631624-e2822e304c36', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc'],
  'Toys & Games': ['https://images.unsplash.com/photo-1533512930330-4ac257c86793', 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b'],
};

/**
 * GENERATOR FOR 100+ UNIQUE PRODUCTS
 * Note: Products are ONLY generated if valid images are available in pools.
 */
const generateMockProducts = (): Product[] => {
  const products: Product[] = [];
  
  const categoryTemplates = [
    { cat: 'Electronic Devices', sub: ['Smartphones', 'Laptops', 'Tablets'], prefix: ['iPhone', 'Samsung Galaxy', 'Xiaomi', 'MacBook Pro', 'Dell XPS', 'iPad Air'] },
    { cat: 'TV & Home Appliances', sub: ['Televisions', 'Kitchen Appliances'], prefix: ['Sony Bravia', 'Samsung OLED', 'Whirlpool Pro'] },
    { cat: 'Electronic Accessories', sub: ['Audio', 'Wearable', 'Mobile Accessories'], prefix: ['Sony Wireless', 'Apple Watch Ultra', 'Anker Power'] },
    { cat: 'Health & Beauty', sub: ['Skin Care', 'Makeup', 'Hair Care'], prefix: ['L\'Oreal Revitalift'] },
    { cat: 'Women\'s Fashion', sub: ['Clothing', 'Shoes', 'Bags'], prefix: ['Zara Summer', 'Gucci Leather'] },
    { cat: 'Men\'s Fashion', sub: ['Clothing', 'Shoes', 'Accessories'], prefix: ['Nike Air Max', 'Levi\'s 501'] },
    { cat: 'Home & Lifestyle', sub: ['Furniture', 'Kitchen & Dining'], prefix: ['IKEA Malm', 'Nespresso Virtuo'] },
    { cat: 'Groceries & Pets', sub: ['Beverages', 'Breakfast', 'Cooking Essentials', 'Pet Care'], prefix: ['Nescafe Gold', 'Real Mixed Fruit', 'Pedigree Dog'] },
    { cat: 'Babies & Toys', sub: ['Toys & Games', 'Baby Gear'], prefix: ['LEGO Technic'] },
  ];

  let idCounter = 1;

  categoryTemplates.forEach((template) => {
    const productsPerCategory = 12;
    for (let i = 0; i < productsPerCategory; i++) {
      const subCat = template.sub[i % template.sub.length];
      const namePrefix = template.prefix[i % template.prefix.length];
      const basePrice = 150 + Math.floor(Math.random() * 20000);
      const discount = 5 + Math.floor(Math.random() * 30);
      const originalPrice = Math.floor(basePrice / (1 - discount / 100));

      // 1. Get Branded Pool
      let imageList = BRANDED_IMAGE_POOL[namePrefix] || [];
      
      // 2. Fallback to SubCat Pool or Category Pool
      if (imageList.length === 0) {
        imageList = DEFAULT_CAT_POOL[subCat] || DEFAULT_CAT_POOL[template.cat] || [];
      }

      // ARCHITECT REQUIREMENT: If no image found, delete (skip) that product
      if (imageList.length === 0) {
        continue;
      }

      // 3. Map to gallery with Unsplash optimization parameters
      const images = imageList.map((url, idx) => `${url}?auto=format&fit=crop&q=80&w=800&h=800&sig=${idCounter}_${idx}`);
      
      // Ensure we have at least 3 images by repeating with unique signatures
      while (images.length < 3) {
        images.push(`${images[0]}&variation=${images.length}`);
      }

      products.push({
        id: `gen-${idCounter++}`,
        name: `${namePrefix} - ${subCat} Series ${i + 1}`,
        price: template.cat === 'Groceries & Pets' ? (150 + Math.floor(Math.random() * 1500)) : basePrice,
        originalPrice: template.cat === 'Groceries & Pets' ? (200 + Math.floor(Math.random() * 2000)) : originalPrice,
        discountPercentage: discount,
        rating: 3.5 + Math.random() * 1.5,
        reviewsCount: Math.floor(Math.random() * 500),
        image: images[0],
        images: images,
        isDarazMall: Math.random() > 0.8,
        freeShipping: Math.random() > 0.7,
        category: template.cat,
        subCategory: subCat,
        stock: 10 + Math.floor(Math.random() * 200),
        sellerId: `seller-${(i % 5) + 1}`
      });
    }
  });

  // Flagship items check
  const iphoneImages = BRANDED_IMAGE_POOL['iPhone'];
  if (iphoneImages && iphoneImages.length > 0) {
    const flagshipImages1 = iphoneImages.map(url => `${url}?auto=format&fit=crop&q=80&w=800&h=800&sig=flagship1`);
    products.unshift({
      id: 'p-special-1',
      name: 'Apple iPhone 15 Pro Max - Titanium Black (256GB)',
      price: 184500,
      originalPrice: 199999,
      discountPercentage: 8,
      rating: 4.8,
      reviewsCount: 156,
      image: flagshipImages1[0],
      images: flagshipImages1,
      isDarazMall: true,
      freeShipping: true,
      category: 'Electronic Devices',
      subCategory: 'Smartphones',
      stock: 24,
      sellerId: 's1'
    });
  }

  return products;
};

export const MOCK_PRODUCTS: Product[] = generateMockProducts();

export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-1001', customerName: 'Ramesh Thapa', products: [{ productId: 'gen-1', quantity: 1, price: 184500 }], totalAmount: 184500, status: OrderStatus.READY_TO_SHIP, createdAt: '2023-11-20T10:30:00Z', paymentMethod: 'eSewa' },
];
