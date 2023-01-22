import { Controller, Body, Param, Delete, Post, Get, Patch, ParseUUIDPipe } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {

    }
    @Get()
    getUsers(): Promise<User[]> {
        return this.usersService.getUsers();
    }
    @Get(':id')
    getUser(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
        return this.usersService.getUser(id);
    }
    @Delete(':id')
    deleteUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.deleteUser(id)
    }
    @Patch(':id')
    updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() user: UpdateUserDto) {
        return this.usersService.updateUser(id, user);
    }

    @Post(':id/profile')
    createProfile(@Param('id', ParseUUIDPipe) id:string, @Body() profile: CreateProfileDto){
        return this.usersService.createProfile(id, profile);
    }
}
