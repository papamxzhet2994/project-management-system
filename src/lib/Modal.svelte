<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import Dropdown from './Dropdown.svelte';
    import { tasks, statuses } from '../lib/store';

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
    let parent = null;

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

    let issues = [];
    tasks.subscribe(value => {
        issues = value;
    });

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

    const selectParent = (event) => {
        parent = event.detail.value;
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
            status: { ...status },
            priority, 
            assignee, 
            label,
            startDate,
            endDate,
            parent 
        };
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

    function resetFields() {
        title = "";
        description = "";
        status = null;
        priority = null;
        assignee = null;
        label = null;
        startDate = new Date().toISOString().slice(0, 10);
        endDate = new Date().toISOString().slice(0, 10);
        parent = null;
    }

    $: if (isOpen) {
        resetFields();
    }

    function stopPropagation(event) {
        event.stopPropagation();
    }
</script>

<style>
    .modal-text {
        @apply block w-full bg-black border border-neutral-800 rounded-lg shadow-sm py-0.5 px-2 placeholder:text-neutral-600;
    }
    .item-tag {
        @apply flex items-center border-solid border border-neutral-800 w-auto px-1 h-[18px] rounded;
    }
    .item {
        @apply flex items-start;
    }
</style>

{#if isOpen}
    <section class="fixed inset-0 mx-auto flex items-center justify-center text-neutral-500 max-w-[800px]" on:click={e => e.target === e.currentTarget && onClose()} transition:fade={{ duration: 500 }}>
        <div class="bg-black rounded-lg border-neutral-800 border z-10" transition:fade={{ duration: 500 }} on:click|stopPropagation={stopPropagation}>
            <form on:submit|preventDefault={saveTask}>
                <div class="flex flex-col gap-2 px-4 pt-4 mb-2">
                    <input type="text" id="title" bind:value={title} class="modal-text text-lg" placeholder="Title">
                    <textarea id="description" bind:value={description} rows="4" class="modal-text text-sm resize-none h-[100px]" placeholder="Write description..."></textarea>
                    <div class="flex flex-wrap gap-2 mb-2 text-xs font-normal font-[JetBrains Mono]">
                        <button type="button" class="item-tag" on:click={() => openDropdown = openDropdown === 'status' ? null : 'status'}>
                            <img src={status ? status.icon : './Icon-backlog.svg'} alt="status-icon" class="w-3 mr-1">{status ? status.label : 'Status'}
                        </button>
                        {#if openDropdown === 'status'}
                            <Dropdown items={statuses} on:select={selectStatus}/>
                        {/if}
                        <div class="item">
                            <button type="button" class="flex items-center" on:click={() => openDropdown = openDropdown === 'priority' ? null : 'priority'}>
                                    <img src={priority ? priority.icon : './Priority.svg'} alt="priority-icon" class="w-4.5 mr-1">{priority ? priority.label : 'Priority'}
                            </button>
                            {#if openDropdown === 'priority'}
                                <Dropdown items={priorities} on:select={selectPriority}/>
                            {/if}
                        </div>
                        <div class="item">
                            <button type="button" class="flex items-center" on:click={() => openDropdown = openDropdown === 'assignee' ? null : 'assignee'}>
                                    <img src={assignee ? assignee.icon : './Assignees.svg'} alt="assignee-icon" class="w-4.5 mr-1">{assignee ? assignee.label : 'Assignee'}
                            </button>
                            {#if openDropdown === 'assignee'}
                                <Dropdown items={assignees} on:select={selectAssignee}/>
                            {/if}
                        </div>
                        <div class="item">
                            <button type="button" class="item-tag" on:click={() => openDropdown = openDropdown === 'label' ? null : 'label'}>
                                <img src={label ? label.icon : './Action-Icon2.svg'} alt="label-icon" class="w-2 mr-1">{label ? label.label : 'Label'}
                            </button>
                            {#if openDropdown === 'label'}
                                <Dropdown items={labels} on:select={selectLabel}/>
                            {/if}
                        </div>
                        <div class="item-tag">
                            <img src="./Icon-date.svg" alt="date-icon" class="w-3 mr-1"><input type="date" bind:value={startDate} class="bg-black">
                        </div>
                        <div class="item-tag">
                            <img src="./Icon-date-end.svg" alt="date-end" class="w-3 mr-1"><input type="date" bind:value={endDate} class="bg-black">
                        </div>
                        <div class="item">
                            <button type="button" class="item-tag" on:click={() => openDropdown = openDropdown === 'parent' ? null : 'parent'}>
                                <img src="./Icon-parent-issue.svg" alt="parent-icon" class="w-3 mr-1">{parent ? `T-${parent.id}` : 'Parent issue'}
                            </button>
                            {#if openDropdown === 'parent'}
                                <Dropdown items={issues.map(issue => ({ label: `T-${issue.id}`, value: issue }))} on:select={selectParent}/>
                            {/if}
                        </div>
                        <div class="item-tag">
                            <img src="./Icon-attachment.svg" alt="attachment-icon" class="w-3 mr-1">Attachment
                        </div>
                    </div>
                </div>
                <div class="flex border border-b-0 border-r-0 border-l-0 pt-4 pb-5 px-5 border-neutral-800 w-full justify-end items-center">
                    <button type="submit" class="relative text-neutral-50 font-jetbrains font-extrabold text-sm bg-black border border-neutral-800 cursor-pointer px-6 py-2 transition-all duration-500 hover:rounded-tl-xl before:absolute before:bg-blue-700 before:z-10 before:h-3.5 before:w-3.5 before:right-[-6px] before:bottom-[-6px] hover:after:absolute after:bg-blue-700 after:opacity-0 after:rounded-xl after:h-full after:w-full after:right-[-6px] after:bottom-[-6px] after:-z-10 after:transition-all after:duration-500 hover:after:opacity-30">
                        Сохранить
                    </button>
                </div>
            </form>
        </div>
    </section>
{/if}
