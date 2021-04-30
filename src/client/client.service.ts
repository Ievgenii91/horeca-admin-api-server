import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateWriteOpResult } from 'mongoose';
import { Client, ClientDocument } from 'src/schemas/client.schema';
import { Product } from 'src/schemas/product.schema';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientService implements OnModuleInit {
  private clients: Client[];

  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
  ) {}

  async getClientByUser(email: string): Promise<Client[]> {
    return this.clientModel
      .find({
        $or: [{ owner: email }, { users: { $in: [email] } }],
      })
      .select({
        paymentToken: 0,
        botToken: 0,
        botName: 0,
      })
      .exec();
  }

  get entities(): Client[] {
    return this.clients;
  }

  async getClient(filter: FilterQuery<any>): Promise<Client> {
    return this.clientModel.findOne(filter).exec();
  }

  async getClients(): Promise<Client[] | ClientDocument[]> {
    const clients = await this.clientModel.find({}).exec();
    this.clients = clients;
    return clients;
  }

  async getClientProducts(id: string): Promise<Product[]> {
    const { products } = await this.getClient({ _id: id });
    return products;
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

  async onModuleInit() {
    this.clients = await this.getClients();
  }
}
