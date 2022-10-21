import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ForeignKeyMetadata } from "typeorm/metadata/ForeignKeyMetadata";

@Entity()
export class User extends BaseEntity { 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

}

@Entity()
export class Follow extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column() // foreinKey로 만들어야하는데
    user_id: number;

    @Column()
    following_id: number;
}