<script>
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    import { writable } from 'svelte/store';

    const dispatch = createEventDispatcher();

    export let selectedDate = new Date();

    let currentMonth = writable(new Date().getMonth());
    let currentYear = writable(new Date().getFullYear());

    const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    $: daysInMonth = getDaysInMonth($currentMonth, $currentYear);

    function getDaysInMonth(month, year) {
        let date = new Date(year, month, 1);
        let days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }

    function selectDate(date) {
        selectedDate = date;
        dispatch('selectDate', date);
    }

    function changeMonth(diff) {
        currentMonth.update(month => {
            let newMonth = month + diff;
            if (newMonth > 11) {
                currentYear.update(year => year + 1);
                return 0;
            }
            if (newMonth < 0) {
                currentYear.update(year => year - 1);
                return 11;
            }
            return newMonth;
        });
    }
</script>

<style>
    .calendar-grid div {
        @apply align-middle p-2 text-center;
    }

    .calendar-grid .day {
        @apply cursor-pointer;
    }

    .calendar-grid .selected {
        @apply bg-neutral-700 text-neutral-50;

    }
</style>

<section class="flex flex-col items-center  text-neutral-500 rounded-lg p-4 w-[350px] border border-neutral-800" transition:fade={{ duration: 300 }}>
    <div class="flex justify-between w-full mb-2">
        <button on:click={() => changeMonth(-1)}>&lt;</button>
        <div>{$currentMonth + 1} / {$currentYear}</div>
        <button on:click={() => changeMonth(1)}>&gt;</button>
    </div>
    <div class="grid grid-cols-7 gap-2 calendar-grid">
        {#each daysInWeek as day}
            <div>{day}</div>
        {/each}
        {#each daysInMonth as day}
            <div 
                class="day {selectedDate.toDateString() === day.toDateString() ? 'selected' : ''}" 
                on:click={() => selectDate(day)}>
                {day.getDate()}
            </div>
        {/each}
    </div>
</section>
