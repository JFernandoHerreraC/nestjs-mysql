import { User } from "src/users/user.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Post{
    @PrimaryGeneratedColumn("uuid")
    id: string
    
    @Column()
    title: string
    
    @Column()
    content: string
    
    @Column()
    authorId: string
    
    @ManyToOne(() => User, user => user.posts)
    author:User
}