import { v4 as uuidv4 } from 'uuid';
import { UserRole } from '../../interfaces/IUser';
import { ITopic } from '../../interfaces/ITopic';
import { IResource, ResourceType } from '../../interfaces/IResource';
import { IUser } from '../../interfaces/IUser';

export const createMockUser = (role: UserRole = UserRole.VIEWER): IUser => ({
    id: uuidv4(),
    name: 'Test User',
    email: 'test@example.com',
    role,
    createdAt: new Date(),
    updatedAt: new Date()
});

export const createMockTopic = (parentTopicId?: string): ITopic => ({
    id: uuidv4(),
    name: 'Test Topic',
    content: 'Test Content',
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
    parentTopicId
});

export const createMockResource = (topicId: string): IResource => ({
    id: uuidv4(),
    topicId,
    url: 'https://example.com',
    description: 'Test Resource',
    type: ResourceType.ARTICLE,
    createdAt: new Date(),
    updatedAt: new Date()
}); 