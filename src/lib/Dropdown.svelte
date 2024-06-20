<!--временно, потому что не знаю как должно быть-->

<script>
    import { createEventDispatcher } from 'svelte';
    import { tasks, modalColumn, addTask, isModalOpen } from '../lib/store';
    export let items = [];
    export let selectedItem = null;
    const dispatch = createEventDispatcher();

    const selectItem = (item) => {
        dispatch('select', item);
    };
</script>

<div class="dropdown">
    {#each items as item}
        <div class="dropdown-item {selectedItem === item ? 'selected' : ''}" on:click={() => selectItem(item)}>
            {#if item.icon}
                <img src={item.icon} alt="" class="icon">
            {/if}
            {item.id ? item.id : item.label}
        </div>
    {/each}
</div>

<style>
    .dropdown {
        background: black;
        border: 1px solid #333;
        border-radius: 0.5rem;
        position: absolute;
        z-index: 1000;
        width: 200px;
        padding: 0.5rem;
    }
    .dropdown-item {
        display: flex;
        align-items: center;
        padding: 0.5rem 1rem;
        cursor: pointer;
    }
    .dropdown-item.selected {
        background: #3b82f6;
    }
    .dropdown-item:hover {
        background: #555;
    }
    .icon {
        margin-right: 0.5rem;
        width: 16px;
        height: 16px;
    }
</style>
