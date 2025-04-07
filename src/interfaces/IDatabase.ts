/**
 * Interface defining the contract for database operations
 * @template T - The type of items to store
 */
export interface IDatabase<T> {
    /**
     * Store an item with the given ID
     * @param id - The unique identifier for the item
     * @param item - The item to store
     */
    set(id: string, item: T): void;

    /**
     * Retrieve an item by its ID
     * @param id - The unique identifier of the item
     * @returns The item if found, undefined otherwise
     */
    get(id: string): T | undefined;

    /**
     * Find an item by a specific property value
     * @param property - The property to search by
     * @param value - The value to match
     * @returns The first matching item if found, undefined otherwise
     */
    getByProperty(property: keyof T, value: any): T | undefined;

    /**
     * Get all items in the database
     * @returns Array of all items
     */
    getAll(): T[];

    /**
     * Delete an item by its ID
     * @param id - The unique identifier of the item to delete
     * @returns True if the item was deleted, false otherwise
     */
    delete(id: string): boolean;

    /**
     * Check if an item exists by its ID
     * @param id - The unique identifier to check
     * @returns True if the item exists, false otherwise
     */
    has(id: string): boolean;

    /**
     * Remove all items from the database
     */
    clear(): void;

    /**
     * Get the total number of items in the database
     * @returns The number of items
     */
    size(): number;

    /**
     * Get all IDs in the database
     * @returns Array of all IDs
     */
    getAllIds(): string[];

    /**
     * Find all items that match the given predicate
     * @param predicate - The function to test each item
     * @returns Array of matching items
     */
    find(predicate: (item: T) => boolean): T[];

    /**
     * Find the first item that matches the given predicate
     * @param predicate - The function to test each item
     * @returns The first matching item if found, undefined otherwise
     */
    findOne(predicate: (item: T) => boolean): T | undefined;
} 