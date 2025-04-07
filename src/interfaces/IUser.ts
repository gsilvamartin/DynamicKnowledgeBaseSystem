/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - role
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the user
 *         name:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         role:
 *           type: string
 *           enum: [ADMIN, EDITOR, VIEWER]
 *           description: User's role in the system
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was last updated
 */
export enum UserRole {
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR',
    VIEWER = 'VIEWER'
}

/**
 * Interface representing a User in the knowledge base
 */
export interface IUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
} 