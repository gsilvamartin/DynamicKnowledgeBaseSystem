import { Router } from 'express';
import { body } from 'express-validator';
import { UserController } from '../controllers/UserController';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../interfaces/IUser';

const router = Router();
const userController = new UserController();

// Validation middleware
const createUserValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('role')
        .isIn(Object.values(UserRole))
        .withMessage('Valid user role is required'),
    validateRequest
];

const updateUserRoleValidation = [
    body('role')
        .isIn(Object.values(UserRole))
        .withMessage('Valid user role is required'),
    validateRequest
];

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
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
 *               - email
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               role:
 *                 type: string
 *                 enum: [ADMIN, EDITOR, VIEWER]
 *                 description: User's role in the system
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only ADMIN can create users
 */
router.post(
    '/',
    authenticate,
    authorize([UserRole.ADMIN]),
    createUserValidation,
    userController.createUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get('/:id', userController.getUser);

/**
 * @swagger
 * /api/users/{id}/role:
 *   put:
 *     summary: Update user role
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [ADMIN, EDITOR, VIEWER]
 *                 description: New role for the user
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only ADMIN can update roles
 *       404:
 *         description: User not found
 */
router.put(
    '/:id/role',
    authenticate,
    authorize([UserRole.ADMIN]),
    updateUserRoleValidation,
    userController.updateUserRole
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only ADMIN can delete users
 *       404:
 *         description: User not found
 */
router.delete(
    '/:id',
    authenticate,
    authorize([UserRole.ADMIN]),
    userController.deleteUser
);

/**
 * @swagger
 * /api/users/email/{email}:
 *   get:
 *     summary: Get user by email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: User's email address
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get('/email/:email', userController.getUserByEmail);

/**
 * @swagger
 * /api/users/role/{role}:
 *   get:
 *     summary: Get users by role
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ADMIN, EDITOR, VIEWER]
 *         description: User role to filter by
 *     responses:
 *       200:
 *         description: List of users with the specified role
 */
router.get('/role/:role', userController.getUsersByRole);

export const userRoutes = router; 