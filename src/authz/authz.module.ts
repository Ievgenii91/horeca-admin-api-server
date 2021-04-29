import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { PermissionsGuard } from './permissions.guard';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PermissionsGuard,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [JwtStrategy],
  exports: [PassportModule, JwtStrategy, PermissionsGuard],
  controllers: [AuthController],
})
export class AuthzModule {}
