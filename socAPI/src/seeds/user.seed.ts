import { inject, injectable } from 'tsyringe';
import { User } from '../models/User';
import { faker } from '@faker-js/faker';
import { DIContainerTokensEnum } from '../enums/DIContainerTokensEnum';
import { Repository } from 'typeorm';
import { IPasswordService } from '../interfaces/UserManagement/IPasswordService';
import { env } from '../config/env';
import { UserRoleEnum } from '../enums/UserRoleEnum';

/**
 * @description Seeder class for populating the database with initial user data.
 * This class uses the PasswordService to hash passwords before saving users to the database.
 * The seed method checks for existing users to avoid duplicates and generates a specified number
 * of users with random data using the Faker library. Each user is assigned a hashed password, and
 * the users are saved to the database in bulk for efficiency.
 */
@injectable()
export class UserSeeder {
    /**
     * @description Initializes the UserSeeder with repositories and services.
     * @param userRepo - The repository for accessing user data in the database.
     * @param passwordService - The service responsible for handling password-related operations, such as hashing passwords before saving them to the database.
     */
    constructor(
        @inject(DIContainerTokensEnum.UserRepository) private readonly userRepo: Repository<User>,
        @inject(DIContainerTokensEnum.IPasswordService) private readonly passwordService: IPasswordService,
    ) {}

    /**
     * @description Seeds the database with initial user data.
     * @returns A promise that resolves when the seeding process is complete. The method does not return any value upon successful completion.
     */
    public async seed(): Promise<void> {
        if (!env.DEV_USER_PASSWORD) {
            throw Error('DEV_USER_PASSWORD is not set in environment variables.');
        }

        const existing = await this.userRepo.count();
        if (existing != 0) {
            return; // Don't seed if users already exist
        }

        await this.seedUser(env.DEV_USER_PASSWORD);
        await this.seedAdmin(env.DEV_USER_PASSWORD);
        await this.seedSuperAdmin(env.DEV_USER_PASSWORD);
    }

    private async seedUser(password: string): Promise<void> {
        for (let i = 0; i < 200; i++) {
            const user = this.userRepo.create({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                password: await this.passwordService.hashPassword(password),
            });
            await this.userRepo.save(user);
        }
        console.log('Users seeded successfully');
    }

    private async seedAdmin(password: string): Promise<void> {
        for (let i = 0; i < 5; i++) {
            const user = this.userRepo.create({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                password: await this.passwordService.hashPassword(password),
                role: UserRoleEnum.ADMIN,
            });
            await this.userRepo.save(user);
        }
        console.log('Admins seeded successfully');
    }

    private async seedSuperAdmin(password: string): Promise<void> {
        for (let i = 0; i < 3; i++) {
            const user = this.userRepo.create({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                password: await this.passwordService.hashPassword(password),
                role: UserRoleEnum.SUPER_ADMIN,
            });
            await this.userRepo.save(user);
        }
        console.log('Super admins seeded successfully');
    }
}
