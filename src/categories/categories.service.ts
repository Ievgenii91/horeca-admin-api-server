import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './entities/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = new this.categoryModel(createCategoryDto);
    await category.save();
    return category;
  }

  findAll(clientId: string): Promise<Category[]> {
    return this.categoryModel.find({ clientId }).exec();
  }

  findOne(id: Types.ObjectId) {
    return this.categoryModel.findById(id).exec();
  }

  update(id: Types.ObjectId, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryModel
      .findByIdAndUpdate(id, {
        $set: {
          ...updateCategoryDto,
        },
      })
      .exec();
  }

  remove(id: Types.ObjectId) {
    return this.categoryModel.findByIdAndDelete(id);
  }
}
