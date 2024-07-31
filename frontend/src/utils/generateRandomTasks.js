import { Avatar } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const randomTaskTypes = ['Bug', 'Feature', 'Improvement'];
const randomTaskStages = ['To Do', 'In Progress', 'Done'];

const randomName = () => {
  const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];
  return names[Math.floor(Math.random() * names.length)];
};

const generateRandomTasks = (numTasks = 20) => {
  return Array.from({ length: numTasks }, () => ({
    _id: uuidv4(),
    taskName: `Task ${Math.floor(Math.random() * 1000)}`,
    taskDescription: `Description for task ${Math.floor(Math.random() * 1000)}`,
    taskType: randomTaskTypes[Math.floor(Math.random() * randomTaskTypes.length)],
    // subtasks: Array.from({ length: Math.floor(Math.random() * 5) }, () => ({
    //   _id: uuidv4(),
    //   taskName: `Subtask ${Math.floor(Math.random() * 1000)}`
    // })),
    assignee: <Avatar  size='small'><AccountCircleIcon /></Avatar>,
    taskActivities: [],
    taskStage: randomTaskStages[Math.floor(Math.random() * randomTaskStages.length)],
    // taskComments: Array.from({ length: Math.floor(Math.random() * 10) }, () => ({
    //   _id: uuidv4()
    // })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
};

export default generateRandomTasks;
