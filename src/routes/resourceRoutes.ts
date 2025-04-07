import { Router } from 'express';
import { body } from 'express-validator';
import { ResourceController } from '../controllers/ResourceController';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../interfaces/IUser';
import { ResourceType } from '../interfaces/IResource';

const router = Router();
const resourceController = new ResourceController();

// Validation middleware
const createResourceValidation = [
    body('topicId').notEmpty().withMessage('Topic ID is required'),
    body('url').isURL().withMessage('Valid URL is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('type')
        .isIn(Object.values(ResourceType))
        .withMessage('Valid resource type is required'),
    validateRequest
];

const updateResourceValidation = [
    body('url').optional().isURL().withMessage('Valid URL is required'),
    body('description').optional().notEmpty().withMessage('Description is required'),
    body('type')
        .optional()
        .isIn(Object.values(ResourceType))
        .withMessage('Valid resource type is required'),
    validateRequest
];

/**
 * @swagger
 * /api/resources:
 *   post:
 *     summary: Create a new resource
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topicId
 *               - url
 *               - description
 *               - type
 *             properties:
 *               topicId:
 *                 type: string
 *                 description: ID of the associated topic
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: Resource URL
 *               description:
 *                 type: string
 *                 description: Resource description
 *               type:
 *                 type: string
 *                 enum: [ARTICLE, VIDEO, DOCUMENT, LINK]
 *                 description: Type of resource
 *     responses:
 *       201:
 *         description: Resource created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only ADMIN and EDITOR can create resources
 *       404:
 *         description: Associated topic not found
 */
router.post(
    '/',
    authenticate,
    authorize([UserRole.ADMIN, UserRole.EDITOR]),
    createResourceValidation,
    resourceController.createResource
);

/**
 * @swagger
 * /api/resources/{id}:
 *   get:
 *     summary: Get resource by ID
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Resource details
 *       404:
 *         description: Resource not found
 */
router.get('/:id', resourceController.getResource);

/**
 * @swagger
 * /api/resources/{id}:
 *   put:
 *     summary: Update resource
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: Updated resource URL
 *               description:
 *                 type: string
 *                 description: Updated resource description
 *               type:
 *                 type: string
 *                 enum: [ARTICLE, VIDEO, DOCUMENT, LINK]
 *                 description: Updated resource type
 *     responses:
 *       200:
 *         description: Resource updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only ADMIN and EDITOR can update resources
 *       404:
 *         description: Resource not found
 */
router.put(
    '/:id',
    authenticate,
    authorize([UserRole.ADMIN, UserRole.EDITOR]),
    updateResourceValidation,
    resourceController.updateResource
);

/**
 * @swagger
 * /api/resources/{id}:
 *   delete:
 *     summary: Delete a resource
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Resource deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only ADMIN can delete resources
 *       404:
 *         description: Resource not found
 */
router.delete(
    '/:id',
    authenticate,
    authorize([UserRole.ADMIN]),
    resourceController.deleteResource
);

/**
 * @swagger
 * /api/resources/topic/{topicId}:
 *   get:
 *     summary: Get resources by topic
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         schema:
 *           type: string
 *         description: Topic ID
 *     responses:
 *       200:
 *         description: List of resources for the topic
 *       404:
 *         description: Topic not found
 */
router.get('/topic/:topicId', resourceController.getTopicResources);

/**
 * @swagger
 * /api/resources/type/{type}:
 *   get:
 *     summary: Get resources by type
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ARTICLE, VIDEO, DOCUMENT, LINK]
 *         description: Resource type to filter by
 *     responses:
 *       200:
 *         description: List of resources of the specified type
 */
router.get('/type/:type', resourceController.getResourcesByType);

export const resourceRoutes = router; 