<!--временно, потому что не знаю как должно быть-->

<script>
    import { createEventDispatcher } from 'svelte';
    export let items = [];
    export let selectedItem = null;
    const dispatch = createEventDispatcher();

    const selectItem = (item) => {
        dispatch('select', item);
    };
</script>

<div class="bg-black border border-neutral-800 rounded w-[200px] absolute z-10 p-2">
    {#each items as item}
        <div class="flex items-center px-2 py-1 rounded hover:bg-neutral-700 cursor-pointer {selectedItem === item ? 'selected' : ''}" on:click={() => selectItem(item)}>
            {#if item.icon}
                <img src={item.icon} alt="icon" class="mr-2">
            {/if}
            {item.id ? item.id : item.label}
        </div>
    {/each}
</div>