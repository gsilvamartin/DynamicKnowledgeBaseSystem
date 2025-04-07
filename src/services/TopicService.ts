import { BaseService } from './BaseService';
import { ITopic, ITopicVersion, ITopicHierarchy, ITopicPath } from '../interfaces/ITopic';
import { AppError } from '../utils/AppError';

export class TopicService extends BaseService<ITopic> {
    private topics: Map<string, ITopic> = new Map();
    private topicVersions: Map<string, ITopic[]> = new Map();

    protected validate(topic: ITopic): void {
        if (!topic.name || !topic.content) {
            throw new AppError('Name and content are required', 400);
        }

        if (topic.parentTopicId && !this.topics.has(topic.parentTopicId)) {
            throw new AppError('Parent topic does not exist', 404);
        }
    }

    async createTopic(topicData: Omit<ITopic, 'id' | 'version' | 'createdAt' | 'updatedAt'>): Promise<ITopic> {
        const topic: ITopic = {
            ...topicData,
            id: this.generateId(),
            version: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.validate(topic);
        this.topics.set(topic.id, topic);
        this.topicVersions.set(topic.id, [topic]);

        return topic;
    }

    async updateTopic(id: string, content: string): Promise<ITopic> {
        const topic = this.topics.get(id);
        if (!topic) {
            throw new AppError('Topic not found', 404);
        }

        const updatedTopic: ITopic = {
            ...topic,
            content,
            version: topic.version + 1,
            updatedAt: new Date()
        };

        this.validate(updatedTopic);
        this.topics.set(id, updatedTopic);
        this.topicVersions.get(id)?.push(updatedTopic);

        return updatedTopic;
    }

    async getTopicVersions(id: string): Promise<ITopic[]> {
        return this.topicVersions.get(id) || [];
    }

    async getTopicVersion(id: string, version: number): Promise<ITopic | undefined> {
        const versions = this.topicVersions.get(id);
        if (!versions) {
            throw new AppError('Topic not found', 404);
        }

        return versions.find(v => v.version === version);
    }

    async getTopicHierarchy(id: string): Promise<ITopic[]> {
        const topic = this.topics.get(id);
        if (!topic) {
            throw new AppError('Topic not found', 404);
        }

        const hierarchy: ITopic[] = [topic];
        const childTopics = Array.from(this.topics.values()).filter(t => t.parentTopicId === id);

        for (const childTopic of childTopics) {
            const childHierarchy = await this.getTopicHierarchy(childTopic.id);
            hierarchy.push(...childHierarchy);
        }

        return hierarchy;
    }

    async findShortestPath(startId: string, endId: string): Promise<{ path: string[]; distance: number }> {
        const startTopic = this.topics.get(startId);
        const endTopic = this.topics.get(endId);

        if (!startTopic || !endTopic) {
            throw new AppError('One or both topics not found', 404);
        }

        const visited = new Set<string>();
        const queue: { topic: ITopic; path: string[]; distance: number }[] = [
            { topic: startTopic, path: [startId], distance: 0 }
        ];

        while (queue.length > 0) {
            const { topic, path, distance } = queue.shift()!;

            if (topic.id === endId) {
                return { path, distance };
            }

            if (visited.has(topic.id)) {
                continue;
            }

            visited.add(topic.id);

            // Add parent topic to queue
            if (topic.parentTopicId && !visited.has(topic.parentTopicId)) {
                const parentTopic = this.topics.get(topic.parentTopicId);
                if (parentTopic) {
                    queue.push({
                        topic: parentTopic,
                        path: [...path, topic.parentTopicId],
                        distance: distance + 1
                    });
                }
            }

            // Add child topics to queue
            const childTopics = Array.from(this.topics.values()).filter(t => t.parentTopicId === topic.id);
            for (const childTopic of childTopics) {
                if (!visited.has(childTopic.id)) {
                    queue.push({
                        topic: childTopic,
                        path: [...path, childTopic.id],
                        distance: distance + 1
                    });
                }
            }
        }

        throw new AppError('No path found between topics', 404);
    }

    async getById(id: string): Promise<ITopic | undefined> {
        return this.topics.get(id);
    }

    async delete(id: string): Promise<boolean> {
        const topic = this.topics.get(id);
        if (!topic) {
            return false;
        }

        // Delete all child topics
        const childTopics = Array.from(this.topics.values()).filter(t => t.parentTopicId === id);
        for (const childTopic of childTopics) {
            await this.delete(childTopic.id);
        }

        this.topics.delete(id);
        this.topicVersions.delete(id);
        return true;
    }
} 