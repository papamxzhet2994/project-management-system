<script>
    export let task;

    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('ru-RU', options).format(new Date(date));
    }
</script>

<style>
    .item-tag {
        @apply flex items-center border-solid border border-neutral-800 w-auto px-1 h-6 rounded;
    }
</style>

<section class="mb-4 cursor-grab" draggable="true" on:dragstart on:dragend>
    <div class="border-solid border border-neutral-800 px-3 pt-1 rounded bg-black text-neutral-500 text-sm">
        <p class="text-[10px]">T-{task.id}</p>
        <h1 class="text-white my-2.5 hyphens-auto">{task.title}</h1>
        <div class="container flex flex-wrap gap-2 mb-2 text-xs font-normal font-[JetBrains Mono]">
            {#if task.status}
                <div class="item-tag">
                    <img src={task.status.icon} alt="status-icon" class="w-3 mr-1">{task.status.label}
                </div>
            {/if}
            {#if task.priority}
                <img src={task.priority.icon} alt="priority-icon" class="w-4.5">
            {/if}
            {#if task.assignee}
                <img src={task.assignee.icon} alt="assignee-icon" class="w-4.5">
            {/if}
            {#if task.label}
                <div class="item-tag">
                    <img src={task.label.icon} alt="label-icon" class="mr-1">{task.label.label}
                </div>
            {/if}
            {#if task.startDate}
                <div class="item-tag">
                    <img src="./Icon-date.svg" alt="date-icon" class="w-3 mr-1">{formatDate(task.startDate)}
                </div>
            {/if}
            {#if task.endDate}
                <div class="item-tag">
                    <img src="./Icon-date-end.svg" alt="date-end" class="w-3 mr-1">{formatDate(task.endDate)}
                </div>
            {/if}
            {#if task.parent}
                <div class="item-tag">
                    <img src="./Icon-parent-issue.svg" alt="parent-icon" class="w-3 mr-1">T-{task.parent.id}
                </div>
            {/if}
        </div>
    </div>
</section>
