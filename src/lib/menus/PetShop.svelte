<script lang="ts">
    import { game } from '../stores'
    import type App from '../../App.svelte'
    const { 
        hits, deaths, hp, 
        usedDev, usedAutoclicker, boughtSkins, 
        curPet, ownedPets, curSkin } = game
    import * as constants from '../constants'
    import { boxes, pets } from '../constants'
    import * as int from '../Internal'
    import { getLevels } from '../utils';
  import Tooltip from '../Tooltip.svelte';
  import CurvedButton from '../component/CurvedButton.svelte';
  import Modal from '../component/Modal.svelte';
    
    let boxscroll: boolean = false;
    export let parent: App;

    let boxLeft = 0;
    let petmenuactive: boolean = false;
    
        
    function buyBox(boxType: number) {
        boxLeft = 0;
        if ($deaths >= constants.boxes[boxType][2]) {
            $deaths -= constants.boxes[boxType][2]
            boxOpen(boxType)
        }
    }

    let boxitems: [typeof pets[0], boolean][] = [];

    async function boxOpen(id: number) {
        modal.closeModal();
        let things = constants.boxChances[id];
        let uncollapsed = [];
        things.forEach((a) => {
        for (let i = 0; i < a[1]; i++) uncollapsed.push(a[0]);
        });

        let chosen =
        Math.floor(Math.random() * uncollapsed.length) + uncollapsed.length;
        console.log(chosen, uncollapsed.length);
        uncollapsed = uncollapsed
        .concat(uncollapsed)
        .concat(uncollapsed)
        .sort(() => Math.random() - Math.random());
        boxitems = uncollapsed.map((a, i) => [pets[a], i === chosen]);
        boxscroll = true;
        setTimeout(() => {
        boxLeft = 0 - 140 * chosen;
        setTimeout(() => {
            boxLeft = 0;
            boxscroll = false;
            if (uncollapsed[chosen] !== 5)
            $ownedPets.push([uncollapsed[chosen], 0]);
            else parent.createNotif(`You got nothing, sad.`, "color: red;");
            int.save.saveSave();
            $ownedPets = $ownedPets;
            modal.openModal();
        }, 3000);
        }, 1000);
    }

    function equipPet(id: number): void {
        $curPet = id;
    }

    function salvage(pet: number) {
        if (
        confirm(
            `Are you sure you want to salvage your ${
            pets[$ownedPets[pet][0]].name
            } for ${pets[$ownedPets[pet][0]].salvage} deaths?`
        )
        ) {
        $curPet--;
        $ownedPets = $ownedPets.filter((a, i) => {
            if (i !== pet) return true;
            else {
            $deaths += pets[a[0]].salvage;
            return false;
            }
        });
        int.save.saveSave();
        }
    }
    
    export function open() {
        modal.openModal()
    }

    let modal: Modal;

    $: boughtPets = $ownedPets.map((p, i) => ({xp: p[1], pet: pets[p[0]], i: i}))
</script>

<Modal bind:this={modal}>
    <h1>Pet Menu:</h1>
    <hr>
    Current Pet: {$curPet === -1 ? "None" : boughtPets[$curPet].pet.name}<br />
    Level: {getLevels(boughtPets[$curPet]).level}<br />
    EXP to next Level: {getLevels(boughtPets[$curPet]).xp}<br />
    Description: {getLevels(boughtPets[$curPet]).desc}<br />
    <button on:click={() => salvage($curPet)}>Salvage</button>
    <hr>
    <div class="pets">
        {#each boughtPets as pet}
        <button class="pet-icon" on:click={() => equipPet(pet.i)} disabled={pet.i === $curPet || (ownedPets[pet.i] === 11 && !$usedDev)}>
            <span class="pet-name">{pet.pet.name}</span>
            <img
            src={pet.pet.source}
            alt={pet.pet.name}
            class="shop-item equip"
        /><br />
        <span class="pet-level">Level {getLevels(pet).level}</span>
        </button>
        {/each}
    </div>
        
    <hr>
    <span class="info-label">Buy Menu:</span><br />
    {#each Object.keys(boxes) as i}
    <button class="boxbuy" on:click={() => buyBox(+i)}>
        <img src={boxes[i][1]} alt=""><br>
            
        Buy {boxes[i][0]} for {boxes[i][2]} Deaths
    </button>
    {/each}
  
    <hr />
    
</Modal>

{#if boxscroll}
    <div class="gambling" style={`left: ${boxLeft}px`}>
    {#each boxitems as item}
        <div class={"gamble-panel" + (item[1] ? " chosen" : "")}>
        <img src={item[0].source} alt=""><br>
        <span>{item[0].name}</span>
        </div>
        
    {/each}
    </div>
{/if}