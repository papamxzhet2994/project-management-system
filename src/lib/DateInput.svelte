<script>
    import { createEventDispatcher } from 'svelte';
    import Calendar from './Calendar.svelte';

    export let selectedDate = new Date();

    const dispatch = createEventDispatcher();
    let showCalendar = false;

    function toggleCalendar() {
        showCalendar = !showCalendar;
    }

    function selectDate(event) {
        selectedDate = event.detail;
        showCalendar = false;
        dispatch('selectDate', selectedDate);
    }

    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('ru-RU', options);
    }
</script>

<div class="relative inline-block text-left w-[110px]">
    <input type="text" readonly value={formatDate(selectedDate)} on:click={toggleCalendar} class="bg-black outline-none w-full cursor-pointer"/>
    {#if showCalendar}
        <div class="absolute top-[100%] left-0 bg-black z-10">
            <Calendar bind:selectedDate={selectedDate} on:selectDate={selectDate} />
        </div>
    {/if}
</div>
