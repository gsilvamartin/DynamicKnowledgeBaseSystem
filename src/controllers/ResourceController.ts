import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { ResourceService } from '../services/ResourceService';
import { IResource, ResourceType } from '../interfaces/IResource';

export class ResourceController extends BaseController {
    private resourceService: ResourceService;

    constructor() {
        super();
        this.resourceService = new ResourceService();
    }

    createResource = this.handleAsyncError(async (req: Request, res: Response) => {
        const resource = await this.resourceService.createResource(req.body);
        this.sendResponse(res, resource, 201);
    });

    getResource = this.handleAsyncError(async (req: Request, res: Response) => {
        const resource = await this.resourceService.getById(req.params.id);
        if (!resource) {
            throw new Error('Resource not found');
        }
        this.sendResponse(res, resource);
    });

    updateResource = this.handleAsyncError(async (req: Request, res: Response) => {
        const resource = await this.resourceService.updateResource(req.params.id, req.body);
        this.sendResponse(res, resource);
    });

    deleteResource = this.handleAsyncError(async (req: Request, res: Response) => {
        const result = await this.resourceService.deleteResource(req.params.id);
        if (!result) {
            throw new Error('Resource not found');
        }
        this.sendResponse(res, { message: 'Resource deleted successfully' });
    });

    getTopicResources = this.handleAsyncError(async (req: Request, res: Response) => {
        const resources = await this.resourceService.getTopicResources(req.params.topicId);
        this.sendResponse(res, resources);
    });

    getResourcesByType = this.handleAsyncError(async (req: Request, res: Response) => {
        const type = req.params.type as ResourceType;
        const resources = await this.resourceService.getResourcesByType(type);
        this.sendResponse(res, resources);
    });
} 