<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import Dropdown from './Dropdown.svelte';

    export let isOpen = false;
    export let onClose = () => {
        isOpen = false;
    };
    export let modalColumn = null;

    const dispatch = createEventDispatcher();

    let title = "";
    let description = "";
    let openDropdown = null;
    let status = null;
    let priority = null;
    let assignee = null;
    let label = null;
    let startDate = new Date().toISOString().slice(0, 10);
    let endDate = new Date().toISOString().slice(0, 10);

    let statuses = [
        { value: 'backlog', label: 'Backlog', icon: './Icon-backlog.svg' },
        { value: 'open', label: 'Открыто', icon: './Icon-open.svg' },
        { value: 'in_progress', label: 'В процессе', icon: './Icon-in_progress.svg' },
        { value: 'done', label: 'Завершен', icon: './Icon-done.svg' },
        { value: 'cancelled', label: 'Отменен', icon: './Icon-cancelled.svg' }
    ];

    let priorities = [
        { value: 'low', label: 'Low', icon: './Priority.svg' },
        { value: 'medium', label: 'Medium', icon: './Priority2.svg' },
        { value: 'high', label: 'High', icon: './Priority3.svg' }
    ];

    let assignees = [
        { value: 'user1', label: 'User 1', icon: './Assignees.svg' },
        { value: 'user2', label: 'User 2', icon: './Assignees.svg' },
        { value: 'user3', label: 'User 3', icon: './Assignees.svg' }
    ];

    let labels = [
        { value: 'bug', label: 'Bug', icon: './Icon-bug.svg' },
        { value: 'discussion', label: 'Discussion', icon: './Icon-discussion.svg' },
        { value: 'feature', label: 'Feature', icon: './Icon-feature.svg' }
    ];

    const selectStatus = (event) => {
        status = event.detail;
        openDropdown = null;
    };

    const selectPriority = (event) => {
        priority = event.detail;
        openDropdown = null;
    };

    const selectAssignee = (event) => {
        assignee = event.detail;
        openDropdown = null;
    };

    const selectLabel = (event) => {
        label = event.detail;
        openDropdown = null;
    };

    const saveTask = () => {
        if (!title.trim() || !description.trim()) {
            alert("Title and description cannot be empty");
            return;
        }

        const task = { 
            title, 
            description, 
            status, 
            priority, 
            assignee, 
            label,
            startDate,
            endDate 
        };
        console.log("Task saved:", task);
        dispatch('saveTask', task);
        onClose();
    };

    $: if (modalColumn) {
        status = statuses.find(s => s.value === modalColumn);
    }

    onMount(() => {
        if (modalColumn) {
            status = statuses.find(s => s.value === modalColumn);
        }
    });

    function stopPropagation(event) {
        event.stopPropagation();
    }
</script>

