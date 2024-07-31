import { Box, Button, Container, Tab, Tabs, Typography, Modal } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ActionTable from '../components/ActionTable';
import generateRandomTasks from '../utils/generateRandomTasks';
import Board from './Board';
import CustomTabPanel from '../components/CustomTabPanel';
import AddIcon from '@mui/icons-material/Add';

const columns = [
  { id: 'taskName', label: 'Task Name' },
  { id: 'taskDescription', label: 'Task Description' },
  { id: 'taskType', label: 'Task Type' },
  { id: 'assignee', label: 'Assignee', format: (value) => value?.name || 'Unassigned' },
  { id: 'taskStage', label: 'Task Stage' },
  { id: 'subtasks', label: 'Subtasks', format: (value) => value.length },
  { id: 'taskComments', label: 'Comments', format: (value) => value.length },
  { id: 'createdAt', label: 'Created At', format: (value) => new Date(value).toLocaleDateString() },
  { id: 'updatedAt', label: 'Updated At', format: (value) => new Date(value).toLocaleDateString() },
];

const actions = [
  {
    label: 'Edit',
    color: 'primary',
    onClick: (row) => { console.log('Edit:', row); }
  },
  {
    label: 'Delete',
    color: 'secondary',
    onClick: (row) => { console.log('Delete:', row); }
  }
];


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const addTaskModalStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {xs: '88%', sm: '80%', md: '50%', xl: '40%'},
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [isOpenAddTaskModal, setIsOpenAddTaskModal] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddTaskModalClose = () => {
    setIsOpenAddTaskModal(false);
  }

  const handleOpenAddTaskModal = () => {
    setIsOpenAddTaskModal(true);
  }

  useEffect(() => {
    const randomTasks = generateRandomTasks();
    console.log(randomTasks);
    setTasks(randomTasks);
  }, []);


  return (
    <Container maxWidth='xl' className='my-5'>
      <h1>Hello Rehan</h1>
      <p>take a look at upcoming tasks</p>
      
      <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="List View" {...a11yProps(0)} />
          <Tab label="Board View" {...a11yProps(1)} />
        </Tabs>
        <Button variant='contained' color='secondary' endIcon={<AddIcon/>} className='m-2' onClick={handleOpenAddTaskModal}>Add New Task</Button>
      </Box>
      
      <CustomTabPanel value={tabValue} index={0}>
        <ActionTable columns={columns} actions={actions} tableData={tasks}/>
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        <Board/>
      </CustomTabPanel>
    </Box>
    <Modal
            open={isOpenAddTaskModal}
            onClose={handleAddTaskModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={addTaskModalStyles}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Text in a modal
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                </Typography>
            </Box>
        </Modal>
    </Container>  
  )
}


export default Home
