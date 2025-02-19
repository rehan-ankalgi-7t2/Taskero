import ProjectModel from "./projectModel";
import { Types } from "mongoose";

interface ProjectData {
    tintColor?: string;
    title: string;
    description?: string;
    assignedUsers?: Types.ObjectId[];
    tasks?: Types.ObjectId[];
    status?: "Pending" | "In Progress" | "Completed";
    priority?: "Low" | "Medium" | "High";
    dueDate?: Date;
    createdBy: Types.ObjectId;
}

class ProjectService {
    // Create a new project
    static async createProject(data: ProjectData) {
        return await ProjectModel.create(data);
    }

    // Get all projects (optional filtering by user)
    static async getAllProjects(userId?: string) {
        const filter = userId ? { assignedUsers: userId } : {};
        return await ProjectModel.find(filter)
            .populate("createdBy", "name email")
            .populate("assignedUsers", "name email")
            .populate("tasks")
            .exec();
    }

    // Get a single project by ID
    static async getProjectById(projectId: string) {
        return await ProjectModel.findById(projectId)
            .populate("createdBy", "name email")
            .populate("assignedUsers", "name email")
            .populate("tasks")
            .exec();
    }

    // Update a project
    static async updateProject(projectId: string, data: Partial<ProjectData>) {
        return await ProjectModel.findByIdAndUpdate(projectId, data, { new: true });
    }

    // Delete a project
    static async deleteProject(projectId: string) {
        return await ProjectModel.findByIdAndDelete(projectId);
    }

    // Add an activity log to a project
    static async addActivity(
        projectId: string,
        action: string,
        performedBy: Types.ObjectId,
        details?: string
    ) {
        return await ProjectModel.findByIdAndUpdate(
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
    }
}

export default ProjectService;
