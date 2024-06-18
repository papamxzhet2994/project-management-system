<script>
    export let task;

    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('ru-RU', options).format(new Date(date));
    }
</script>

<section class="font-[JetBrains Mono] mb-4 cursor-grab" draggable="true" on:dragstart on:dragend>
    <div class="border-solid border border-neutral-800 px-3 pt-2 rounded bg-black text-neutral-500 max-w-[350px] w-auto">
        <p class="mb-2 text-[10px]">T-{task.id}</p>
        <h1 class="text-white flex-wrap mb-2 text">{task.title}</h1>
        <div class="container flex flex-wrap font-[JetBrains Mono]">
            {#if task.status}
                <div class="flex items-center border-solid border border-neutral-800 w-auto px-1 h-6 rounded mr-2 mb-2 font-mono text-[12px] font-[JetBrains Mono]">
                    <img src={task.status.icon} alt="status-icon" class="w-3 mr-1">{task.status.label}
                </div>
            {/if}
            {#if task.priority}
                <div class="flex w-auto px-1 h-6 text-[12px]">
                    <img src={task.priority.icon} alt="priority-icon" class="mr-1">
                </div>
            {/if}
            {#if task.assignee}
                <div class="flex h-6 text-[12px]">
                    <img src={task.assignee.icon} alt="assignee-icon">
                </div>
            {/if}
            {#if task.label}
                <div class="flex items-center border-solid border border-neutral-800 w-auto px-1 h-6 rounded mr-2 ml-2 mb-2 font-mono text-[12px] font-[JetBrains Mono]">
                    <img src={task.label.icon} alt="label-icon" class="mr-1">{task.label.label}
                </div>
            {/if}
            {#if task.startDate}
                <div class="flex items-center border-solid border border-neutral-800 w-auto px-1 h-6 rounded mr-2 mb-2 font-mono text-[12px] font-[JetBrains Mono]">
                    <img src="./Icon-date.svg" alt="date-icon" class="w-4 mr-1">{formatDate(task.startDate)}
                </div>
            {/if}
            {#if task.endDate}
                <div class="flex items-center border-solid border border-neutral-800 w-auto px-1 h-6 rounded mr-2 mb-2 font-mono text-[12px] font-[JetBrains Mono]">
                    <img src="./Icon-date-end.svg" alt="date-end" class="w-4 mr-1">{formatDate(task.endDate)}
                </div>
            {/if}
        </div>
    </div>
</section>
