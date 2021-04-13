import {
  Body,
  Controller,
  Get,
  Post,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { AuthGuard } from '@nestjs/passport';
import { Client } from 'src/schemas/client.schema';
import { PermissionsGuard } from 'src/authz/permissions.guard';
import { Permissions } from 'src/authz/permissions.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Get()
  @Permissions('read:oncoming')
  async getClient(@Req() req): Promise<Client> {
    const client = await this.clientService.getClient({
      owner: req.user.email,
    });
    req.session.clientId = client._id;
    return client;
  }

  @Post()
  createClient(@Body(ValidationPipe) createClientDto: CreateClientDto) {
    return this.clientService.createClient(createClientDto);
  }
}
