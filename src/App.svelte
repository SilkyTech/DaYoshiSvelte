<script lang="ts">
  import Notif from './lib/Notif.svelte'
  import Intro from './lib/Intro.svelte'
  import * as constants from "./lib/constants"
  import { skins, pets } from './lib/constants'
  import { game } from './lib/stores'
  import DevConsole from './lib/DevConsole.svelte'
  import * as int from './lib/Internal' 
  import { getLevels } from './lib/utils'

  const { 
    hits, deaths, hp, 
    usedDev, usedAutoclicker, boughtSkins, 
    curPet, ownedPets, curSkin } = game
  
  let yoshi: HTMLDivElement;
  let yoshiimg: string = "idle/yoshi.png";
  let hand: HTMLDivElement;
  let handimg: string = "hand/hand.png";
  let shopactive: boolean = false, petmenuactive: boolean = false, boxscroll: boolean = false;

  let mouse = { x: 0, y: 0 };
  let frame = 0;
  let notifs: {label: string, style: string, uuid: string, time: number}[] = [];
  let notifPos: {[time: number]: {x: number, y: number}} = {}

  $usedDev = false;

  int.save.loadSave()

  let boxLeft = 0;
  //console.log(ownedPets)
  
  //console.log(ownedPets)
  
  function getDamage() {
    let base = 1;
    if ($curPet !== -1) {
      let cPet = boughtPets[$curPet];
      let level = getLevels(cPet).level;
      let outcome = cPet.pet.perks(level);
      if (outcome.hitAdd) {
        base += outcome.hitAdd
      }
      if (outcome.hitMul) {
        base *= outcome.hitMul + 1
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
      createNotif("Blocked!", "")
    } else {
      $hits++;
      createNotif(`Normal Hit | -${getDamage().toFixed(2)} HP`, "")
      yoshiimg = getSkin().hit[1]
      $hp -= getDamage();
      if ($curPet !== -1) $ownedPets[$curPet][1]++;
    }

    if ($hp < 1) {
      $hp = 100;
      $deaths++;
    }

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
  }

  function createNotif(label: string, style: string) {
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

  function buySkin(ind: number) {
    if ($boughtSkins.has(ind)) return;
    if ($deaths >= skins[ind][3]) {
      $deaths -= skins[ind][3];
      $boughtSkins.add(ind)
      $boughtSkins = $boughtSkins
      int.save.saveSave()
    }
  }

  function equipSkin(skin: number) {
    let skin$ = skins[skin]
    $curSkin[skin$[0]] = skin
    
  }

  $: boughtNums = Array.from($boughtSkins).map((a, i) => [skins[a], a]).sort((a, b) => a[0][3] - b[0][3]) as [["normal" | "hit" | "block", string, string, number], number][]
  $: enumSkins = skins.map((a, i) => [a, i, $boughtSkins.has(i)]) as [["normal" | "hit" | "block", string, string, number], number, boolean][]

  console.log($curSkin)

  $: boughtPets = $ownedPets.map((p, i) => ({xp: p[1], pet: pets[p[0]], i: i}))

  function buyBox(boxType: number) {
    boxLeft = 0;
    switch(boxType) {
      case 1:
        if ($deaths >= 50) {
          $deaths -= 50;
          boxOpen(boxType)
        }
        break;
      case 2:
        if ($deaths >= 300) {
          $deaths -= 300;
          boxOpen(boxType)
        }
        break;
      
    }
  }

  let boxitems: [typeof pets[0], boolean][] = []

  async function boxOpen(id: number) {
    let things = constants.boxChances[id];
    let uncollapsed = []
    things.forEach(a => {
      for (let i = 0; i < a[1]; i++) uncollapsed.push(a[0])
    })

    let chosen = Math.floor(Math.random()*uncollapsed.length) + uncollapsed.length
    console.log(chosen, uncollapsed.length)
    uncollapsed = uncollapsed.concat(uncollapsed).concat(uncollapsed).sort(() => Math.random()-Math.random())
    boxitems = uncollapsed.map((a, i) => [pets[a], i === chosen])
    boxscroll = true;
    setTimeout(() => {
      boxLeft = window.innerWidth*2-(chosen*140);
      setTimeout(() => {
        boxLeft = 0;
        boxscroll = false;
        $ownedPets.push([uncollapsed[chosen], 0])
        int.save.saveSave()
        $ownedPets = $ownedPets
      }, 3000)
    }, 1000)
    
  }


  function equipPet(id: number): void {
    $curPet = id
  }

  
  function salvage(pet: number) {
    if (confirm(`Are you sure you want to salvage your ${pets[$ownedPets[pet][0]].name} for ${pets[$ownedPets[pet][0]].salvage} deaths?`)) {
      $curPet--;
      $ownedPets = $ownedPets.filter((a, i) => {
        if (i !== pet) return true;
        else {
          $deaths += pets[a[0]].salvage
          return false
        };
      });
      int.save.saveSave()
    }
    
  }
  let cl2;
  {
    let count = 0;
    let numSec = 1;
    let start = 0;
    getCPS();

    function getCPS() {
      
      setTimeout(function() {
        if (count > 20) {
          $usedAutoclicker = true;
          int.save.saveSave()
        }
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
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<main on:click={
  (e) => {
    click(e)
    cl2(e)
  }
} on:mousemove={mousemove} on:keypress={handleKeypress}>
  <Intro></Intro>
  <DevConsole></DevConsole>
  <div class="main-info">
    <img src="logo.png" alt="Da Yoshi" class="logo"><br>
    <span class="info-label">HP: <div class="bar-full"><div class="bar-bar" style={`width: ${$hp}%;`}></div><span>{$hp.toFixed(2)} / 100</span></div></span><br>
    <span class="info-label">Hits: {$hits}</span><br>
    <span class="info-label">Deaths: {$deaths}</span><br>
    <button on:click={() => shopactive = !shopactive}>Toggle Shop</button>
    <button on:click={() => petmenuactive = !petmenuactive}>Toggle Pet Menu</button>
    <button on:click={() => setTimeout(() => {localStorage.removeItem("save"); location.reload()}, 0)}>Reset</button><br>
    <button on:click={() => setTimeout(() => {localStorage.setItem("save", prompt("Save String: ")); location.reload()}, 0)}>Import Save</button>
    <button on:click={() => prompt(`Copy this:`, localStorage.getItem("save"))}>Export Save</button>
    {#if $usedDev}<br>Used Dev :&lt;{/if}
  </div>
  <div class="yoshi" bind:this={yoshi} unselectable>
    <img src={yoshiimg} alt="Yoshi" />
  </div>
  <div class="hand" bind:this={hand} unselectable>
    <img src={handimg} alt="Hand" />
    <img src={pets?.[ownedPets?.[$curPet]?.[0]]?.source ?? ""} alt="" class="pet-hand">
  </div>
  {#each notifs as notif}
    <Notif label={notif.label} style={notif.style} pos={notifPos[notif.time]}></Notif>
  {/each}
  <div class={"shop " + (shopactive ? "shop-active" : "")}>
    <div class="shop-items">
      {#each enumSkins as skin}
      {#if !skin[2]}
        <div class={"shop-panel " + skin[0][0]}>
          
          <button on:click={() => buySkin(skin[1])} >
            <img src={skin[0][1]} alt={skin[0][2]} class={"shop-item "}><br>
            Buy {skin[0][2]} for {skin[0][3]} deaths | {skin[0][0]}
          </button>
          
        </div>
      {:else}
        <div class="shop-panel equip">
          
          <button on:click={() => equipSkin(skin[1])} disabled={
            $curSkin.normal === skin[1] || $curSkin.hit === skin[1] || $curSkin.block === skin[1]
          }>
            <img src={skin[0][1]} alt={skin[0][2]} class="shop-item equip"><br>
              Equip {skin[0][2]} | {skin[0][0]} Type
            </button>
          
        </div>
      
      {/if}
      
      {/each}
    </div>
  </div>
  <div class={"petmenu" + (petmenuactive ? " petmenu-active" : "")}>
    <span class="info-label">Buy Menu:</span><br>
    <button on:click={() => buyBox(1)}>Buy Common Box | 50 Deaths</button>
    <button on:click={() => buyBox(2)}>Buy Rare Box | 300 Deaths</button>
    <hr>
    Current Pet: {$curPet === -1 ? "None" : boughtPets[$curPet].pet.name}<br>
    Level: {getLevels(boughtPets[$curPet]).level}<br>
    EXP to next Level: {getLevels(boughtPets[$curPet]).xp}<br>
    Description: {getLevels(boughtPets[$curPet]).desc}<br>
    <button on:click={() => salvage($curPet)}>Salvage</button>
    <hr>
    <div class="shop-items">
      {#each boughtPets as pet}
        <div class="shop-panel equip">
          <button on:click={() => equipPet(pet.i)} disabled={pet.i === $curPet}>
            <img src={pet.pet.source} alt={pet.pet.name} class="shop-item equip"><br>
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
</main>
