import { Request, Response } from "express";
import ProjectService from "./project.service";
import handleResponse from "../utils/handleResponse";
import Project from "./projectModel";
import { aggregateWithPagination } from "../utils/paginationHelper";
import mongoose from "mongoose";
import { Todo } from "../todo/todoModel";

class ProjectController {
    // Create a new project
    static async createProject(req: Request, res: Response): Promise<void> {
        try {
            const newProjectBody = req.body;
            // check if the project is already created by the user
            const existingProject = await Project.findOne({title: newProjectBody.title})
            // status 409 if its present
            if(existingProject){
                res.status(409).send(handleResponse('', false, 409, 'Project already exists'))
            }

            // create a new project
            const createdProject = await Project.create(newProjectBody);
            // return the 200 result
            if(createdProject){
                res.status(201).send(handleResponse(createdProject, true, 201))
            } else {
                res.status(500).send(handleResponse('', false, 500, 'Project not created, something went wrong'))
            }
        } catch (error) {
            process.env.NODE_ENV === 'development' && console.log(`PROJECT :: createProject :: ${error}`);
            res.status(500).send(handleResponse('', false, 500, 'Something went wrong'));
        }
    }

    // Get all projects
    static async getAllProjects(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;
            const searchQuery = req.query.search;
            const { title } = req.query;
            const regexPattern = new RegExp(searchQuery as string, 'i');
            const query =
                searchQuery && searchQuery.length !== 0
                    ? {
                        $or: [{ title: regexPattern }]
                    }
                    : {};

            const pipeline = [
                {
                    $match: query
                }
            ]
            const data = await aggregateWithPagination(Project, pipeline, page, pageSize);

            if (data && data.data.length > 0) {
                res.status(200).send(handleResponse(data.data, true, 200, null, null, data.totalDocuments, data.totalPages, pageSize));
            } else {
                res.status(404).send(handleResponse('', false, 500, 'todos not found'));
            }
        } catch (error) {
            process.env.NODE_ENV === 'development' && console.log(`PROJECT :: getAllProjects :: ${error}`);
            res.status(500).send(handleResponse('', false, 500, 'Something went wrong'));
        }
    }

    // Get a single project
    static async getProjectById(req: Request, res: Response): Promise<void> {
        try {
            const projectId = req.params.id;
            // process.env.NODE_ENV === 'development' && console.log(JSON.stringify(req.params.id))
            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                res.status(400).json(handleResponse(null, false, 400, 'invalid project id'));
            }

            const data = await Project.findById(projectId);
            const relatedTodos = await Todo.find({projectId});

            if (data) {
                res.status(200).send(handleResponse(
                    {
                        projectData: data,
                        relatedTodos: relatedTodos.length > 0 ? relatedTodos : []
                    }, true, 200));
            } else {
                res.status(404).send(handleResponse('', false, 404, 'project not found'));
            }
        } catch (error) {
            process.env.NODE_ENV === 'development' && console.log(`PROJECT :: getProjectById :: ${error}`);
            res.status(500).send(handleResponse('', false, 500, 'Something went wrong'));
        }
    }

    // Update project
    static async updateProject(req: Request, res: Response): Promise<void> {
        try {
            const projectId = req.params.id;
            const updateProjectBody = req.body;

            if(!mongoose.Types.ObjectId.isValid(projectId)){
                res.status(400).send(handleResponse('', false, 400, 'invalid project id'));
            }

            const updatedProject = await Project.findByIdAndUpdate(projectId, updateProjectBody, {new: true});

            if(updatedProject){
                res.status(200).send(handleResponse(updatedProject, true, 200));
            } else {
                res.status(500).send(handleResponse('', false, 500, 'project data not updated, something went wrong'));
            }
        } catch (error) {
            process.env.NODE_ENV === 'development' && console.log(`PROJECT :: updateProject :: ${error}`);
            res.status(500).send(handleResponse('', false, 500, 'Something went wrong'));
        }
    }

    // Delete project
    static async deleteProject(req: Request, res: Response): Promise<void> {
        try {
            const projectId = req.params.id;

            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                res.status(400).send(handleResponse('', false, 400, 'invalid project id'));
            }

            await Project.findByIdAndDelete(projectId);

            const deletedProject = await Project.findById(projectId);

            if (deletedProject) {
                res.status(500).send(handleResponse('', false, 500, 'project data not updated, something went wrong'));
            } else {
                res.status(200).send(handleResponse('project deleted successfully', true, 200));
            }
        } catch (error) {
            process.env.NODE_ENV === 'development' && console.log(`PROJECT :: deleteProject :: ${error}`);
            res.status(500).send(handleResponse('', false, 500, 'Something went wrong'));
        }
    }

    // Add activity to project
    static async addActivity(req: Request, res: Response): Promise<void> {
        try {
            const { projectId, action, performedBy, details } = req.body;
            const updatedProject = await Project.findByIdAndUpdate(
                projectId,
                {
                    $push: {
                        activities: {
                            action,
                            performedBy,
                            timestamp: new Date(),
                            details,
                        },
                    },
                },
                { new: true }
            );

            if (updatedProject) {
                res.status(200).send(handleResponse('activity added successfully', true, 200));
            } else {
                res.status(500).send(handleResponse('', false, 500, 'activity not added, something went wrong'));
            }
        } catch (error) {
            process.env.NODE_ENV === 'development' && console.log(`PROJECT :: addActivity :: ${error}`);
            res.status(500).send(handleResponse('', false, 500, 'Something went wrong'));
        }
    }
}

export default ProjectController;
