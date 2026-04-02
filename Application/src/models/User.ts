import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

/**
 * User entity representing a user in the system
 * This class is decorated with TypeORM decorators to define the database schema
 */
@Entity()
export class User {

    /**
     * Unique identifier for the user, generated as a UUID
     */
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    /**
     * The user's first name, stored as a string with a maximum length of 50 characters
     */
    @Column({ type: "nvarchar", length: 50 })
    firstName!: string;

    /**
     * The user's last name, stored as a string with a maximum length of 50 characters
     */
    @Column({ type: "nvarchar", length: 50 })
    lastName!: string;

    /**
     * The user's email address, stored as a unique string
     */
    @Column({ type: "nvarchar", unique: true })
    email!: string;

    /**
     * The user's password, stored as a string with a maximum length of 255 characters
     */
    @Column({ type: "nvarchar", length: 255 })
    password!: string;
}