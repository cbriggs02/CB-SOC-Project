import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * @description User entity representing a user in the system
 * This class is decorated with TypeORM decorators to define the database schema
 */
@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'nvarchar', length: 50 })
    firstName!: string;

    @Column({ type: 'nvarchar', length: 50 })
    lastName!: string;

    @Column({ type: 'nvarchar', unique: true })
    email!: string;

    @Column({ type: 'nvarchar', length: 255 })
    password!: string;
}
