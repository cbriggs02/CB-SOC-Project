import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";
import { PasswordService } from "../services/UserManagement/PasswordService";
import { faker } from '@faker-js/faker';

/**
 * Seeder class for populating the database with initial user data.
 *  This class uses the PasswordService to hash passwords before saving users to the database. 
 * The seed method checks for existing users to avoid duplicates and generates a specified number
 *  of users with random data using the Faker library. Each user is assigned a hashed password, and 
 * the users are saved to the database in bulk for efficiency.
 */
export class UserSeeder {
    private passwordService: PasswordService;

    /**
     * Initializes the UserSeeder with a PasswordService instance. This service is used to hash passwords for the seeded users.
     */
    constructor() {
        this.passwordService = new PasswordService();
    }

    /**
     * Seeds the database with initial user data.
     * @returns 
     */
    public async seed (): Promise<void> {
        const repo = AppDataSource.getRepository(User);
        const existing = await repo.count();
        if (existing > 0) {
            return; // Don't seed if users already exist
        }

        for (let i = 0; i < 200; i++) {
            const user = repo.create({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                password: await this.passwordService.hashPassword("Password123!"),
            });
            await repo.save(user);
        }
        console.log("Users seeded successfully");
    }
}