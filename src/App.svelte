<script lang="ts">
  import Notif from './lib/Notif.svelte'
  import Intro from './lib/Intro.svelte'
  import * as constants from "./lib/constants"
  import { skins, pets } from './lib/constants'
  import { game, settings as _settings, itemIds, type Item } from './lib/stores'
  import DevConsole from './lib/DevConsole.svelte'
  import * as int from './lib/Internal' 
  import { getLevels, getLevelsNoLocal } from './lib/utils'
  import Shop from './lib/menus/Shop.svelte';
  import PetShop from './lib/menus/PetShop.svelte';
  import InventoryMenu from './lib/menus/InventoryMenu.svelte'
  import CurvedButton from './lib/component/CurvedButton.svelte';
  import type Modal from './lib/component/Modal.svelte';
  import Settings from './lib/menus/Settings.svelte';
  import Tooltip from './lib/component/Tooltip.svelte';

  const { 
    hits, deaths, hp, 
    usedDev, usedAutoclicker, boughtSkins, 
    curPet, ownedPets, curSkin, inventory, equipment, } = game

  const {
    potato
  } = _settings
  
  let yoshi: HTMLDivElement;
  let yoshiimg: string = "idle/yoshi.png";
  let hand: HTMLDivElement;
  let petfloat: HTMLImageElement; 
  let handimg: string = "hand/hand.png";
  
  let shopComponent: Shop;
  let petmenuComponent: PetShop;
  let inventoryComponent: InventoryMenu;
  let settingsMenu: Settings;

  let mouse = { x: 0, y: 0 };
  let frame = 0;
  let notifs: {label: string, style: string, uuid: string, time: number}[] = [];
  let notifPos: {[time: number]: {x: number, y: number}} = {}

  export let logs: string[] = [];

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
    if (itemIds?.[$equipment.cloak]?.type === "cloak") {
      //@ts-ignore
      base += itemIds[$equipment.cloak].damage
    }
    if (itemIds?.[$equipment.necklace]?.type === "necklace") {
      //@ts-ignore
      base += itemIds[$equipment.necklace].damage
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
      let levels = getLevels(boughtPets[$curPet])
      if ($curPet !== -1) {
        createLog(`Killed ${yoshiObj.name} +${yoshiObj.kill} Pet XP | ${levels.next-levels.xp}/${levels.next}`)
        $ownedPets[$curPet][1] += yoshiObj.kill;
      }
      
      
      $hp = yoshiObj.hp;
      $deaths += yoshiObj.reward;
      

      let inflated: Item["id"][] = []

      yoshiObj.drops.forEach(a => {
        for (let i = 0; i < a[1]; i++) {
          inflated.push(a[0])
        }
      })

      let reward = inflated[Math.floor(Math.random()*inflated.length)];
      $inventory.push({"id": reward});
      $inventory = $inventory
      createLog(`You got a ${reward} from killing ${yoshiObj.name}!`)

      if (yoshiObj.name === "B(r)owser") {
        if (Math.random() < 0.005) {
          
        }
      }
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
    if (!$potato.notifs) return;

    let uu = Math.floor(Math.random()*9999999999).toString()
    let t = Date.now()
    notifPos[t] = {x: mouse.x + Math.random()*40, y: mouse.y + Math.random()*40}
    
    
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

  export function createLog(html: string) {
    logs.push(html);
    logs = logs

    setTimeout(() => {
      logs.splice(logs.indexOf(html), 1);
      logs = logs;
    }, 3000)
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
    
   
    {#if $usedDev}<br>Used Dev :&lt;{/if}
  </div>

  <div class="bottom-icons">
    <Tooltip label="Open Skin Menu">
      <CurvedButton onclick={() => shopComponent.open()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-basket3" viewBox="0 0 16 16">
        <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-1A.5.5 0 0 1 .5 6h1.717L5.07 1.243a.5.5 0 0 1 .686-.172zM3.394 15l-1.48-6h-.97l1.525 6.426a.75.75 0 0 0 .729.574h9.606a.75.75 0 0 0 .73-.574L15.056 9h-.972l-1.479 6h-9.21z"/>
      </svg></CurvedButton>
    </Tooltip>
    
    <!-- ^ Open Inventory -->
    <Tooltip label="Open Pet Menu">
      <CurvedButton onclick={() => petmenuComponent.open()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16">
        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
      </svg></CurvedButton>
    </Tooltip>
    <br>
    <!-- ^ Open Pet Menu -->
    <Tooltip label="Open Inventory">
      <CurvedButton onclick={() => inventoryComponent.open()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-archive" viewBox="0 0 16 16">
        <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
      </svg></CurvedButton>
    </Tooltip>
    
    <!-- ^ Inventory -->
    <Tooltip label="Open Settings">
      <CurvedButton onclick={() => settingsMenu.open()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
      </svg></CurvedButton>
    </Tooltip>
    <br>
    <!-- ^ Settings -->
  </div>

  <Settings bind:this={settingsMenu}></Settings>

  <div class="yoshi" bind:this={yoshi} unselectable>
    <img src={yoshiimg} alt="Yoshi" />
  </div>
  <span class="bottom-info">
    <CurvedButton onclick={() => {curYoshi--; setTimeout(() => $hp = yoshiObj.hp, 0)}}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
      </svg>
    </CurvedButton>
    <span unselectable style="pointer-events: none;">{yoshiObj.name}</span>
    <CurvedButton onclick={() => {curYoshi++; setTimeout(() => $hp = yoshiObj.hp, 0)}}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
      </svg>
    </CurvedButton>
  </span>
  <div class="hand" bind:this={hand} unselectable>
    <img src={handimg} alt="Hand" />
  </div>
  {#if $potato.petAnim}
  <img src={pets?.[$ownedPets?.[$curPet]?.[0]]?.source ?? ""} alt="" class="pet-hand" bind:this={petfloat} />
  {/if}
  {#each notifs as notif}
    <Notif label={notif.label} style={notif.style} pos={notifPos[notif.time]}></Notif>
  {/each}
  <Shop bind:this={shopComponent}></Shop>
  <PetShop bind:this={petmenuComponent} parent={this}></PetShop>
  <InventoryMenu bind:this={inventoryComponent}></InventoryMenu>

  <div class="info">
    {#each logs as log}
      <span class="info-line">{@html log}</span><br>
    {/each}
  </div>
</main>
