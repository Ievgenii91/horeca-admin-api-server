import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop()
  id: string;
  @Prop({ required: true })
  name: string;
  @Prop()
  description: string;
  @Prop()
  count: number;
  @Prop()
  price: number;
  @Prop()
  total: number;
  @Prop()
  type: string;
  @Prop()
  action: string;
  @Prop()
  bonus: boolean;
  @Prop()
  available: boolean;
  @Prop()
  addedCrossSales: Product[];
  @Prop()
  crossSales: Product[];
  @Prop()
  usedForCrossSales: boolean;
  @Prop()
  rating: number;
  @Prop()
  order: number;
  @Prop()
  additionalText: string;
  @Prop()
  fancyName: string;
  @Prop()
  category: string;
  @Prop()
  subCategory: string;

  constructor(data: Partial<Product> = {}) {
    this.name = data.name || null;
    this.id = data.id || this.generateId();
    this.description = data.description || null;
    this.count = data.count || 1;
    this.price = data.price || null;
    this.total = data.total || data.price;
    this.type = data.type || null;
    this.action = data.action || data.name.toLowerCase().split(' ').join('_'); // data.action || data.id;
    this.available = data.available || true;
    this.bonus = data.bonus || false;
    this.addedCrossSales = data.addedCrossSales || []; // added cross sales
    this.crossSales = data.crossSales || []; // list of products which can be cross saled
    this.usedForCrossSales = data.usedForCrossSales || false;
    this.rating = data.rating || 1; // rating - order priority, can be overrided by user rating
    this.additionalText = data.additionalText;
    this.fancyName = data.fancyName;
    this.category = data.category;
    this.subCategory = data.subCategory;
  }

  generateId(): string {
    return (
      this.name.toLowerCase().split(' ').join('_') +
      '_' +
      new Date().getTime().toString()
    );
  }

  increment() {
    this.count++;
    this.total = this.count * this.price;
  }

  decrement() {
    if (this.count === 1) {
      console.error('can not decrement if one left');
    }
    this.count--;
    this.total -= this.price;
  }

  addCrossSale(id, price = 0) {
    const cross = this.crossSales.find((v) => v === id);
    this.total += price;
    this.addedCrossSales.push(cross);
  }
}

export const ProductSchema = SchemaFactory.createForClass(Product);
