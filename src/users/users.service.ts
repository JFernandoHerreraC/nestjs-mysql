import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';;
import { Repository } from 'typeorm'
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {

    }
    async createUser(user: CreateUserDto) {
        const userFound = await this.userRepository.findOne({
            where: {
                username: user.username
            }
        });
        if (userFound) {
            throw new ConflictException('User already exists');
        }
        const newUser = this.userRepository.create(user);
        return this.userRepository.save(newUser);
    }
    getUsers() {
        return this.userRepository.find();
    }
    async getUser(id: number) {

        const userFound = await this.userRepository.findOne({
            where: {
                id
            }
        });
        if (!userFound) {
            throw new NotFoundException('User not found');
        }
        return userFound;
    }
    async deleteUser(id: number) {
        const result = await this.userRepository.delete({id});
        if (result.affected === 0) {
            throw new NotFoundException('User not found');
            
        }
        return result;
    }
    async updateUser(id: number, user: UpdateUserDto) {
        const userFound = await this.userRepository.findOne({
            where: {
                id
            }
        });
        if (!userFound) {
            throw new NotFoundException('User not found');
        }
        const updateUser = Object.assign(userFound,user);
        return this.userRepository.save(updateUser);
    }
}
