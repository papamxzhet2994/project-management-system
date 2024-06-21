<script>
    import Card from "../lib/Card.svelte";
    import Modal from "../lib/Modal.svelte";
    import { columns, isModalOpen, modalColumn, tasks, taskCounts, statuses, toggleColumn, openModal, closeModal, addTask, handleDragStart, handleDrop, handleDragOver, isExpandedGap } from '../lib/store';

 
    columns.subscribe(value => {
        isExpandedGap.set(Object.values(value).every(v => v === false));
    });

    let issues = [];
    tasks.subscribe(value => {
        issues = value;
    });
</script>

<style>
    .collapsed {
        @apply w-8 ml-2 transition-[width] duration-[0.3s] ease-[ease-out];
    }

    .collapsed span, .collapsed img {
       @apply -rotate-90;
    }

    .expanded {
      @apply w-3/12 transition-[width] duration-[0.3s] ease-[ease-in];
    }

    .column-header {
      @apply cursor-pointer origin-[0] transition-transform duration-[0.3s] ease-[ease-out];
    }

    .collapsed-header {
      @apply rotate-90 transition-transform duration-[0.3s] ease-[ease-out] w-max h-2 relative ;
    }

    .card-container {
      @apply transition-opacity duration-[0.3s] ease-[ease-out];
    }
</style>

<header class="font-[JetBrains Mono] flex justify-between p-6"></header>
<aside class="font-[JetBrains Mono] float-left p-4 w-[350px]"></aside>

<main class="ml-350 flex text-sm p-8 min-h-screen border border-neutral-800 border-r-0 border-b-0 overflow-y-auto">
    {#each Object.keys($columns) as column}
        <section role="application" class="{ $columns[column] ? 'collapsed' : 'expanded' } { $isExpandedGap ? 'mx-4' : 'mx-1' } group"
            on:drop={(event) => handleDrop(event, column)}
            on:dragover={handleDragOver}>
            <div class="flex justify-between mb-3 w-[350px] column-header { $columns[column] ? 'collapsed-header' : '' }" >
                <div class="flex justify-between items-center">
                        <img src={`./Icon-${column}.svg`} alt={`${column}-icon`} class="mr-3">
                        <h1 class="text-white flex flex-wrap text-base font-medium">
                            <p class="first-letter:uppercase">{column.slice(0).replace('_', ' ')}</p>
                        </h1>
                        <span class="counter text-neutral-500 ml-4 mr-4 text-xs">{$taskCounts[column]}</span>
                </div>
                <div class="flex items-center gap-4">
                        <button class="flex w-3.5 h-3.5" on:click={() => toggleColumn(column)}>
                            <img src={ $columns[column] ? "./Action-Icon1.svg" : "./Action-Icon.svg" } alt="toggle-icon">
                        </button>
                        <button class="flex w-3.5 h-3.5" on:click={() => openModal(column)}>
                            <img src="./Action-Icon2.svg" alt="user-icon">
                        </button>
                    </div>
                </div>
            <div class="card-container { $columns[column] ? 'hidden' : 'visible' }">
                {#each $tasks.filter(task => task.status?.value === column) as task}
                    <Card {task} on:dragstart={(event) => handleDragStart(event, task)} draggable="true"/>
                {/each}
            </div>
            <button class="text-blue-700 group flex ml-3 items-center mt-4 opacity-0 { $columns[column] ? '' : 'group-hover:opacity-100' } transition-opacity duration-500" on:click={() => openModal(column)}>
                <img src="./Icon-add.svg" alt="add-icon" class="w-4 mr-2">Создать задачу
            </button>
            <Modal bind:isOpen={$isModalOpen} {modalColumn} on:close={closeModal} on:saveTask={(event) => addTask(event.detail)}/>
        </section>
    {/each}
</main>