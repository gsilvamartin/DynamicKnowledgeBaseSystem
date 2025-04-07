import { BaseService } from '../../services/BaseService';
import { AppError } from '../../utils/AppError';

interface TestItem {
    id: string;
    name: string;
}

class TestService extends BaseService<TestItem> {
    protected validate(item: TestItem): void {
        if (!item.name) {
            throw new AppError('Name is required', 400);
        }
    }
}

describe('BaseService', () => {
    let service: TestService;
    let testItem: TestItem;

    beforeEach(() => {
        service = new TestService();
        testItem = {
            id: 'test-id',
            name: 'Test Item'
        };
    });

    describe('create', () => {
        it('should create a new item', async () => {
            const result = await service.create(testItem);
            expect(result).toEqual(testItem);
            expect(await service.getById(testItem.id)).toEqual(testItem);
        });

        it('should throw error if item already exists', async () => {
            await service.create(testItem);
            await expect(service.create(testItem)).rejects.toThrow('Item already exists');
        });

        it('should throw error if validation fails', async () => {
            const invalidItem = { id: 'test-id', name: '' };
            await expect(service.create(invalidItem)).rejects.toThrow('Name is required');
        });
    });

    describe('getById', () => {
        it('should return item if it exists', async () => {
            await service.create(testItem);
            const result = await service.getById(testItem.id);
            expect(result).toEqual(testItem);
        });

        it('should return undefined if item does not exist', async () => {
            const result = await service.getById('non-existent');
            expect(result).toBeUndefined();
        });
    });

    describe('getAll', () => {
        it('should return all items', async () => {
            const item2 = { id: 'test-id-2', name: 'Test Item 2' };
            await service.create(testItem);
            await service.create(item2);
            const results = await service.getAll();
            expect(results).toHaveLength(2);
            expect(results).toEqual(expect.arrayContaining([testItem, item2]));
        });

        it('should return empty array when no items exist', async () => {
            const results = await service.getAll();
            expect(results).toHaveLength(0);
        });
    });

    describe('update', () => {
        it('should update an existing item', async () => {
            await service.create(testItem);
            const updatedItem = { ...testItem, name: 'Updated Item' };
            const result = await service.update(testItem.id, updatedItem);
            expect(result).toEqual(updatedItem);
            expect(await service.getById(testItem.id)).toEqual(updatedItem);
        });

        it('should throw error if item does not exist', async () => {
            await expect(service.update('non-existent', testItem)).rejects.toThrow('Item not found');
        });

        it('should throw error if validation fails', async () => {
            await service.create(testItem);
            const invalidItem = { ...testItem, name: '' };
            await expect(service.update(testItem.id, invalidItem)).rejects.toThrow('Name is required');
        });
    });

    describe('delete', () => {
        it('should delete an existing item', async () => {
            await service.create(testItem);
            const result = await service.delete(testItem.id);
            expect(result).toBe(true);
            expect(await service.getById(testItem.id)).toBeUndefined();
        });

        it('should return false if item does not exist', async () => {
            const result = await service.delete('non-existent');
            expect(result).toBe(false);
        });
    });

    describe('generateId', () => {
        it('should generate a valid UUID', () => {
            const service = new TestService();
            const id = (service as any).generateId();
            expect(typeof id).toBe('string');
            expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        });
    });
}); 