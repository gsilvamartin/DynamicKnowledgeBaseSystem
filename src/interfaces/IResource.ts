/**
 * @swagger
 * components:
 *   schemas:
 *     Resource:
 *       type: object
 *       required:
 *         - id
 *         - topicId
 *         - url
 *         - description
 *         - type
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the resource
 *         topicId:
 *           type: string
 *           description: ID of the associated topic
 *         url:
 *           type: string
 *           format: uri
 *           description: Resource URL
 *         description:
 *           type: string
 *           description: Resource description
 *         type:
 *           type: string
 *           enum: [ARTICLE, VIDEO, DOCUMENT, LINK]
 *           description: Type of resource
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the resource was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the resource was last updated
 */
export enum ResourceType {
    ARTICLE = 'ARTICLE',
    VIDEO = 'VIDEO',
    DOCUMENT = 'DOCUMENT',
    LINK = 'LINK'
}

/**
 * Interface representing a Resource in the knowledge base
 */
export interface IResource {
    id: string;
    topicId: string;
    url: string;
    description: string;
    type: ResourceType;
    createdAt: Date;
    updatedAt: Date;
} 