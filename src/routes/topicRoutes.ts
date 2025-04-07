import { Router } from 'express';
import { body } from 'express-validator';
import { TopicController } from '../controllers/TopicController';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../interfaces/IUser';

const router = Router();
const topicController = new TopicController();

// Validation middleware
const createTopicValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('parentTopicId').optional().isString().withMessage('Parent topic ID must be a string'),
    validateRequest
];

const updateTopicValidation = [
    body('content').notEmpty().withMessage('Content is required'),
    validateRequest
];

/**
 * @swagger
 * /api/topics:
 *   post:
 *     summary: Create a new topic
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - content
 *             properties:
 *               name:
 *                 type: string
 *                 description: Topic name
 *               content:
 *                 type: string
 *                 description: Topic content
 *               parentTopicId:
 *                 type: string
 *                 description: ID of the parent topic (optional)
 *     responses:
 *       201:
 *         description: Topic created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only ADMIN and EDITOR can create topics
 */
router.post(
    '/',
    authenticate,
    authorize([UserRole.ADMIN, UserRole.EDITOR]),
    createTopicValidation,
    topicController.createTopic
);

/**
 * @swagger
 * /api/topics/{id}:
 *   get:
 *     summary: Get topic by ID
 *     tags: [Topics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Topic ID
 *     responses:
 *       200:
 *         description: Topic details
 *       404:
 *         description: Topic not found
 */
router.get('/:id', topicController.getTopic);

/**
 * @swagger
 * /api/topics/{id}:
 *   put:
 *     summary: Update topic content
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Topic ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Updated topic content
 *     responses:
 *       200:
 *         description: Topic updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only ADMIN and EDITOR can update topics
 *       404:
 *         description: Topic not found
 */
router.put(
    '/:id',
    authenticate,
    authorize([UserRole.ADMIN, UserRole.EDITOR]),
    updateTopicValidation,
    topicController.updateTopic
);

/**
 * @swagger
 * /api/topics/{id}:
 *   delete:
 *     summary: Delete a topic
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Topic ID
 *     responses:
 *       200:
 *         description: Topic deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only ADMIN can delete topics
 *       404:
 *         description: Topic not found
 */
router.delete(
    '/:id',
    authenticate,
    authorize([UserRole.ADMIN]),
    topicController.deleteTopic
);

/**
 * @swagger
 * /api/topics/{id}/versions:
 *   get:
 *     summary: Get topic version history
 *     tags: [Topics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Topic ID
 *     responses:
 *       200:
 *         description: List of topic versions
 *       404:
 *         description: Topic not found
 */
router.get('/:id/versions', topicController.getTopicVersions);

/**
 * @swagger
 * /api/topics/{id}/version/{version}:
 *   get:
 *     summary: Get specific version of a topic
 *     tags: [Topics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Topic ID
 *       - in: path
 *         name: version
 *         required: true
 *         schema:
 *           type: integer
 *         description: Version number
 *     responses:
 *       200:
 *         description: Topic version details
 *       404:
 *         description: Topic or version not found
 */
router.get('/:id/version/:version', topicController.getTopicVersion);

/**
 * @swagger
 * /api/topics/{id}/hierarchy:
 *   get:
 *     summary: Get topic hierarchy
 *     tags: [Topics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Topic ID
 *     responses:
 *       200:
 *         description: Topic hierarchy tree
 *       404:
 *         description: Topic not found
 */
router.get('/:id/hierarchy', topicController.getTopicHierarchy);

/**
 * @swagger
 * /api/topics/{startId}/path/{endId}:
 *   get:
 *     summary: Find shortest path between two topics
 *     tags: [Topics]
 *     parameters:
 *       - in: path
 *         name: startId
 *         required: true
 *         schema:
 *           type: string
 *         description: Starting topic ID
 *       - in: path
 *         name: endId
 *         required: true
 *         schema:
 *           type: string
 *         description: Ending topic ID
 *     responses:
 *       200:
 *         description: Shortest path between topics
 *       404:
 *         description: One or both topics not found
 */
router.get('/:startId/path/:endId', topicController.findShortestPath);

export const topicRoutes = router; 