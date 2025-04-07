import { IResource, ResourceType } from '../interfaces/IResource';
import { BaseService } from './BaseService';
import { AppError } from '../utils/AppError';

export class ResourceService extends BaseService<IResource> {
    private resources: Map<string, IResource> = new Map();

    protected validate(resource: IResource): void {
        if (!resource.topicId || !resource.url || !resource.description || !resource.type) {
            throw new AppError('All fields are required', 400);
        }

        if (!Object.values(ResourceType).includes(resource.type)) {
            throw new AppError('Invalid resource type', 400);
        }
    }

    async createResource(resourceData: Omit<IResource, 'id' | 'createdAt' | 'updatedAt'>): Promise<IResource> {
        const resource: IResource = {
            ...resourceData,
            id: this.generateId(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.validate(resource);
        this.resources.set(resource.id, resource);

        return resource;
    }

    async updateResource(id: string, updateData: Partial<Omit<IResource, 'id' | 'createdAt' | 'updatedAt'>>): Promise<IResource> {
        const resource = this.resources.get(id);
        if (!resource) {
            throw new AppError('Resource not found', 404);
        }

        const updatedResource: IResource = {
            ...resource,
            ...updateData,
            updatedAt: new Date()
        };

        this.validate(updatedResource);
        this.resources.set(id, updatedResource);

        return updatedResource;
    }

    async getTopicResources(topicId: string): Promise<IResource[]> {
        return Array.from(this.resources.values()).filter(r => r.topicId === topicId);
    }

    async getResourcesByType(type: ResourceType): Promise<IResource[]> {
        return Array.from(this.resources.values()).filter(r => r.type === type);
    }

    async getById(id: string): Promise<IResource | undefined> {
        return this.resources.get(id);
    }

    async deleteResource(id: string): Promise<boolean> {
        return this.resources.delete(id);
    }
} 