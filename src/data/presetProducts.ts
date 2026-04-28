/**
 * presetProducts.ts
 * Curated catalog of common items found in supermarkets / corner shops / tuck shops.
 *
 * Names are generic on purpose (no brand IP). Each preset carries a typical unit
 * size to save the shop owner a step. The emoji is rasterised at add-time into a
 * PNG data URL so the poster treats it like any uploaded product photo — the
 * shop owner can always replace it with a real photograph later.
 */

export interface PresetProduct {
  name: string
  emoji: string
  unit: string
}

export interface PresetCategory {
  id: string
  label: string
  icon: string
  items: PresetProduct[]
}

export const PRESET_CATEGORIES: PresetCategory[] = [
  {
    id: 'bakery',
    label: 'Bakery',
    icon: '🍞',
    items: [
      { name: 'White Bread',        emoji: '🍞', unit: '700g' },
      { name: 'Brown Bread',        emoji: '🍞', unit: '700g' },
      { name: 'Whole Wheat Bread',  emoji: '🍞', unit: '700g' },
      { name: 'Bread Rolls',        emoji: '🥖', unit: '6-pack' },
      { name: 'Croissants',         emoji: '🥐', unit: '4-pack' },
      { name: 'Muffins',            emoji: '🧁', unit: '6-pack' },
      { name: 'Hot Dog Buns',       emoji: '🌭', unit: '6-pack' },
      { name: 'Burger Buns',        emoji: '🍔', unit: '6-pack' },
    ],
  },
  {
    id: 'dairy',
    label: 'Dairy & Eggs',
    icon: '🥛',
    items: [
      { name: 'Full Cream Milk',  emoji: '🥛', unit: '1L' },
      { name: 'Low Fat Milk',     emoji: '🥛', unit: '1L' },
      { name: 'Long-Life Milk',   emoji: '🥛', unit: '1L' },
      { name: 'Eggs',             emoji: '🥚', unit: 'Tray of 18' },
      { name: 'Eggs',             emoji: '🥚', unit: '6-pack' },
      { name: 'Cheese',           emoji: '🧀', unit: '250g' },
      { name: 'Butter',           emoji: '🧈', unit: '500g' },
      { name: 'Margarine',        emoji: '🧈', unit: '500g' },
      { name: 'Yoghurt',          emoji: '🥣', unit: '1kg' },
      { name: 'Cream',            emoji: '🥛', unit: '250ml' },
    ],
  },
  {
    id: 'meat',
    label: 'Meat & Poultry',
    icon: '🍗',
    items: [
      { name: 'Whole Chicken',    emoji: '🍗', unit: 'per kg' },
      { name: 'Chicken Breasts',  emoji: '🍗', unit: 'per kg' },
      { name: 'Chicken Drumsticks', emoji: '🍗', unit: 'per kg' },
      { name: 'Mince',            emoji: '🥩', unit: 'per kg' },
      { name: 'Beef Steak',       emoji: '🥩', unit: 'per kg' },
      { name: 'Stewing Beef',     emoji: '🥩', unit: 'per kg' },
      { name: 'Sausages',         emoji: '🌭', unit: '1kg' },
      { name: 'Bacon',            emoji: '🥓', unit: '200g' },
      { name: 'Pork Chops',       emoji: '🍖', unit: 'per kg' },
      { name: 'Lamb',             emoji: '🍖', unit: 'per kg' },
    ],
  },
  {
    id: 'produce',
    label: 'Fresh Produce',
    icon: '🥬',
    items: [
      { name: 'Bananas',     emoji: '🍌', unit: 'per kg' },
      { name: 'Apples',      emoji: '🍎', unit: 'per kg' },
      { name: 'Oranges',     emoji: '🍊', unit: 'per kg' },
      { name: 'Lemons',      emoji: '🍋', unit: 'per kg' },
      { name: 'Avocados',    emoji: '🥑', unit: 'each' },
      { name: 'Tomatoes',    emoji: '🍅', unit: 'per kg' },
      { name: 'Onions',      emoji: '🧅', unit: 'per kg' },
      { name: 'Potatoes',    emoji: '🥔', unit: '10kg bag' },
      { name: 'Carrots',     emoji: '🥕', unit: 'per kg' },
      { name: 'Lettuce',     emoji: '🥬', unit: 'each' },
      { name: 'Spinach',     emoji: '🥬', unit: 'bunch' },
      { name: 'Cucumber',    emoji: '🥒', unit: 'each' },
      { name: 'Bell Pepper', emoji: '🫑', unit: 'each' },
      { name: 'Garlic',      emoji: '🧄', unit: 'per kg' },
      { name: 'Mealies',     emoji: '🌽', unit: 'each' },
    ],
  },
  {
    id: 'pantry',
    label: 'Pantry & Staples',
    icon: '🌾',
    items: [
      { name: 'Maize Meal',     emoji: '🌽', unit: '10kg' },
      { name: 'Rice',           emoji: '🍚', unit: '2kg' },
      { name: 'Pasta',          emoji: '🍝', unit: '500g' },
      { name: 'Sugar',          emoji: '🍬', unit: '2.5kg' },
      { name: 'Salt',           emoji: '🧂', unit: '1kg' },
      { name: 'Cake Flour',     emoji: '🌾', unit: '2.5kg' },
      { name: 'Cooking Oil',    emoji: '🫗', unit: '2L' },
      { name: 'Vinegar',        emoji: '🫗', unit: '750ml' },
      { name: 'Tea Bags',       emoji: '🍵', unit: '100-pack' },
      { name: 'Instant Coffee', emoji: '☕', unit: '250g' },
      { name: 'Peanut Butter',  emoji: '🥜', unit: '400g' },
      { name: 'Jam',            emoji: '🫐', unit: '450g' },
      { name: 'Honey',          emoji: '🍯', unit: '500g' },
      { name: 'Mayonnaise',     emoji: '🥚', unit: '750g' },
      { name: 'Tomato Sauce',   emoji: '🍅', unit: '700ml' },
      { name: 'Soup Mix',       emoji: '🥣', unit: '50g' },
      { name: 'Tinned Tuna',    emoji: '🐟', unit: '170g' },
      { name: 'Tinned Beans',   emoji: '🫘', unit: '410g' },
    ],
  },
  {
    id: 'beverages',
    label: 'Beverages',
    icon: '🥤',
    items: [
      { name: 'Cola',          emoji: '🥤', unit: '2L' },
      { name: 'Lemon Soda',    emoji: '🥤', unit: '2L' },
      { name: 'Bottled Water', emoji: '💧', unit: '5L' },
      { name: 'Bottled Water', emoji: '💧', unit: '500ml' },
      { name: 'Orange Juice',  emoji: '🧃', unit: '1L' },
      { name: 'Iced Tea',      emoji: '🧋', unit: '1.5L' },
      { name: 'Energy Drink',  emoji: '⚡', unit: '500ml' },
      { name: 'Sports Drink',  emoji: '🥤', unit: '500ml' },
      { name: 'Beer',          emoji: '🍺', unit: '6-pack' },
      { name: 'Wine',          emoji: '🍷', unit: '750ml' },
    ],
  },
  {
    id: 'snacks',
    label: 'Snacks & Confectionery',
    icon: '🍫',
    items: [
      { name: 'Crisps',         emoji: '🥔', unit: 'large bag' },
      { name: 'Chocolate Bar',  emoji: '🍫', unit: '90g' },
      { name: 'Chocolate Slab', emoji: '🍫', unit: '150g' },
      { name: 'Biscuits',       emoji: '🍪', unit: '250g' },
      { name: 'Rusks',          emoji: '🍞', unit: '500g' },
      { name: 'Sweets',         emoji: '🍬', unit: 'mix bag' },
      { name: 'Popcorn',        emoji: '🍿', unit: 'kernel 1kg' },
      { name: 'Mixed Nuts',     emoji: '🥜', unit: '250g' },
      { name: 'Dried Fruit',    emoji: '🍇', unit: '250g' },
    ],
  },
  {
    id: 'frozen',
    label: 'Frozen',
    icon: '🧊',
    items: [
      { name: 'Frozen Chicken', emoji: '🍗', unit: '2kg bag' },
      { name: 'Frozen Veg Mix', emoji: '🥦', unit: '1kg' },
      { name: 'Frozen Peas',    emoji: '🫛', unit: '1kg' },
      { name: 'Frozen Chips',   emoji: '🍟', unit: '1kg' },
      { name: 'Ice Cream',      emoji: '🍦', unit: '2L tub' },
      { name: 'Frozen Pizza',   emoji: '🍕', unit: 'each' },
      { name: 'Frozen Fish',    emoji: '🐟', unit: '800g' },
    ],
  },
  {
    id: 'cleaning',
    label: 'Cleaning & Household',
    icon: '🧼',
    items: [
      { name: 'Dishwashing Liquid', emoji: '🧴', unit: '750ml' },
      { name: 'Washing Powder',     emoji: '🧺', unit: '2kg' },
      { name: 'Fabric Softener',    emoji: '🧴', unit: '2L' },
      { name: 'Bleach',             emoji: '🧴', unit: '1.5L' },
      { name: 'All-Purpose Cleaner', emoji: '🧴', unit: '750ml' },
      { name: 'Toilet Paper',       emoji: '🧻', unit: '9-pack' },
      { name: 'Paper Towels',       emoji: '🧻', unit: '3-pack' },
      { name: 'Bin Bags',           emoji: '🗑️', unit: '20-pack' },
      { name: 'Air Freshener',      emoji: '🌸', unit: '300ml' },
      { name: 'Matches',            emoji: '🔥', unit: '10-pack' },
      { name: 'Candles',            emoji: '🕯️', unit: '6-pack' },
    ],
  },
  {
    id: 'personal',
    label: 'Personal Care',
    icon: '🧴',
    items: [
      { name: 'Toothpaste',  emoji: '🪥', unit: '100ml' },
      { name: 'Toothbrush',  emoji: '🪥', unit: 'each' },
      { name: 'Bar Soap',    emoji: '🧼', unit: 'each' },
      { name: 'Shampoo',     emoji: '🧴', unit: '400ml' },
      { name: 'Body Wash',   emoji: '🧴', unit: '500ml' },
      { name: 'Deodorant',   emoji: '💨', unit: '150ml' },
      { name: 'Sanitary Pads', emoji: '🩸', unit: '10-pack' },
      { name: 'Razors',      emoji: '🪒', unit: '5-pack' },
      { name: 'Nappies',     emoji: '👶', unit: 'pack of 30' },
      { name: 'Baby Wipes',  emoji: '👶', unit: '80-pack' },
    ],
  },
]

/** Convenient flat list keyed by category for quick filtering. */
export const PRESET_BY_CATEGORY: Record<string, PresetCategory> =
  Object.fromEntries(PRESET_CATEGORIES.map(c => [c.id, c]))
