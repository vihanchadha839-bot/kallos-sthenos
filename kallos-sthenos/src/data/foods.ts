import type { Allergen, Diet, MealName, Slot } from '../types';

export type FoodKind = 'meat' | 'fish' | 'shellfish' | 'dairy' | 'egg' | 'plant';

export interface Food {
  id: string;
  name: string;
  // grams of macro per 100 g
  p: number;
  c: number;
  f: number;
  kind: FoodKind;
  allergens: Allergen[];
}

const F = (id: string, name: string, p: number, c: number, f: number, kind: FoodKind, allergens: Allergen[] = []): Food =>
  ({ id, name, p, c, f, kind, allergens });

export const FOODS: Food[] = [
  // Proteins
  F('chicken', 'Chicken breast (cooked)', 31, 0, 3.6, 'meat'),
  F('beef', 'Lean beef (cooked)', 26, 0, 6, 'meat'),
  F('salmon', 'Salmon (cooked)', 25, 0, 12, 'fish', ['fish']),
  F('prawns', 'Prawns (cooked)', 24, 0.2, 1, 'shellfish', ['shellfish']),
  F('tuna', 'Canned tuna (in water)', 26, 0, 1, 'fish', ['fish']),
  F('greek-yogurt', 'Greek yogurt (0% fat)', 10, 3.6, 0.4, 'dairy', ['dairy']),
  F('cottage', 'Cottage cheese (low fat)', 11, 3.4, 2.3, 'dairy', ['dairy']),
  F('paneer', 'Paneer (low fat)', 25, 4, 10, 'dairy', ['dairy']),
  F('whey', 'Whey protein', 80, 8, 6, 'dairy', ['dairy']),
  F('tofu', 'Firm tofu', 15, 2, 8, 'plant', ['soy']),
  F('tempeh', 'Tempeh', 19, 9, 11, 'plant', ['soy']),
  F('edamame', 'Edamame', 11, 9, 5, 'plant', ['soy']),
  F('eggs', 'Whole eggs', 13, 1, 10, 'egg', ['eggs']),
  F('egg-whites', 'Egg whites', 11, 0.7, 0.2, 'egg', ['eggs']),
  F('lentils', 'Lentils (cooked)', 9, 20, 0.4, 'plant'),
  F('chickpeas', 'Chickpeas (cooked)', 9, 27, 2.6, 'plant'),
  F('seitan', 'Seitan', 25, 14, 2, 'plant', ['gluten']),
  F('pea-protein', 'Pea protein powder', 80, 4, 7, 'plant'),
  // Carbs
  F('rice', 'Basmati rice (cooked)', 2.7, 28, 0.3, 'plant'),
  F('sweet-potato', 'Sweet potato (baked)', 2, 21, 0.1, 'plant'),
  F('oats', 'Rolled oats (dry)', 13, 66, 7, 'plant', ['gluten']),
  F('pasta', 'Whole wheat pasta (cooked)', 5.3, 27, 1, 'plant', ['gluten']),
  F('toast', 'Whole wheat toast', 13, 41, 3.4, 'plant', ['gluten']),
  F('quinoa', 'Quinoa (cooked)', 4.4, 21, 1.9, 'plant'),
  F('rice-cakes', 'Rice cakes', 8, 80, 3, 'plant'),
  // Fats
  F('olive-oil', 'Olive oil', 0, 0, 100, 'plant'),
  F('avocado', 'Avocado', 2, 9, 15, 'plant'),
  F('almonds', 'Almonds', 21, 22, 50, 'plant', ['nuts']),
  F('peanut-butter', 'Peanut butter', 25, 20, 50, 'plant', ['peanuts']),
  F('pumpkin-seeds', 'Pumpkin seeds', 30, 11, 49, 'plant'),
  F('chia', 'Chia seeds', 17, 42, 31, 'plant'),
  // Vegetables
  F('broccoli', 'Broccoli', 2.8, 7, 0.4, 'plant'),
  F('spinach', 'Spinach', 2.9, 3.6, 0.4, 'plant'),
  F('asparagus', 'Asparagus', 2.2, 3.9, 0.1, 'plant'),
  F('peppers', 'Bell peppers', 1, 6, 0.3, 'plant'),
  F('green-beans', 'Green beans', 1.8, 7, 0.2, 'plant'),
  // Fruits
  F('banana', 'Banana', 1.1, 23, 0.3, 'plant'),
  F('blueberries', 'Blueberries', 0.7, 14, 0.3, 'plant'),
  F('apple', 'Apple', 0.3, 14, 0.2, 'plant'),
  F('strawberries', 'Strawberries', 0.7, 8, 0.3, 'plant'),
];

export const FOOD_BY_ID: Record<string, Food> = Object.fromEntries(FOODS.map((f) => [f.id, f]));

/** Which foods can fill each slot of each meal (ordered by preference). */
export const MEAL_POOLS: Record<MealName, Record<Slot, string[]>> = {
  Breakfast: {
    protein: ['eggs', 'greek-yogurt', 'egg-whites', 'cottage', 'tofu', 'whey', 'pea-protein', 'tempeh'],
    carb: ['oats', 'toast', 'rice-cakes', 'sweet-potato'],
    fat: ['almonds', 'peanut-butter', 'avocado', 'chia', 'pumpkin-seeds'],
    produce: ['banana', 'blueberries', 'strawberries', 'apple'],
  },
  Lunch: {
    protein: ['chicken', 'tuna', 'beef', 'prawns', 'salmon', 'tofu', 'lentils', 'paneer', 'tempeh', 'chickpeas', 'seitan', 'eggs', 'edamame'],
    carb: ['rice', 'sweet-potato', 'pasta', 'quinoa'],
    fat: ['olive-oil', 'avocado', 'pumpkin-seeds'],
    produce: ['broccoli', 'spinach', 'peppers', 'asparagus', 'green-beans'],
  },
  Dinner: {
    protein: ['salmon', 'chicken', 'prawns', 'beef', 'tofu', 'paneer', 'tempeh', 'lentils', 'seitan', 'chickpeas', 'tuna', 'eggs', 'edamame'],
    carb: ['sweet-potato', 'rice', 'quinoa', 'pasta'],
    fat: ['olive-oil', 'avocado', 'pumpkin-seeds'],
    produce: ['asparagus', 'broccoli', 'green-beans', 'spinach', 'peppers'],
  },
  Snack: {
    protein: ['greek-yogurt', 'cottage', 'whey', 'edamame', 'pea-protein', 'egg-whites', 'tuna', 'tofu'],
    carb: ['rice-cakes', 'oats', 'toast'],
    fat: ['almonds', 'peanut-butter', 'pumpkin-seeds', 'chia'],
    produce: ['apple', 'banana', 'blueberries', 'strawberries'],
  },
};

export const PRODUCE_GRAMS: Record<MealName, number> = { Breakfast: 120, Lunch: 150, Dinner: 150, Snack: 100 };

export function foodAllowed(food: Food, diet: Diet, allergens: Allergen[]): boolean {
  if (food.allergens.some((a) => allergens.includes(a))) return false;
  if (diet === 'vegan') return food.kind === 'plant';
  if (diet === 'vegetarian') return !['meat', 'fish', 'shellfish'].includes(food.kind);
  if (diet === 'pescatarian') return food.kind !== 'meat';
  return true;
}
