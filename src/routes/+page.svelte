<script>
    import Card from "../lib/Card.svelte";
    import { writable, derived } from 'svelte/store';
    import Modal from "../lib/Modal.svelte";

    const columns = writable({
        backlog: false,
        open: false,
        in_progress: false,
        done: false,
        cancelled: false
    });

    function toggleColumn(column) {
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

    const isModalOpen = writable(false);
    const modalColumn = writable(null);
    const tasks = writable([]);
    let taskIdCounter = 1;

    const statuses = [
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

    function openModal(column) {
        modalColumn.set(column);
        isModalOpen.set(true);
    }

    function closeModal() {
        isModalOpen.set(false);
    }

    function addTask(task) {
        task.id = taskIdCounter++;
        tasks.update(currentTasks => {
            const updatedTasks = [...currentTasks, task];
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            return updatedTasks;
        });
    }

    function handleDragStart(event, task) {
        event.dataTransfer.setData("text/plain", JSON.stringify(task));
        event.dataTransfer.effectAllowed = "move";
    }

    function handleDrop(event, column) {
        event.preventDefault();
        const taskData = event.dataTransfer.getData("text/plain");
        if (taskData) {
            const task = JSON.parse(taskData);
            task.status = statuses.find(s => s.value === column);
            tasks.update(currentTasks => {
                const updatedTasks = currentTasks.map(t => t.id === task.id ? task : t);
                localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                return updatedTasks;
            });
        }
    }

    function handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }

    const taskCounts = derived(tasks, $tasks => {
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
</script>

<style>
    .collapsed {
        width: 25px;
        transition: width 0.3s ease-out;
        font-family: 'JetBrains Mono', monospace;
    }

    .collapsed span, .collapsed img {
        rotate: -90deg;
    }

    .expanded {
        width: 25%;
        transition: width 0.3s ease-in;
    }

    .column-header {
        cursor: pointer;
        transform-origin: left center;   
        transition: transform 0.3s ease-out;
    }

    .collapsed-header {
        transform: rotate(90deg);
        margin-right: 10px;
        position: relative;
        top: -11px;
        transition: transform 0.3s ease-out;
        width: max-content;
    }

    .card-container {
        transition: opacity 0.3s ease-out;
    }
</style>

<header class="font-[JetBrains Mono] flex justify-between p-4"></header>
<aside class="font-[JetBrains Mono] float-left p-4 w-[350px]"></aside>

<main class="font-[JetBrains Mono] text-sm flex gap-4 p-8 m-4 border-neutral-800 border min-h-screen border-r-0 border-b-0">
    {#each Object.keys($columns) as column}
        <section class="font-[JetBrains Mono] relative { $columns[column] ? 'collapsed' : 'expanded' } group"
            on:drop={(event) => handleDrop(event, column)}
            on:dragover={handleDragOver}>
            <div class="flex justify-between w-[350px] column-header { $columns[column] ? 'collapsed-header' : '' }" >
                <div class="flex items-center mb-2 gap-2">
                    <h1 class="text-white flex flex-wrap text-base font-medium">
                        <img src={`./Icon-${column}.svg`} alt={`${column}-icon`} class="mr-3">{column.charAt(0).toUpperCase() + column.slice(1).replace('_', ' ')}
                    </h1>
                    <span class="counter text-neutral-500 ml-2 mr-2 text-[12px]">{$taskCounts[column]}</span>
                </div>
                <div class="flex items-center gap-2 mb-2">
                    <button class="flex" on:click={() => toggleColumn(column)}>
                        <img src={ $columns[column] ? "./Action-Icon1.svg" : "./Action-Icon.svg" } alt="toggle-icon" class="ml-2">
                    </button>
                    <button class="flex" on:click={() => openModal(column)}>
                        <img src="./Action-Icon2.svg" alt="user-icon" class="ml-2">
                    </button>
                </div>
            </div>
            <div class="card-container { $columns[column] ? 'hidden' : 'visible' }">
                {#each $tasks.filter(task => task.status?.value === column) as task}
                    <Card {task} on:dragstart={(event) => handleDragStart(event, task)} draggable="true"/>
                {/each}
            </div>
            <button class="text-blue-700 group flex items-center mt-8 opacity-0 { $columns[column] ? '' : 'group-hover:opacity-100' } transition-opacity duration-500" on:click={() => openModal(column)}>
                <img src="./Icon-add.svg" alt="add-icon" class="w-4 mr-2">Создать задачу
            </button>
            <Modal bind:isOpen={$isModalOpen} {modalColumn} on:close={closeModal} on:saveTask={(event) => addTask(event.detail)}/>
        </section>
    {/each}
</main>
