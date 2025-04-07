import { TopicService } from '../../services/TopicService';
import { ITopic } from '../../interfaces/ITopic';
import { AppError } from '../../utils/AppError';

describe('TopicService', () => {
    let service: TopicService;
    let mockTopic: Omit<ITopic, 'id' | 'version' | 'createdAt' | 'updatedAt'>;

    beforeEach(() => {
        service = new TopicService();
        mockTopic = {
            name: 'Test Topic',
            content: 'Test Content',
            parentTopicId: undefined
        };
    });

    describe('validate', () => {
        it('should throw error if name is missing', async () => {
            const invalidTopic = { ...mockTopic, name: '' };
            await expect(service.createTopic(invalidTopic)).rejects.toThrow('Name and content are required');
        });

        it('should throw error if content is missing', async () => {
            const invalidTopic = { ...mockTopic, content: '' };
            await expect(service.createTopic(invalidTopic)).rejects.toThrow('Name and content are required');
        });

        it('should throw error if parent topic does not exist', async () => {
            const topicWithInvalidParent = { ...mockTopic, parentTopicId: 'non-existent' };
            await expect(service.createTopic(topicWithInvalidParent)).rejects.toThrow('Parent topic does not exist');
        });
    });

    describe('createTopic', () => {
        it('should create a new topic', async () => {
            const topic = await service.createTopic(mockTopic);
            expect(topic).toMatchObject({
                ...mockTopic,
                version: 1
            });
            expect(topic.id).toBeDefined();
            expect(topic.createdAt).toBeInstanceOf(Date);
            expect(topic.updatedAt).toBeInstanceOf(Date);
        });

        it('should create a topic with a parent', async () => {
            const parentTopic = await service.createTopic(mockTopic);
            const childTopic = await service.createTopic({
                ...mockTopic,
                parentTopicId: parentTopic.id
            });
            expect(childTopic.parentTopicId).toBe(parentTopic.id);
        });
    });

    describe('updateTopic', () => {
        it('should update topic content and increment version', async () => {
            const topic = await service.createTopic(mockTopic);
            await new Promise(resolve => setTimeout(resolve, 1));
            const updatedTopic = await service.updateTopic(topic.id, 'Updated Content');
            expect(updatedTopic.content).toBe('Updated Content');
            expect(updatedTopic.version).toBe(2);
            expect(updatedTopic.updatedAt.getTime()).toBeGreaterThan(topic.updatedAt.getTime());
        });

        it('should throw error if topic does not exist', async () => {
            await expect(service.updateTopic('non-existent', 'content')).rejects.toThrow('Topic not found');
        });
    });

    describe('getTopicVersions', () => {
        it('should return all versions of a topic', async () => {
            const topic = await service.createTopic(mockTopic);
            await service.updateTopic(topic.id, 'Updated Content');
            const versions = await service.getTopicVersions(topic.id);
            expect(versions).toHaveLength(2);
            expect(versions[0].version).toBe(1);
            expect(versions[1].version).toBe(2);
        });

        it('should return empty array for non-existent topic', async () => {
            const versions = await service.getTopicVersions('non-existent');
            expect(versions).toEqual([]);
        });
    });

    describe('getTopicVersion', () => {
        it('should return specific version of a topic', async () => {
            const topic = await service.createTopic(mockTopic);
            await service.updateTopic(topic.id, 'Updated Content');
            const version1 = await service.getTopicVersion(topic.id, 1);
            expect(version1?.version).toBe(1);
            expect(version1?.content).toBe('Test Content');
        });

        it('should throw error if topic does not exist', async () => {
            await expect(service.getTopicVersion('non-existent', 1)).rejects.toThrow('Topic not found');
        });

        it('should return undefined for non-existent version', async () => {
            const topic = await service.createTopic(mockTopic);
            const version = await service.getTopicVersion(topic.id, 999);
            expect(version).toBeUndefined();
        });
    });

    describe('getTopicHierarchy', () => {
        it('should return topic hierarchy including children', async () => {
            const parentTopic = await service.createTopic(mockTopic);
            const childTopic = await service.createTopic({
                ...mockTopic,
                name: 'Child Topic',
                parentTopicId: parentTopic.id
            });
            const grandchildTopic = await service.createTopic({
                ...mockTopic,
                name: 'Grandchild Topic',
                parentTopicId: childTopic.id
            });

            const hierarchy = await service.getTopicHierarchy(parentTopic.id);
            expect(hierarchy).toHaveLength(3);
            expect(hierarchy[0].id).toBe(parentTopic.id);
            expect(hierarchy[1].id).toBe(childTopic.id);
            expect(hierarchy[2].id).toBe(grandchildTopic.id);
        });

        it('should throw error if topic does not exist', async () => {
            await expect(service.getTopicHierarchy('non-existent')).rejects.toThrow('Topic not found');
        });
    });

    describe('findShortestPath', () => {
        it('should find shortest path between topics', async () => {
            const topic1 = await service.createTopic(mockTopic);
            const topic2 = await service.createTopic({
                ...mockTopic,
                name: 'Topic 2',
                parentTopicId: topic1.id
            });
            const topic3 = await service.createTopic({
                ...mockTopic,
                name: 'Topic 3',
                parentTopicId: topic2.id
            });

            const result = await service.findShortestPath(topic1.id, topic3.id);
            expect(result.path).toEqual([topic1.id, topic2.id, topic3.id]);
            expect(result.distance).toBe(2);
        });

        it('should find path through parent topic', async () => {
            const parentTopic = await service.createTopic(mockTopic);
            const topic1 = await service.createTopic({
                ...mockTopic,
                name: 'Topic 1',
                parentTopicId: parentTopic.id
            });
            const topic2 = await service.createTopic({
                ...mockTopic,
                name: 'Topic 2',
                parentTopicId: parentTopic.id
            });

            const result = await service.findShortestPath(topic1.id, topic2.id);
            expect(result.path).toEqual([topic1.id, parentTopic.id, topic2.id]);
            expect(result.distance).toBe(2);
        });

        it('should find path through sibling topics', async () => {
            const topic1 = await service.createTopic(mockTopic);
            const sibling1 = await service.createTopic({
                ...mockTopic,
                name: 'Sibling 1',
                parentTopicId: topic1.id
            });
            const sibling2 = await service.createTopic({
                ...mockTopic,
                name: 'Sibling 2',
                parentTopicId: topic1.id
            });

            const result = await service.findShortestPath(sibling1.id, sibling2.id);
            expect(result.path).toEqual([sibling1.id, topic1.id, sibling2.id]);
            expect(result.distance).toBe(2);
        });

        it('should throw error if start topic does not exist', async () => {
            const topic = await service.createTopic(mockTopic);
            await expect(service.findShortestPath('non-existent', topic.id)).rejects.toThrow('One or both topics not found');
        });

        it('should throw error if end topic does not exist', async () => {
            const topic = await service.createTopic(mockTopic);
            await expect(service.findShortestPath(topic.id, 'non-existent')).rejects.toThrow('One or both topics not found');
        });

        it('should throw error if no path exists between topics', async () => {
            const topic1 = await service.createTopic(mockTopic);
            const topic2 = await service.createTopic({ ...mockTopic, name: 'Topic 2' });
            await expect(service.findShortestPath(topic1.id, topic2.id)).rejects.toThrow('No path found between topics');
        });

        it('should handle revisiting topics in path finding', async () => {
            const topic1 = await service.createTopic(mockTopic);
            const topic2 = await service.createTopic({
                ...mockTopic,
                name: 'Topic 2',
                parentTopicId: topic1.id
            });
            const topic3 = await service.createTopic({
                ...mockTopic,
                name: 'Topic 3',
                parentTopicId: topic1.id
            });
            const topic4 = await service.createTopic({
                ...mockTopic,
                name: 'Topic 4',
                parentTopicId: topic2.id
            });

            // This will cause the algorithm to revisit topic1 while searching
            const result = await service.findShortestPath(topic4.id, topic3.id);
            expect(result.path).toEqual([topic4.id, topic2.id, topic1.id, topic3.id]);
            expect(result.distance).toBe(3);
        });
    });

    describe('delete', () => {
        it('should delete topic and its children', async () => {
            const parentTopic = await service.createTopic(mockTopic);
            const childTopic = await service.createTopic({
                ...mockTopic,
                name: 'Child Topic',
                parentTopicId: parentTopic.id
            });

            const result = await service.delete(parentTopic.id);
            expect(result).toBe(true);
            expect(await service.getById(parentTopic.id)).toBeUndefined();
            expect(await service.getById(childTopic.id)).toBeUndefined();
        });

        it('should return false if topic does not exist', async () => {
            const result = await service.delete('non-existent');
            expect(result).toBe(false);
        });

        it('should delete topic versions', async () => {
            const topic = await service.createTopic(mockTopic);
            await service.updateTopic(topic.id, 'Updated Content');
            await service.delete(topic.id);
            const versions = await service.getTopicVersions(topic.id);
            expect(versions).toHaveLength(0);
        });
    });
}); 