import {
  Body,
  Controller,
  Get,
  Post,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { AuthGuard } from '@nestjs/passport';
import { Client } from 'src/schemas/client.schema';
import { PermissionsGuard } from 'src/authz/permissions.guard';
import { Permissions } from 'src/authz/permissions.decorator';
import { User } from 'src/decorators/user.decorator';
import { JwtPayload } from 'src/authz/interfaces/jwt-payload.interface';
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Get()
  @Permissions('read:oncoming')
  async getClient(@User() user: JwtPayload): Promise<Client> {
    return this.clientService.getClient({
      owner: user.email,
    });
  }

  @Get('/all')
  @Permissions('read:oncoming')
  async getAllClients(): Promise<Client[]> {
    return this.clientService.getClients();
  }

  @Post()
  createClient(@Body(ValidationPipe) createClientDto: CreateClientDto) {
    return this.clientService.createClient(createClientDto);
  }
}
