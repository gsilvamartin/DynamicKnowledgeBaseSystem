import { Request, Response, NextFunction } from 'express';
import { TopicService } from '../services/TopicService';
import { BaseController } from './BaseController';
import { AppError } from '../utils/AppError';
import { ITopic } from '../interfaces/ITopic';

export class TopicController extends BaseController {
    private topicService: TopicService;

    constructor() {
        super();
        this.topicService = new TopicService();
    }

    createTopic = this.handleAsyncError(async (req: Request, res: Response) => {
        const topic = await this.topicService.createTopic(req.body);
        this.sendResponse(res, topic, 201);
    });

    getTopic = this.handleAsyncError(async (req: Request, res: Response) => {
        const topic = await this.topicService.getById(req.params.id);
        if (!topic) {
            throw new Error('Topic not found');
        }
        this.sendResponse(res, topic);
    });

    updateTopic = this.handleAsyncError(async (req: Request, res: Response) => {
        const { content } = req.body;
        const topic = await this.topicService.updateTopic(req.params.id, content);
        this.sendResponse(res, topic);
    });

    deleteTopic = this.handleAsyncError(async (req: Request, res: Response) => {
        const result = await this.topicService.delete(req.params.id);
        if (!result) {
            throw new Error('Topic not found');
        }
        this.sendResponse(res, { message: 'Topic deleted successfully' });
    });

    getTopicVersions = this.handleAsyncError(async (req: Request, res: Response) => {
        const versions = await this.topicService.getTopicVersions(req.params.id);
        this.sendResponse(res, versions);
    });

    getTopicVersion = this.handleAsyncError(async (req: Request, res: Response) => {
        const version = await this.topicService.getTopicVersion(
            req.params.id,
            parseInt(req.params.version)
        );
        if (!version) {
            throw new Error('Version not found');
        }
        this.sendResponse(res, version);
    });

    getTopicHierarchy = this.handleAsyncError(async (req: Request, res: Response) => {
        const hierarchy = await this.topicService.getTopicHierarchy(req.params.id);
        this.sendResponse(res, hierarchy);
    });

    findShortestPath = this.handleAsyncError(async (req: Request, res: Response) => {
        const path = await this.topicService.findShortestPath(
            req.params.startId,
            req.params.endId
        );
        this.sendResponse(res, path);
    });
} 