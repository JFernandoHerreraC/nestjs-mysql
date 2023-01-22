import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from "typeorm";
import { User } from '../users/user.entity';
import { ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common/exceptions';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;
        const salt = await bcrypt.genSalt(15);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = {
            username,
            password: hashedPassword
        }
        const newUser = await this.usersRepository.create(user);
        try {
            await this.usersRepository.save(newUser);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('Username already exists')
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async signin(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const { username, password } = authCredentialsDto;
        const user = await this.usersRepository.findOne({
            where: { username }
        });
        if (user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = { username };
            const accessToken: string = await this.jwtService.sign(payload);
            return {accessToken}; 
        } else {
            throw new UnauthorizedException('Please check your login credentials');
        }
    }

}
