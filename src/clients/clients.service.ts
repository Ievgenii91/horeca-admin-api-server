import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Client, ClientDocument } from 'src/schemas/client.schema';
import { Product } from 'src/schemas/product.schema';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsService implements OnModuleInit {
  private clients: Client[];
  private readonly logger = new Logger(ClientsService.name);

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

  async incrementOrdersCount(_id: string): Promise<ClientDocument> {
    return this.clientModel
      .findByIdAndUpdate(_id, { $inc: { ordersCount: 1 } })
      .exec();
  }

  // TODO: deprecated
  async migrateFromClientToCollection(): Promise<void> {
    const clients = await this.clientModel.find({}).exec();
    let products = [];
    clients.forEach((client) => {
      products = [
        ...products,
        ...client.products.map((doc) => {
          const v = doc['_doc'];
          delete v['_id'];
          if (!v.name) {
            v.name = 'ups';
          }
          return {
            ...v,
            clientId: client.id,
          };
        }),
      ];
    });
    // await this.productModel.insertMany(products);
    this.logger.log(`\n\n------------\n\n
    ${products.length} products were migrated successfully
    `);
  }

  async onModuleInit() {
    this.clients = await this.getClients();
  }
}
