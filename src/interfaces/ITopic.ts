/**
 * @swagger
 * components:
 *   schemas:
 *     Topic:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - content
 *         - version
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the topic
 *         name:
 *           type: string
 *           description: Topic name
 *         content:
 *           type: string
 *           description: Topic content
 *         parentTopicId:
 *           type: string
 *           description: ID of the parent topic (if any)
 *         version:
 *           type: integer
 *           description: Current version number of the topic
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the topic was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the topic was last updated
 *     TopicVersion:
 *       type: object
 *       required:
 *         - id
 *         - topicId
 *         - content
 *         - version
 *         - createdAt
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the version
 *         topicId:
 *           type: string
 *           description: ID of the associated topic
 *         content:
 *           type: string
 *           description: Version content
 *         version:
 *           type: integer
 *           description: Version number
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the version was created
 */
export interface ITopic {
    id: string;
    name: string;
    content: string;
    parentTopicId?: string;
    version: number;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Interface for topic version history
 */
export interface ITopicVersion {
    id: string;
    topicId: string;
    version: number;
    content: string;
    createdAt: Date;
}

export interface ITopicHierarchy {
    topic: ITopic;
    subtopics: ITopicHierarchy[];
}

export interface ITopicPath {
    path: string[];
    distance: number;
} 