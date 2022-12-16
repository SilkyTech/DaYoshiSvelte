<script lang="ts">
    import { each } from 'svelte/internal';
    import { game, Inventory, itemIds } from '../stores'
    import Tooltip from '../Tooltip.svelte';
    import Crafting from './Crafting.svelte'

    let {
        inventory,
        equipment,
        curPet, ownedPets
    } = game;

    let craftingMenuComponent: Crafting;

    let active = false;

    export function toggle() {
        active = !active;
    }

    $: pInventory = Inventory.from($inventory)
    $: pInventoryItems = pInventory.getItems()

    function useCandy(item: typeof itemIds[keyof typeof itemIds], id: keyof typeof itemIds) {
        if (item.type === "candy") {
            let newInv = Inventory.from($inventory)
            newInv.removeItem(id, 1);
            $ownedPets[$curPet][1] += item.xp;
            $inventory = newInv.items
        }
    }
</script>

<div class={"inventorymenu" + (active ? " inventorymenu-active" : "")}>
    <span class="inventory-title">Inventory</span><button on:click={() => craftingMenuComponent.toggle()}>Toggle crafting menu</button>
    
    <hr>
    <div class="inventory-container">
        {#each pInventoryItems as item}
            <div class="inventory-panel">
                <span class="inventory-panel-title">{item.id}</span>
                <span class="inventory-panel-amount">{item.amount}</span>
                <Tooltip tooltip={itemIds[item.id].desc}>
                    <img src={item.img} alt={item.id.toString()}>
                </Tooltip>
                {#if itemIds[item.id].type === "sword" }
                    <button on:click={() => {$equipment.sword = item.id}}
                        disabled={$equipment.sword === item.id}>Equip</button>
                {/if}

                {#if itemIds[item.id].type === "candy" }
                    <button on:click={() => {useCandy(itemIds[item.id], item.id)}}>Use</button>
                {/if}
            </div>
        {/each}
    </div>
    
</div>  
<Crafting bind:this={craftingMenuComponent}></Crafting>