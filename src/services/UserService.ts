import { IUser, UserRole } from '../interfaces/IUser';
import { BaseService } from './BaseService';
import { AppError } from '../utils/AppError';

export class UserService extends BaseService<IUser> {
    private users: Map<string, IUser> = new Map();
    private emailIndex: Map<string, string> = new Map(); // email -> id

    protected validate(user: IUser): void {
        if (!user.name || !user.email || !user.role) {
            throw new AppError('All fields are required', 400);
        }

        if (!Object.values(UserRole).includes(user.role)) {
            throw new AppError('Invalid user role', 400);
        }

        if (!this.isValidEmail(user.email)) {
            throw new AppError('Invalid email format', 400);
        }

        const existingUserId = this.emailIndex.get(user.email);
        if (existingUserId && existingUserId !== user.id) {
            throw new AppError('Email already in use', 400);
        }
    }

    async createUser(userData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
        const user: IUser = {
            ...userData,
            id: this.generateId(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.validate(user);
        this.users.set(user.id, user);
        this.emailIndex.set(user.email, user.id);

        return user;
    }

    async updateUserRole(id: string, role: UserRole): Promise<IUser> {
        const user = this.users.get(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        const updatedUser: IUser = {
            ...user,
            role,
            updatedAt: new Date()
        };

        this.validate(updatedUser);
        this.users.set(id, updatedUser);

        return updatedUser;
    }

    async getUserByEmail(email: string): Promise<IUser | undefined> {
        const userId = this.emailIndex.get(email);
        return userId ? this.users.get(userId) : undefined;
    }

    async getUsersByRole(role: UserRole): Promise<IUser[]> {
        return Array.from(this.users.values()).filter(u => u.role === role);
    }

    async getById(id: string): Promise<IUser | undefined> {
        return this.users.get(id);
    }

    async deleteUser(id: string): Promise<boolean> {
        const user = this.users.get(id);
        if (!user) {
            return false;
        }

        this.emailIndex.delete(user.email);
        return this.users.delete(id);
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
} 