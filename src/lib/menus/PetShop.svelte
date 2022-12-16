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
    
    let boxscroll: boolean = false;
    export let parent: App;

    let boxLeft = 0;
    let petmenuactive: boolean = false;
    
        
    function buyBox(boxType: number) {
        boxLeft = 0;
        switch (boxType) {
        case 1:
            if ($deaths >= 50) {
            $deaths -= 50;
            boxOpen(boxType);
            }
            break;
        case 2:
            if ($deaths >= 300) {
            $deaths -= 300;
            boxOpen(boxType);
            }
            break;
        case 3:
            if ($deaths >= 500) {
            $deaths -= 500;
            boxOpen(boxType);
            }
            break;
        case 4:
            if ($deaths >= 700) {
            $deaths -= 700;
            boxOpen(boxType);
            }
            break;
        }
    }

    let boxitems: [typeof pets[0], boolean][] = [];

    async function boxOpen(id: number) {
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
    
    export function toggle() {
        petmenuactive = !petmenuactive;
    }

    $: boughtPets = $ownedPets.map((p, i) => ({xp: p[1], pet: pets[p[0]], i: i}))
</script>

<div class={"petmenu" + (petmenuactive ? " petmenu-active" : "")}>
    <span class="info-label">Buy Menu:</span><br />
    <div class="shop-items">
    {#each Object.keys(boxes) as i}
    <button class="boxbuy" on:click={() => buyBox(+i)}>
        <img src={boxes[i][1]} alt=""><br>
            
        Buy {boxes[i][0]} for {boxes[i][2]} Deaths
    </button>
    {/each}
    </div>
  <hr />
  Current Pet: {$curPet === -1 ? "None" : boughtPets[$curPet].pet.name}<br />
  Level: {getLevels(boughtPets[$curPet]).level}<br />
  EXP to next Level: {getLevels(boughtPets[$curPet]).xp}<br />
  Description: {getLevels(boughtPets[$curPet]).desc}<br />
  <button on:click={() => salvage($curPet)}>Salvage</button>
  <hr />
  <div class="shop-items">
    {#each boughtPets as pet}
      <div class="shop-panel equip">
        <button on:click={() => equipPet(pet.i)} disabled={pet.i === $curPet || ($ownedPets[$curPet][0] === 10 && !$usedDev)}>
          <img
            src={pet.pet.source}
            alt={pet.pet.name}
            class="shop-item equip"
          /><br />
          Equip {pet.pet.name} | Level {getLevels(pet).level}
        </button>
      </div>
    {/each}
  </div>
</div>

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