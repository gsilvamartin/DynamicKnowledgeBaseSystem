import { ResourceService } from '../../services/ResourceService';
import { ResourceType } from '../../interfaces/IResource';
import { AppError } from '../../utils/AppError';

describe('ResourceService', () => {
    let resourceService: ResourceService;

    beforeEach(() => {
        resourceService = new ResourceService();
    });

    describe('createResource', () => {
        it('should create a new resource', async () => {
            const resourceData = {
                topicId: 'test-topic-id',
                url: 'https://example.com',
                description: 'Test Resource',
                type: ResourceType.ARTICLE
            };

            const resource = await resourceService.createResource(resourceData);

            expect(resource).toBeDefined();
            expect(resource.topicId).toBe(resourceData.topicId);
            expect(resource.url).toBe(resourceData.url);
            expect(resource.description).toBe(resourceData.description);
            expect(resource.type).toBe(resourceData.type);
            expect(resource.id).toBeDefined();
            expect(resource.createdAt).toBeDefined();
            expect(resource.updatedAt).toBeDefined();
        });

        it('should throw error if required fields are missing', async () => {
            const invalidResourceData = {
                topicId: 'test-topic-id',
                url: 'https://example.com'
            };

            await expect(resourceService.createResource(invalidResourceData as any)).rejects.toThrow(AppError);
        });

        it('should throw error if resource type is invalid', async () => {
            const invalidResourceData = {
                topicId: 'test-topic-id',
                url: 'https://example.com',
                description: 'Test Resource',
                type: 'invalid-type' as ResourceType
            };

            await expect(resourceService.createResource(invalidResourceData)).rejects.toThrow(AppError);
        });
    });

    describe('updateResource', () => {
        it('should update an existing resource', async () => {
            const resource = await resourceService.createResource({
                topicId: 'test-topic-id',
                url: 'https://example.com',
                description: 'Initial Description',
                type: ResourceType.ARTICLE
            });

            const updatedResource = await resourceService.updateResource(resource.id, {
                description: 'Updated Description',
                type: ResourceType.VIDEO
            });

            expect(updatedResource.description).toBe('Updated Description');
            expect(updatedResource.type).toBe(ResourceType.VIDEO);
            expect(updatedResource.updatedAt).toBeDefined();
            expect(updatedResource.url).toBe(resource.url); // Unchanged field
        });

        it('should throw error if resource does not exist', async () => {
            await expect(resourceService.updateResource('non-existent-id', {
                description: 'Updated Description'
            })).rejects.toThrow(AppError);
        });
    });

    describe('getTopicResources', () => {
        it('should return all resources for a topic', async () => {
            const topicId = 'test-topic-id';
            await resourceService.createResource({
                topicId,
                url: 'https://example.com/1',
                description: 'Resource 1',
                type: ResourceType.ARTICLE
            });

            await resourceService.createResource({
                topicId,
                url: 'https://example.com/2',
                description: 'Resource 2',
                type: ResourceType.VIDEO
            });

            const resources = await resourceService.getTopicResources(topicId);
            expect(resources).toHaveLength(2);
            expect(resources.every(r => r.topicId === topicId)).toBe(true);
        });

        it('should return empty array if topic has no resources', async () => {
            const resources = await resourceService.getTopicResources('non-existent-topic');
            expect(resources).toHaveLength(0);
        });
    });

    describe('getResourcesByType', () => {
        it('should return all resources of a specific type', async () => {
            await resourceService.createResource({
                topicId: 'test-topic-1',
                url: 'https://example.com/1',
                description: 'Article 1',
                type: ResourceType.ARTICLE
            });

            await resourceService.createResource({
                topicId: 'test-topic-2',
                url: 'https://example.com/2',
                description: 'Article 2',
                type: ResourceType.ARTICLE
            });

            await resourceService.createResource({
                topicId: 'test-topic-3',
                url: 'https://example.com/3',
                description: 'Video 1',
                type: ResourceType.VIDEO
            });

            const articles = await resourceService.getResourcesByType(ResourceType.ARTICLE);
            expect(articles).toHaveLength(2);
            expect(articles.every(r => r.type === ResourceType.ARTICLE)).toBe(true);

            const videos = await resourceService.getResourcesByType(ResourceType.VIDEO);
            expect(videos).toHaveLength(1);
            expect(videos[0].type).toBe(ResourceType.VIDEO);
        });

        it('should return empty array if no resources of type exist', async () => {
            const resources = await resourceService.getResourcesByType(ResourceType.PDF);
            expect(resources).toHaveLength(0);
        });
    });

    describe('deleteResource', () => {
        it('should delete an existing resource', async () => {
            const resource = await resourceService.createResource({
                topicId: 'test-topic-id',
                url: 'https://example.com',
                description: 'Test Resource',
                type: ResourceType.ARTICLE
            });

            const result = await resourceService.deleteResource(resource.id);
            expect(result).toBe(true);

            const deletedResource = await resourceService.getById(resource.id);
            expect(deletedResource).toBeUndefined();
        });

        it('should return false if resource does not exist', async () => {
            const result = await resourceService.deleteResource('non-existent-id');
            expect(result).toBe(false);
        });
    });
}); 