import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports:[
    PassportModule.register({
      defaultStrategy: process.env.DEFAULTSTRATEGY_JWT,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async ()=> ({
        secret: process.env.SECRET_KEY_JWT,
        signOptions: {
          expiresIn: parseInt(process.env.EXPIRESIN_JWT)
        }
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, JwtStrategy,],
  controllers: [AuthController],
  exports: [ JwtStrategy, PassportModule],
})
export class AuthModule {}
