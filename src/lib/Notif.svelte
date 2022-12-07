<script lang="ts">
    export let label: string;
    export let style: string;
    export let pos: {x: number, y: number};
</script>

<span class="notif" style={style + `;; top: ${pos.y + Math.random()*40 - 20}px; left: ${pos.x + Math.random()*40 - 20}px`}>
    {label}
</span>