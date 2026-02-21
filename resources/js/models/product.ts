import type {Category} from './category';

export class Product {
  id!: number;
  name!: string;
  description!: string | null;
  price!: number;
  category!: Category;
}
