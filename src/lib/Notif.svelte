<script lang="ts">
    export let label: string;
    export let style: string;
    export let pos: {x: number, y: number};
</script>

<span class="notif" style={style + `;; top: ${pos.y - 20}px; left: ${pos.x - 20}px`}>
    {label}
</span>