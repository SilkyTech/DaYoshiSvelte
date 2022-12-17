<script lang="ts">
    import { each } from 'svelte/internal';
  import Modal from '../component/Modal.svelte';
    import { game, Inventory, itemIds } from '../stores'
    import Tooltip from '../component/Tooltip.svelte';
    import Crafting from './Crafting.svelte'

    let {
        inventory,
        equipment,
        curPet, ownedPets
    } = game;

    let modal: Modal;

    export function open() {
        modal.openModal();
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

    const notypecheck = (x:any)=>x;
</script>

<Modal bind:this={modal}>
    <span class="inventory-title">Inventory</span>
    <hr>
    Equipment:
    <br>
    <table id="equipment">
        <tr>
            <td>Sword</td>
            <td>Cloak</td>
            <td>Necklace</td>
        </tr>
        <tr>
            <td>
                <div class="inventory-panel">
                    <span style="font-weight: 400;" class="inventory-panel-amount">1</span>
                    <span style="font-weight: 400; font-size: 1rem" class="inventory-panel-title">{$equipment.sword ?? "None"}</span>
                    {#if $equipment.sword !== undefined} <img src={itemIds[$equipment.sword]?.img ?? ""} alt={$equipment.sword}> {/if}
                </div>
            </td>
            <td>
                <div class="inventory-panel">
                    <span style="font-weight: 400;" class="inventory-panel-amount">1</span>
                    <span style="font-weight: 400; font-size: 1rem" class="inventory-panel-title">{$equipment.cloak ?? "None"}</span>
                    {#if $equipment.cloak !== undefined} <img src={itemIds[$equipment.cloak]?.img ?? ""} alt={$equipment.cloak}> {/if}
                </div>    
            </td>
            <td>
                <div class="inventory-panel">
                    <span style="font-weight: 400;" class="inventory-panel-amount">1</span>
                    <span style="font-weight: 400; font-size: 1rem" class="inventory-panel-title">{$equipment.necklace ?? "None"}</span>
                    {#if $equipment.necklace !== undefined} <img src={itemIds[$equipment.necklace]?.img ?? ""} alt={$equipment.necklace}> {/if}
                </div>    
            </td>
        </tr>
        <tr>
            <td>
                {#if $equipment.sword !== undefined} 
                +{notypecheck(itemIds[$equipment.sword]).damage} Damage
                {:else}
                No sword equipped
                {/if}
            </td>
            <td>
                {#if $equipment.cloak !== undefined} 
                +{notypecheck(itemIds[$equipment.cloak]).damage} Damage
                {:else}
                No cloak equipped
                {/if}
            </td>
            <td>
                {#if $equipment.necklace !== undefined} 
                +{notypecheck(itemIds[$equipment.necklace]).damage} Damage
                {:else}
                No necklace equipped
                {/if}
            </td>
        </tr>
    </table>


    <hr>
    Crafting:<br>
    <Crafting></Crafting>
    <hr>
    <div class="inventory-container">
    Inventory:<br>
        {#each pInventoryItems as item}
            <div class="inventory-panel" title={itemIds[item.id].desc} style="margin-bottom: 8px; margin-right: 8px;">
                <span class="inventory-panel-title">{item.id}</span>
                <span class="inventory-panel-amount">{item.amount}</span>
                <img src={item.img} alt={item.id.toString()}>
                {#if itemIds[item.id].type === "sword" }
                    <button class="inventory-equip" on:click={() => {$equipment.sword = item.id}}
                        disabled={$equipment.sword === item.id}>Equip</button>
                {/if}

                {#if itemIds[item.id].type === "cloak" }
                    <button class="inventory-equip" on:click={() => {$equipment.cloak = item.id}}
                        disabled={$equipment.cloak === item.id}>Equip</button>
                {/if}

                {#if itemIds[item.id].type === "necklace" }
                    <button class="inventory-equip" on:click={() => {$equipment.necklace = item.id}}
                        disabled={$equipment.necklace === item.id}>Equip</button>
                {/if}

                {#if itemIds[item.id].type === "candy" }
                    <button class="inventory-equip" on:click={() => {useCandy(itemIds[item.id], item.id)}}>Use</button>
                {/if}
            </div>
        {/each}
    </div>
    
</Modal>  
