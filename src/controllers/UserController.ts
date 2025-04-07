import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { UserService } from '../services/UserService';
import { IUser, UserRole } from '../interfaces/IUser';

export class UserController extends BaseController {
    private userService: UserService;

    constructor() {
        super();
        this.userService = new UserService();
    }

    createUser = this.handleAsyncError(async (req: Request, res: Response) => {
        const user = await this.userService.createUser(req.body);
        this.sendResponse(res, user, 201);
    });

    getUser = this.handleAsyncError(async (req: Request, res: Response) => {
        const user = await this.userService.getById(req.params.id);
        if (!user) {
            throw new Error('User not found');
        }
        this.sendResponse(res, user);
    });

    updateUserRole = this.handleAsyncError(async (req: Request, res: Response) => {
        const { role } = req.body;
        const user = await this.userService.updateUserRole(req.params.id, role as UserRole);
        this.sendResponse(res, user);
    });

    deleteUser = this.handleAsyncError(async (req: Request, res: Response) => {
        const result = await this.userService.deleteUser(req.params.id);
        if (!result) {
            throw new Error('User not found');
        }
        this.sendResponse(res, { message: 'User deleted successfully' });
    });

    getUserByEmail = this.handleAsyncError(async (req: Request, res: Response) => {
        const user = await this.userService.getUserByEmail(req.params.email);
        if (!user) {
            throw new Error('User not found');
        }
        this.sendResponse(res, user);
    });

    getUsersByRole = this.handleAsyncError(async (req: Request, res: Response) => {
        const users = await this.userService.getUsersByRole(req.params.role as UserRole);
        this.sendResponse(res, users);
    });
} 