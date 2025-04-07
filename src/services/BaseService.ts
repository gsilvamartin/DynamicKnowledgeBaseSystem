import { AppError } from '../utils/AppError';
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseService<T> {
    protected items: Map<string, T>;

    constructor() {
        this.items = new Map();
    }

    protected abstract validate(item: T): void;

    async create(item: T): Promise<T> {
        this.validate(item);
        const id = (item as any).id;
        if (this.items.has(id)) {
            throw new AppError('Item already exists', 400);
        }
        this.items.set(id, item);
        return item;
    }

    async getById(id: string): Promise<T | undefined> {
        return this.items.get(id);
    }

    async getAll(): Promise<T[]> {
        return Array.from(this.items.values());
    }

    async update(id: string, item: T): Promise<T> {
        if (!this.items.has(id)) {
            throw new AppError('Item not found', 404);
        }
        this.validate(item);
        this.items.set(id, item);
        return item;
    }

    async delete(id: string): Promise<boolean> {
        return this.items.delete(id);
    }

    protected generateId(): string {
        return uuidv4();
    }
} 