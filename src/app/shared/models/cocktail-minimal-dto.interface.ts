import { ICategory } from './category.interface';
import { IGlassType } from './glass-type.interface';
import { IIngredientFullDTO } from './ingredient-full-dto.interface';

export interface ICocktailMinimalDTO {
  alcoholic: boolean;
  category: ICategory;
  created_at: string;
  glass_type: IGlassType;
  id: number;
  image: string;
  ingredients: IIngredientFullDTO[];
  name: string;
  updated_at: string;
}
