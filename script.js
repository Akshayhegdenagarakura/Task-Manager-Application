
/*document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskModal = document.getElementById('task-modal');
    const closeModal = document.querySelector('.close');
    const taskForm = document.getElementById('task-form');
    const modalTitle = document.getElementById('modal-title');

    let tasks = [];
    let isEditMode = false;
    let editTaskId = null;

    const apiUrl = 'http://localhost:3000/tasks';

    const fetchTasks = async () => {
        const response = await fetch(apiUrl);
        tasks = await response.json();
        renderTasks();
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach((task) => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            taskItem.innerHTML = `
                <div>
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <p>Due: ${task.dueDate}</p>
                </div>
                <div>
                    <button onclick="editTask(${task.id})">Edit</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    };

    const resetForm = () => {
        taskForm.reset();
        isEditMode = false;
        editTaskId = null;
        modalTitle.innerText = 'Add Task';
    };

    const openModal = () => {
        taskModal.style.display = 'block';
    };

    const closeModalFunction = () => {
        taskModal.style.display = 'none';
        resetForm();
    };

    addTaskBtn.addEventListener('click', openModal);
    closeModal.addEventListener('click', closeModalFunction);

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(taskForm);
        const newTask = {
            title: formData.get('title'),
            description: formData.get('description'),
            dueDate: formData.get('due-date')
        };
        
        if (isEditMode) {
            await fetch(`${apiUrl}/${editTaskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask)
            });
        } else {
            await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask)
            });
        }
        
        fetchTasks();
        closeModalFunction();
    });

    const fetchSingleTaskById = async (id) => {
        const response = await fetch(`${apiUrl}/${id}`);
        return await response.json();
    };

    window.editTask = async (id) => {
        isEditMode = true;
        editTaskId = id;
        modalTitle.innerText = 'Edit Task';
        const task = await fetchSingleTaskById(id);
        taskForm.title.value = task.title;
        taskForm.description.value = task.description;
        taskForm['due-date'].value = task.dueDate;
        openModal();
    };

    window.deleteTask = async (id) => {
        await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });
        fetchTasks();
    };

    fetchTasks();
});
*/

document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskModal = document.getElementById('task-modal');
    const closeModal = document.querySelector('.close');
    const taskForm = document.getElementById('task-form');
    const modalTitle = document.getElementById('modal-title');

    // Variables
    let tasks = [];
    let isEditMode = false;
    let editTaskId = null;
    const apiUrl = 'http://localhost:3000/tasks';

    // Functions

    // Fetch tasks from the API
    const fetchTasks = async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            tasks = await response.json();
            renderTasks();
        } catch (error) {
            console.error(error.message);
        }
    };

    // Render tasks in the task list
    const renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach((task) => {
            const taskItem = createTaskElement(task);
            taskList.appendChild(taskItem);
        });
    };

    // Create HTML element for a task
    const createTaskElement = (task) => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.innerHTML = `
            <div>
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p>Due: ${task.dueDate}</p>
            </div>
            <div>
                <button class="edit-button" onclick="editTask(${task.id})">Edit</button>
                <button class="delete-button" onclick="deleteTask(${task.id})">Delete</button>
            </div>

            
        `;
        return taskItem;
    };

    // Reset the task form and modal state
    const resetForm = () => {
        taskForm.reset();
        isEditMode = false;
        editTaskId = null;
        modalTitle.innerText = 'Add Task';
    };

    // Open the task modal
    const openModal = () => {
        taskModal.style.display = 'block';
    };

    // Close the task modal
    const closeModalFunction = () => {
        taskModal.style.display = 'none';
        resetForm();
    };

    // Event listeners
    addTaskBtn.addEventListener('click', openModal);
    closeModal.addEventListener('click', closeModalFunction);

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(taskForm);
        const newTask = {
            title: formData.get('title'),
            description: formData.get('description'),
            dueDate: formData.get('due-date')
        };
        
        try {
            const method = isEditMode ? 'PUT' : 'POST';
            const url = isEditMode ? `${apiUrl}/${editTaskId}` : apiUrl;
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask)
            });

            if (!response.ok) {
                throw new Error('Failed to save task');
            }

            fetchTasks();
            closeModalFunction();
        } catch (error) {
            console.error(error.message);
        }
    });

    // Edit a task
    window.editTask = async (id) => {
        isEditMode = true;
        editTaskId = id;
        modalTitle.innerText = 'Edit Task';
        try {
            const task = await fetchSingleTaskById(id);
            taskForm.title.value = task.title;
            taskForm.description.value = task.description;
            taskForm['due-date'].value = task.dueDate;
            openModal();
        } catch (error) {
            console.error(error.message);
        }
    };

    // Delete a task
    window.deleteTask = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            fetchTasks();
        } catch (error) {
            console.error(error.message);
        }
    };

    // Fetch a single task by its ID
    const fetchSingleTaskById = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch task details');
            }
            return await response.json();
        } catch (error) {
            console.error(error.message);
        }
    };

    // Initial fetch of tasks
    fetchTasks();
});
