import {
  Body,
  Controller,
  Get,
  Post,
  ValidationPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { AuthGuard } from '@nestjs/passport';
import { Client } from 'src/schemas/client.schema';
import { PermissionsGuard } from 'src/authz/permissions.guard';
import { Permissions } from 'src/authz/permissions.decorator';
import { User } from 'src/decorators/user.decorator';
import { JwtPayload } from 'src/authz/interfaces/jwt-payload.interface';
import { TransformInterceptor } from 'src/common/response-transform.interceptor';
import { ApiBody } from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@UseInterceptors(TransformInterceptor)
@Controller('v1/clients')
export class ClientsController {
  constructor(private clientService: ClientsService) {}

  @Get()
  @Permissions('read:oncoming')
  async getAllClients(): Promise<Client[]> {
    return this.clientService.getClients();
  }

  @Get('current')
  @Permissions('read:oncoming')
  async getClient(@User() user: JwtPayload): Promise<Client[]> {
    return this.clientService.getClientByUser(user.email);
  }

  @ApiBody({
    type: CreateClientDto,
  })
  @Post()
  createClient(@Body(ValidationPipe) createClientDto: CreateClientDto) {
    return this.clientService.createClient(createClientDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Permissions('data:update')
  @Post('/products/migrate')
  migrateProducts() {
    return this.clientService.migrateFromClientToCollection();
  }
}
