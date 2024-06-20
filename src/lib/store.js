import { writable, derived } from 'svelte/store';

export const columns = writable({
    backlog: false,
    open: false,
    in_progress: false,
    done: false,
    cancelled: false
});

export function toggleColumn(column) {
    columns.update(state => {
        state[column] = !state[column];
        if (typeof window !== 'undefined') {
            localStorage.setItem(column, state[column]);
        }
        return state;
    });
}

columns.update(state => {
    if (typeof window !== 'undefined') {
        for (let column in state) {
            let savedState = localStorage.getItem(column);
            if (savedState !== null) {
                state[column] = savedState === 'true';
            }
        }
    }
    return state;
});

export const isModalOpen = writable(false);
export const modalColumn = writable(null);
export const tasks = writable([]);
export let taskIdCounter = 1;
export const isExpandedGap = writable(false);

export const statuses = [
    { value: 'backlog', label: 'Backlog', icon: './Icon-backlog.svg' },
    { value: 'open', label: 'Открыто', icon: './Icon-open.svg' },
    { value: 'in_progress', label: 'В процессе', icon: './Icon-in_progress.svg' },
    { value: 'done', label: 'Завершен', icon: './Icon-done.svg' },
    { value: 'cancelled', label: 'Отменен', icon: './Icon-cancelled.svg' }
];

if (typeof window !== 'undefined') {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        tasks.set(parsedTasks);
        taskIdCounter = Math.max(...parsedTasks.map(task => task.id)) + 1;
    }
}

export function openModal(column) {
    modalColumn.set(column);
    isModalOpen.set(true);
}

export function closeModal() {
    isModalOpen.set(false);
}

export function addTask(task) {
    task.id = taskIdCounter++;
    tasks.update(currentTasks => {
        const updatedTasks = [...currentTasks, task];
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        return updatedTasks;
    });
}

export function updateTask(updatedTask) {
    tasks.update(currentTasks => {
        const updatedTasks = currentTasks.map(task => task.id === updatedTask.id ? updatedTask : task);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        return updatedTasks;
    });
}

export function handleDragStart(event, task) {
    event.dataTransfer.setData("text/plain", JSON.stringify(task));
    event.dataTransfer.effectAllowed = "move";
}

export function handleDrop(event, column) {
    event.preventDefault();
    const taskData = event.dataTransfer.getData("text/plain");
    if (taskData) {
        const task = JSON.parse(taskData);
        task.status = statuses.find(s => s.value === column);
        updateTask(task);
    }
}

export function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

export const taskCounts = derived(tasks, $tasks => {
    const counts = {
        backlog: 0,
        open: 0,
        in_progress: 0,
        done: 0,
        cancelled: 0
    };
    $tasks.forEach(task => {
        if (task.status && counts.hasOwnProperty(task.status.value)) {
            counts[task.status.value]++;
        }
    });
    return counts;
});
