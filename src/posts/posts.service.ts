import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post) private postsRepository: Repository<Post>,
        private usersService: UsersService
    ) { }
    async createPost(post: CreatePostDto): Promise<Post> {
        const userFound = await this.usersService.getUser(post.authorId);
        if (!userFound) throw new NotFoundException('User not found');
        const newPost = this.postsRepository.create(post);
        return this.postsRepository.save(newPost);
    }
    getPosts(): Promise<Post[]> {
        return this.postsRepository.find({
            relations: ['author'],
        });
    }
}
