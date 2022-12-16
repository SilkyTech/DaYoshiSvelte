<script lang="ts">
  import Notif from './lib/Notif.svelte'
  import Intro from './lib/Intro.svelte'
  import * as constants from "./lib/constants"
  import { skins, pets } from './lib/constants'
  import { game, itemIds, type Item } from './lib/stores'
  import DevConsole from './lib/DevConsole.svelte'
  import * as int from './lib/Internal' 
  import { getLevels, getLevelsNoLocal } from './lib/utils'
  import Shop from './lib/menus/Shop.svelte';
  import PetShop from './lib/menus/PetShop.svelte';
  import InventoryMenu from './lib/menus/InventoryMenu.svelte'

  const { 
    hits, deaths, hp, 
    usedDev, usedAutoclicker, boughtSkins, 
    curPet, ownedPets, curSkin, inventory, equipment, } = game
  
  let yoshi: HTMLDivElement;
  let yoshiimg: string = "idle/yoshi.png";
  let hand: HTMLDivElement;
  let petfloat: HTMLImageElement; 
  let handimg: string = "hand/hand.png";
  
  let shopComponent: Shop;
  let petmenuComponent: PetShop;
  let inventoryComponent: InventoryMenu;

  let mouse = { x: 0, y: 0 };
  let frame = 0;
  let notifs: {label: string, style: string, uuid: string, time: number}[] = [];
  let notifPos: {[time: number]: {x: number, y: number}} = {}

  const instance = Math.floor(Math.random()*19999999)
  
  let curYoshi: number = 0;

  $usedDev = false;

  int.save.loadSave()
  //console.log(ownedPets)
  
  //console.log(ownedPets)
  $: boughtPets = $ownedPets.map((p, i) => ({xp: p[1], pet: pets[p[0]], i: i}))
  
  function getDamage() {
    let base = 1;
    if (itemIds?.[$equipment.sword]?.type === "sword") {
      //@ts-ignore
      base += itemIds[$equipment.sword].damage
    }
    if ($curPet !== -1) {
      let cPet = boughtPets[$curPet];
      let level = getLevels(cPet).level;
      let outcome = cPet.pet.perks(level);
      if (outcome.hitAdd) {
        base += (outcome?.hitAdd ?? 0)
      }
      if (outcome.hitMul) {
        base *= (outcome?.hitMul ?? 0) + 1
      }
    }
    return base;
  }

  

  function getSkin() {
    return {
      hit: skins[$curSkin.hit],
      block: skins[$curSkin.block],
      normal: skins[$curSkin.normal],
    }
  }

  function checkHealth() {
    if ($hp < 1) {
      createNotif(`Killed ${yoshiObj.name} | +${yoshiObj.kill} Pet XP`, `font-size: ${(Math.random()+1.5)*100}%;`)
      $hp = yoshiObj.hp;
      $deaths += yoshiObj.reward;
      $ownedPets[$curPet][1] += yoshiObj.kill;

      let inflated: Item["id"][] = []

      yoshiObj.drops.forEach(a => {
        for (let i = 0; i < a[1]; i++) {
          inflated.push(a[0])
        }
      })

      let reward = inflated[Math.floor(Math.random()*inflated.length)];
      $inventory.push({"id": reward});
      $inventory = $inventory
      createNotif(`You got a ${reward} from killing ${yoshiObj.name}!`, "color: blue; font-size: 1.7rem;")
    }
  }

  function click(e: MouseEvent) {
    
    if (
      (() => {
        let b = false;
        // @ts-ignore
        e.path.forEach(a => {
          if (a instanceof HTMLButtonElement) b = true;
        })
        return b;
      })()  
    ) return;
    

    hand.classList.add("hit");
    let missChance = Math.random() < 0.2;
    if (missChance) {
      yoshiimg = getSkin().block[1]
      createNotif("Blocked!", "color: grey; font-size: 1.5rem;")
    } else {
      $hits++;
      createNotif(`Normal Hit | -${getDamage().toFixed(2)} HP`, "")
      yoshiimg = getSkin().hit[1]
      $hp -= getDamage();
      if ($curPet !== -1) $ownedPets[$curPet][1]++;
    }

    checkHealth()

    yoshi.classList.add("hit");

    setTimeout(() => {
      yoshi.classList.remove("hit");
      hand.classList.remove("hit");
    }, 100);

    setTimeout(() => {
      yoshiimg = getSkin().normal[1]
    }, 300)
    int.save.saveSave()
  }

  function mousemove(e: MouseEvent) {
    mouse = {
      x: e.clientX,
      y: e.clientY,
    };
  }

  var lastUpdate = Date.now();

  function tick() {
    var now = Date.now();
    var dt = now - lastUpdate;
    lastUpdate = now;

    frame += dt;

    if (hand?.style !== undefined) 
      hand.style.top = (mouse.y + Math.sin(frame*0.01)*5)+"px";
    if (petfloat?.style !== undefined) {
      petfloat.style.left = (window.innerWidth/2 + Math.sin(frame*0.001)*250) + "px";
      petfloat.style.top = (window.innerHeight/2 + Math.sin(frame*0.0005)*300) + "px";
    }
  }

  export function createNotif(label: string, style: string) {
    let uu = Math.floor(Math.random()*9999999999).toString()
    let t = Date.now()
    notifPos[t] = mouse
    notifs.push({
      label: label,
      style: style,
      uuid: uu,
      time: t
    })

    setTimeout(() => {
      notifs = notifs.filter(a => a.uuid !== uu)
    }, 400)

    
  }
  
  setInterval(tick, 0);
  $: yoshiObj = constants.yoshis[(curYoshi + constants.yoshis.length*9999) % constants.yoshis.length]
  let cl2;
  let cps = 0;
  {
    let count = 0;
    let numSec = 1;
    let start = 0;
    getCPS();

    function getCPS() {
      
      setTimeout(function() {
        if (count > 25) {
          $usedAutoclicker = true;
          int.save.saveSave()
        }
        cps = count;
        count = 0;
        getCPS();
        
      }, numSec*1000);
    }

    function cl(e: MouseEvent) {count++;
    start++;}

    cl2 = cl
  }
  

  function handleKeypress(e: KeyboardEvent) {
    // console.log(e)
  }
  {
    const inst = instance
    const int = setInterval(() => {
      if (instance !== inst) return clearInterval(int);
      let regen = yoshiObj.regen
      if (cps > 20) regen *= 15;
      $hp += regen
      if (regen > 0) {
        if ($hp > yoshiObj.hp) {
          $hp = yoshiObj.hp
        }
        else createNotif(`Regened ${regen} HP!`, "color: red;")
      }
      
      {
        //console.log($ownedPets, $curPet)
        if (constants.pets[$ownedPets[$curPet]?.[0]]?.perks(getLevelsNoLocal($ownedPets[$curPet]).level) !== undefined) {
          let base = 0;
          // console.log(constants.pets[$ownedPets[$curPet][0]].perks(getLevelsNoLocal($ownedPets[$curPet]).level))
          base += constants.pets[$ownedPets[$curPet][0]].perks(getLevelsNoLocal($ownedPets[$curPet]).level)?.autoAdd ?? 0
          base *= 1 + (constants.pets[$ownedPets[$curPet][0]].perks(getLevelsNoLocal($ownedPets[$curPet]).level)?.autoMul ?? 0)
          $hp -= base;
          checkHealth()
          if (base !== 0) createNotif(`-${base.toFixed(2)}HP | Pet`, `color: green;`)
          
        }
        
      }
      
    }, 1000)
  }
  
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<main on:click={
  (e) => {
    click(e)
    cl2(e)
  }
} on:mousemove={mousemove} on:keypress={handleKeypress}>
  <!-- <Intro></Intro> -->
  <DevConsole></DevConsole>
  <div class="main-info">
    <img src="logo.png" alt="Da Yoshi" class="logo"><br>
    <span class="info-label">HP: <div class="bar-full"><div class="bar-bar" style={`width: ${$hp / yoshiObj.hp * 100}%;`}></div><span>{$hp.toFixed(2)} / {yoshiObj.hp}</span></div></span><br>
    <span class="info-label">Hits: {$hits}</span><br>
    <span class="info-label">Deaths: {$deaths}</span><br>
    <button on:click={() => shopComponent.toggle()}>Toggle Shop</button>
    <button on:click={() => petmenuComponent.toggle()}>Toggle Pet Menu</button>
    <button on:click={() => inventoryComponent.toggle()}>Toggle Inventory</button>
    <br>
    <button on:click={() => setTimeout(() => {
      if (confirm("Are you sure you want to reset?")) {localStorage.removeItem("save"); location.reload()}
    }, 0)}>Reset</button>
    <button on:click={() => setTimeout(() => {
      int.save.loadSave(prompt("Save String: "))
      
    }, 0)
      }>Import Save</button>
    <button on:click={() => prompt(`Copy this:`, localStorage.getItem("save"))}>Export Save</button><br>
    <button on:click={() => {curYoshi--; setTimeout(() => $hp = yoshiObj.hp, 0)}}>Previous Yoshi</button>
    <button on:click={() => {curYoshi++; setTimeout(() => $hp = yoshiObj.hp, 0)}}>Next Yoshi</button>
    {#if $usedDev}<br>Used Dev :&lt;{/if}
  </div>
  <div class="yoshi" bind:this={yoshi} unselectable>
    <img src={yoshiimg} alt="Yoshi" />
  </div>
  <span class="bottom-info">{yoshiObj.name}</span>
  <div class="hand" bind:this={hand} unselectable>
    <img src={handimg} alt="Hand" />
  </div>
  <img src={pets?.[$ownedPets?.[$curPet]?.[0]]?.source ?? ""} alt="" class="pet-hand" bind:this={petfloat} />
  {#each notifs as notif}
    <Notif label={notif.label} style={notif.style} pos={notifPos[notif.time]}></Notif>
  {/each}
  <Shop bind:this={shopComponent}></Shop>
  <PetShop bind:this={petmenuComponent} parent={this}></PetShop>
  <InventoryMenu bind:this={inventoryComponent}></InventoryMenu>
  
</main>