{#if isOpen}
    <section class="fixed  inset-0 overflow-y-auto flex items-center justify-center text-neutral-500 w-[100vw]" on:click={e => e.target === e.currentTarget && onClose()} transition:fade={{ duration: 500 }}>
        <div class="bg-black p-4 rounded-lg border-neutral-800 border z-10" transition:fade={{ duration: 500 }} on:click|stopPropagation={stopPropagation}>
            <form on:submit|preventDefault={saveTask}>
                <div class="mb-4">
                    <input type="text" id="title" bind:value={title} class="mt-1 block w-full bg-black border border-neutral-800 rounded-md shadow-sm py-2 px-3" placeholder="Title">
                </div>
                <div class="mb-4">
                    <textarea id="description" bind:value={description} rows="4" class="mt-1 block w-full bg-black border border-neutral-800 rounded-md shadow-sm py-2 px-3" placeholder="Write description..."></textarea>
                </div>
                <div class="flex flex-wrap">
                    <div class="flex">
                        <button type="button" on:click={() => openDropdown = openDropdown === 'status' ? null : 'status'} class="flex items-center border-solid border border-neutral-800 w-auto px-1 h-6 rounded mr-2 mb-2 font-mono text-[12px] font-[JetBrains Mono]">
                            <div class="flex items-center">
                                <img src={status ? status.icon : './Icon-backlog.svg'} alt="status-icon" class="w-4 mr-2">{status ? status.label : 'Status'}
                            </div>
                        </button>
                        {#if openDropdown === 'status'}
                            <Dropdown items={statuses} on:select={selectStatus}/>
                        {/if}
                    </div>
                    <div class="flex items-center mb-2 text-[12px]">
                        <button type="button" on:click={() => openDropdown = openDropdown === 'priority' ? null : 'priority'}>
                            <div class="flex items-center">
                                <img src={priority ? priority.icon : './Priority.svg'} alt="priority-icon" class="mr-2">{priority ? priority.label : 'Priority'}
                            </div>
                        </button>
                        {#if openDropdown === 'priority'}
                            <Dropdown items={priorities} on:select={selectPriority}/>
                        {/if}
                    </div>
                    <div class="flex items-center">
                        <button type="button" on:click={() => openDropdown = openDropdown === 'assignee' ? null : 'assignee'}>
                            <div class="flex items-center mb-2 ml-2 mr-2 text-[12px]">
                                <img src={assignee ? assignee.icon : './Assignees.svg'} alt="assignee-icon" class="mr-2">{assignee ? assignee.label : 'Assignee'}
                            </div>
                        </button>
                        {#if openDropdown === 'assignee'}
                            <Dropdown items={assignees} on:select={selectAssignee}/>
                        {/if}
                    </div>
                    <div class="flex">
                        <button type="button" on:click={() => openDropdown = openDropdown === 'label' ? null : 'label'} class="flex items-center border-solid border border-neutral-800 w-auto px-1 h-6 rounded mr-2 mb-2 font-mono text-[14px] font-[JetBrains Mono]">
                            <div class="flex items-center">
                                <img src={label ? label.icon : './Icon-add.svg'} alt="label-icon" class="mr-2">{label ? label.label : 'Label'}
                            </div>
                        </button>
                        {#if openDropdown === 'label'}
                            <Dropdown items={labels} on:select={selectLabel}/>
                        {/if}
                    </div>
                    <!--выбор даты пока то тоже временный, т.к будут свои календарики вроде и в них надо будет выбирать даты-->
                    <div class="flex items-center border-solid border border-neutral-800 w-auto px-1 h-6 rounded mr-2 mb-2 font-mono text-[12px] font-[JetBrains Mono]">
                        <img src="./Icon-date.svg" alt="date-icon" class="w-4 mr-1"><input type="date" bind:value={startDate} class="bg-black">
                    </div>
                    <div class="flex items-center border-solid border border-neutral-800 w-auto px-1 h-6 rounded mr-2 mb-2 font-mono text-[12px] font-[JetBrains Mono]">
                        <img src="./Icon-date-end.svg" alt="date-end" class="w-4 mr-1"><input type="date" bind:value={endDate} class="bg-black">
                    </div>
                    <!--хз пока что-->
                    <div class="flex items-center border-solid border border-neutral-800 w-auto px-1 h-6 rounded mr-2 mb-2 font-mono text-[12px] font-[JetBrains Mono]">
                        <img src="./Icon-attachment.svg" alt="attachment-icon" class="w-4 mr-1">Attachment
                    </div>
                </div>
                <div class="mt-2">
                    <div class="flex border border-b-0 border-r-0 border-l-0 border-neutral-800 w-full px-2 py-1 mr-2 mb-2 justify-end items-center">
                        <button type="submit" class="mt-2 relative text-neutral-50 font-jetbrains font-extrabold text-sm bg-black border border-neutral-800 cursor-pointer px-6 py-2 transition-all duration-500 hover:rounded-tl-xl before:absolute before:bg-blue-700 before:z-10 before:h-3.5 before:w-3.5 before:right-[-6px] before:bottom-[-6px] hover:after:absolute after:bg-blue-700 after:opacity-0 after:rounded-xl after:h-full after:w-full after:right-[-6px] after:bottom-[-6px] after:-z-10 after:transition-all after:duration-500  hover:after:opacity-30">
                            Сохранить
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </section>
{/if}