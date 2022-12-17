<script lang="ts">
    import CurvedButton from "./CurvedButton.svelte";
    let open = false;

    export function openModal() {
        open = true;
    }

    export function closeModal() {
        open = false;
    }

</script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class={"modal-blur" + (open ? " modal-open" : "")} 

>
    <div class="modal-content">
        <slot />
        <br>
        <CurvedButton onclick={() => open = false}>Done</CurvedButton>
    </div>
</div>