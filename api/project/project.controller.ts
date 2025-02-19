import { Request, Response } from "express";
import ProjectService from "./project.service";

class ProjectController {
    // Create a new project
    static async createProject(req: Request, res: Response): Promise<void> {
        try {
            const project = await ProjectService.createProject(req.body);
            res.status(201).json(project);
        } catch (error) {
            res.status(500).json({ error: "Failed to create project", details: error });
        }
    }

    // Get all projects
    static async getAllProjects(req: Request, res: Response): Promise<void> {
        try {
            const projects = await ProjectService.getAllProjects(req.query.userId as string);
            res.status(200).json(projects);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch projects", details: error });
        }
    }

    // Get a single project
    static async getProjectById(req: Request, res: Response): Promise<void> {
        try {
            const project = await ProjectService.getProjectById(req.params.id);
            if (!project) res.status(404).json({ error: "Project not found" });
            res.status(200).json(project);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch project", details: error });
        }
    }

    // Update project
    static async updateProject(req: Request, res: Response): Promise<void> {
        try {
            const project = await ProjectService.updateProject(req.params.id, req.body);
            if (!project) res.status(404).json({ error: "Project not found" });
            res.status(200).json(project);
        } catch (error) {
            res.status(500).json({ error: "Failed to update project", details: error });
        }
    }

    // Delete project
    static async deleteProject(req: Request, res: Response): Promise<void> {
        try {
            const project = await ProjectService.deleteProject(req.params.id);
            if (!project) res.status(404).json({ error: "Project not found" });
            res.status(200).json({ message: "Project deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: "Failed to delete project", details: error });
        }
    }

    // Add activity to project
    static async addActivity(req: Request, res: Response): Promise<void> {
        try {
            const { projectId, action, performedBy, details } = req.body;
            const project = await ProjectService.addActivity(projectId, action, performedBy, details);
            res.status(200).json(project);
        } catch (error) {
            res.status(500).json({ error: "Failed to add activity", details: error });
        }
    }
}

export default ProjectController;
