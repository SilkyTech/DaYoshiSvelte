<script lang="ts">
    import { each } from 'svelte/internal';
import { game, Inventory, itemIds } from '../stores'
  import Tooltip from '../Tooltip.svelte';

    let {
        inventory,
        equipment,
    } = game;

    let active = false;

    export function toggle() {
        active = !active;
    }

    $: pInventory = Inventory.from($inventory)
    $: pInventoryItems = pInventory.getItems()
</script>

<div class={"inventorymenu" + (active ? " inventorymenu-active" : "")}>
    <span class="inventory-title">Inventory</span>
    <hr>
    <div class="inventory-container">
        {#each pInventoryItems as item}
            <div class="inventory-panel">
                <span class="inventory-panel-title">{item.id}</span>
                <span class="inventory-panel-amount">{item.amount}</span>
                <Tooltip tooltip={itemIds[item.id].desc}>
                    <img src={item.img} alt={item.id}>
                </Tooltip>
                {#if itemIds[item.id].type === "sword" }
                    <button on:click={() => {$equipment.sword = item.id}}
                        disabled={$equipment.sword === item.id}>Equip</button>
                {/if}
            </div>
        {/each}
    </div>
    
</div>  