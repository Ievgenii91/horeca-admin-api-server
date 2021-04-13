import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateWriteOpResult } from 'mongoose';
import { Client, ClientDocument } from 'src/schemas/client.schema';
import { Product } from 'src/schemas/product.schema';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
  ) {}

  async getClient(filter: FilterQuery<any>): Promise<Client> {
    return this.clientModel.findOne(filter).exec();
  }

  async getClientProducts(id: string): Promise<Product[]> {
    const { products } = await this.getClient({ _id: id });
    return products;
  }

  async getClients() {
    return this.clientModel.find().exec();
  }

  async createClient(createClientDto: CreateClientDto) {
    const newClient = new this.clientModel(createClientDto);
    return newClient.save();
  }

  async incrementOrdersCount(_id: string): Promise<UpdateWriteOpResult> {
    return this.clientModel
      .updateOne({ _id }, { $inc: { ordersCount: 1 } })
      .exec();
  }
}
