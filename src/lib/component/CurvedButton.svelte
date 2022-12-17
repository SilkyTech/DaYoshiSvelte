<script lang="ts">
    export let onclick: (e: MouseEvent) => void;
    export let disabled: boolean = false;
</script>
<button on:click={(e) => onclick(e)} class="curved-button" disabled={disabled}><slot /></button>