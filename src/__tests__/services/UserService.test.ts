import { UserService } from '../../services/UserService';
import { UserRole } from '../../interfaces/IUser';
import { AppError } from '../../utils/AppError';

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService();
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                role: UserRole.VIEWER
            };

            const user = await userService.createUser(userData);

            expect(user).toBeDefined();
            expect(user.name).toBe(userData.name);
            expect(user.email).toBe(userData.email);
            expect(user.role).toBe(userData.role);
            expect(user.id).toBeDefined();
            expect(user.createdAt).toBeDefined();
        });

        it('should throw error if required fields are missing', async () => {
            const invalidUserData = {
                name: 'Test User',
                email: 'test@example.com'
            };

            await expect(userService.createUser(invalidUserData as any)).rejects.toThrow(AppError);
        });

        it('should throw error if user role is invalid', async () => {
            const invalidUserData = {
                name: 'Test User',
                email: 'test@example.com',
                role: 'invalid-role' as UserRole
            };

            await expect(userService.createUser(invalidUserData)).rejects.toThrow(AppError);
        });

        it('should throw error if email is invalid', async () => {
            const invalidUserData = {
                name: 'Test User',
                email: 'invalid-email',
                role: UserRole.VIEWER
            };

            await expect(userService.createUser(invalidUserData)).rejects.toThrow(AppError);
        });

        it('should throw error if user with email already exists', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                role: UserRole.VIEWER
            };

            await userService.createUser(userData);
            await expect(userService.createUser(userData)).rejects.toThrow(AppError);
        });
    });

    describe('updateUserRole', () => {
        it('should update user role', async () => {
            const user = await userService.createUser({
                name: 'Test User',
                email: 'test@example.com',
                role: UserRole.VIEWER
            });

            const updatedUser = await userService.updateUserRole(user.id, UserRole.EDITOR);

            expect(updatedUser.role).toBe(UserRole.EDITOR);
            expect(updatedUser.name).toBe(user.name);
            expect(updatedUser.email).toBe(user.email);
        });

        it('should throw error if user does not exist', async () => {
            await expect(userService.updateUserRole('non-existent-id', UserRole.EDITOR)).rejects.toThrow(AppError);
        });
    });

    describe('getUserByEmail', () => {
        it('should return user by email', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                role: UserRole.VIEWER
            };

            const createdUser = await userService.createUser(userData);
            const foundUser = await userService.getUserByEmail(userData.email);

            expect(foundUser).toBeDefined();
            expect(foundUser?.id).toBe(createdUser.id);
            expect(foundUser?.email).toBe(userData.email);
        });

        it('should return undefined if user does not exist', async () => {
            const user = await userService.getUserByEmail('non-existent@example.com');
            expect(user).toBeUndefined();
        });
    });

    describe('getUsersByRole', () => {
        it('should return all users with specified role', async () => {
            await userService.createUser({
                name: 'Viewer 1',
                email: 'viewer1@example.com',
                role: UserRole.VIEWER
            });

            await userService.createUser({
                name: 'Viewer 2',
                email: 'viewer2@example.com',
                role: UserRole.VIEWER
            });

            await userService.createUser({
                name: 'Editor 1',
                email: 'editor1@example.com',
                role: UserRole.EDITOR
            });

            const viewers = await userService.getUsersByRole(UserRole.VIEWER);
            expect(viewers).toHaveLength(2);
            expect(viewers.every(u => u.role === UserRole.VIEWER)).toBe(true);

            const editors = await userService.getUsersByRole(UserRole.EDITOR);
            expect(editors).toHaveLength(1);
            expect(editors[0].role).toBe(UserRole.EDITOR);
        });

        it('should return empty array if no users with role exist', async () => {
            const users = await userService.getUsersByRole(UserRole.ADMIN);
            expect(users).toHaveLength(0);
        });
    });

    describe('deleteUser', () => {
        it('should delete an existing user', async () => {
            const user = await userService.createUser({
                name: 'Test User',
                email: 'test@example.com',
                role: UserRole.VIEWER
            });

            const result = await userService.deleteUser(user.id);
            expect(result).toBe(true);

            const deletedUser = await userService.getById(user.id);
            expect(deletedUser).toBeUndefined();
        });

        it('should return false if user does not exist', async () => {
            const result = await userService.deleteUser('non-existent-id');
            expect(result).toBe(false);
        });
    });
}); 