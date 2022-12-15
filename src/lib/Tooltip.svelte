<script lang="ts">
    export let tooltip: string;
</script>

<div class="tooltip">
    <span class="tooltiptext">{tooltip}</span>
    <slot />
</div>