import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';;
import { Repository } from 'typeorm'
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './profile.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>
        ) {

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
        const result = await this.userRepository.delete({ id });
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
        const updateUser = Object.assign(userFound, user);
        return this.userRepository.save(updateUser);
    }

    async createProfile(id: number, profile: CreateProfileDto) {
        const userFound = await this.userRepository.findOne({
            where: {
                id
            }
        });

        if (!userFound) {
            throw new NotFoundException('User not found');
        }
        const newProfile = this.profileRepository.create(profile);
        const savedProfile = await this.profileRepository.save(newProfile);
        userFound.profile = savedProfile;
        return this.userRepository.save(userFound);
    }
}
