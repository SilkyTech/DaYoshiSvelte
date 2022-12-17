<script lang="ts">
    import { Inventory, itemIds, recipes, type Item } from "../stores";
    import Tooltip from "../Tooltip.svelte";
    import { game } from "../stores"
  import App from "../../App.svelte";

    let {
        pInventory,
        inventory
    } = game

    let active = false;
    let index = 0;

    export function toggle() {
        active = !active;
    }
    
    $: curRecipe = recipes[index]
    $: _canCraft = !canCraft($inventory, index)

    function canCraft(_: Item[], __: any) {
        for (let i = 0; i < recipes[index][0].length; i++) {
            const a = recipes[index][0][i];
            console.log(pInventory.getItem(a[0]).amount, )
            if (pInventory.getItem(a[0]).amount < a[1]) {
                return false;
            }
        }

        return true;
    }

    function craft() {
        let newInv = Inventory.from($inventory)
        recipes[index][0].forEach(a => {
            newInv.removeItem(a[0], a[1])
        }) 
        newInv.addItem(recipes[index][1][0], recipes[index][1][1])
        $inventory = newInv.items
    }
</script>

<button disabled={index === 0} on:click={() => index--}>Previous Recipe</button>
<button disabled={index === recipes.length-1} on:click={() => index++}>Next Recipe</button><br>

{#each curRecipe[0] as item}
    <div class={"inventory-panel" + (pInventory.getItem(item[0]).amount < item[1] ? " notenough" : "")}>
        <span class="inventory-panel-title">{item[0]}</span>
        <span class="inventory-panel-amount">{item[1]}</span>
        <img src={itemIds[item[0]].img} alt={item[0].toString()}>
        
    </div>
{/each}
<svg width="128px" height="128px"
xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
</svg>
<div class="inventory-panel">
    <span class="inventory-panel-title">{curRecipe[1][0]}</span>
    <span class="inventory-panel-amount">{curRecipe[1][1]}</span>
    <img src={itemIds[curRecipe[1][0]].img} alt={curRecipe[1][0].toString()}>

</div><br>
<button 
disabled={_canCraft}
on:click={craft}>Craft</button>