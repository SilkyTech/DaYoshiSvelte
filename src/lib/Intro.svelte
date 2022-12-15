<script lang="ts">
    let dis = true
    function dissappear() {
        dis = false
    }
</script>

{#if dis}
<div class={"intro"}>
    <img src="logo.png" alt="Logo">
    <button on:click={dissappear}>Go</button>
</div>
{/if}