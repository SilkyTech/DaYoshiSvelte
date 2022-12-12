<script lang="ts">
  import Notif from './lib/Notif.svelte'
  import Intro from './lib/Intro.svelte'
  import * as constants from "./lib/constants"
  
  let yoshi: HTMLDivElement;
  let yoshiimg: string = "idle/yoshi.png";
  let hand: HTMLDivElement;
  let handimg: string = "hand/hand.png";
  let shopactive: boolean = false, petmenuactive: boolean = false, boxscroll: boolean = false;

  let mouse = { x: 0, y: 0 };
  let frame = 0;
  let notifs: {label: string, style: string, uuid: string, time: number}[] = [];
  let notifPos: {[time: number]: {x: number, y: number}} = {}
  let skins: ["normal" | "hit" | "block", string, string, number][] = [
    ["normal", "idle/yoshi.png", "Normal Yoshi", -1],
    ["hit", "hit/sadyoshi.png", "Sad Yoshi", -1],
    ["block", "block/yoshiblock.png", "Egged Yoshi", -1],
    ["normal", "idle/redyoshi.png", "Red Yoshi", 5],
    ["hit", "hit/cryingyoshi.png", "Crying Yoshi", 15],
    ["hit", "hit/tearyoshi.png", "Tear Yoshi", 20],
    ["normal", "idle/blueyoshi.png", "Blue Yoshi", 15],
    ["normal", "idle/yellowyoshi.png", "Yellow Yoshi", 35],
    ["normal", "idle/pinkyoshi.png", "Pink Yoshi", 50],
    ["block", "block/redshell.png", "Red Shell", 20],
    ["block", "block/blueshell.png", "Blue Shell", 50],
    ["block", "block/spinyshell.png", "Spiny Shell", 100],
    ["block", "block/pinkshell.png", "Pink Shell", 150],
    ["block", "block/greenshell.png", "Green Shell", 5]
  ]

  let pets: {
    name: string,
    perks: (level: number) => {
      hitMul?: number,
      hitAdd?: number,
    },
    source: string,
    description: string,
  }[] = [
    {
      name: "Blue Baby Yoshi",
      perks: (level) => ({hitAdd: level*0.03}),
      source: "pet/bluebabyyoshi.png",
      description: "Blue Baby Yoshi, found from the depths of the common box. Makes you do 0.03*{Pet Level} more damage."
    }, {
      name: "Green Baby Yoshi",
      perks: (level) => ({hitAdd: level*0.02, hitMul: level*0.01}),
      source: "pet/greenbabyyoshi.png",
      description: "Green Baby Yoshi. Makes you do 0.02*{Pet Level} more damage AND multiplies that by 0.01*{Pet Level}."
    }, {
      name: "Pink Baby Yoshi",
      perks: (level) => ({hitAdd: level*0.03, hitMul: level*0.03}),
      description: "Pink Baby Yoshi. Makes you do 0.03*{Pet Level} more damage AND multiplies that by 0.03*{Pet Level}.",
      source: "pet/pinkbabyyoshi.png"
    }
  ]
  let ownedPets: [number, number][] = []

  let curSkin = {
    hit: 1,
    block: 2,
    normal: 0
  };
  let hits = 0;
  let deaths = 0;
  let hp = 100;
  let usedDev = false;

  let boughtSkins = new Set([0, 1, 2])
  let curPet: number = -1;

  let boxLeft = 0;

  loadSave()

  function getDamage() {
    let base = 1;
    if (curPet !== -1) {
      let cPet = boughtPets[curPet];
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

  function loadSave() {
    let save = localStorage.getItem("save")
    if (save !== null) {
      let saveParsed = atob(save)
      let parts: any[] = saveParsed.split("|")
      let version = parts.slice(0)
      hits = (+parts[0]) - (+parts[1])
      deaths = (+parts[2]) - (+parts[3])
      boughtSkins = new Set(parts[4].split(',').map(a => parseInt(a)))
      curSkin = {
        normal: parts[5].split(",")[0],
        block: parts[5].split(",")[2],
        hit: parts[5].split(",")[1]
      }
      usedDev = (parts[6] === "true" ? true : false);
      ownedPets = parts[7]?.split(',')?.map((a: string) => a.split("!").map(b => +b)) ?? []
      curPet = isNaN(+parts[8]) ? -1 : +parts[8]
    }
  }

  function saveSave() {
    let r1 = Math.floor(Math.random()*9999)
    let r2 = Math.floor(Math.random()*9999)
    let save = [
      hits+r1, r1, 
      deaths+r2, r2, 
      Array.from(boughtSkins).join(","), 
      [curSkin.normal, curSkin.hit, curSkin.block].join(","), 
      usedDev,
      ownedPets.map(a => a.join("!")).join(","),
      curPet
    ]
    localStorage.setItem("save", btoa(save.join("|")))
  }

  function getSkin() {
    return {
      hit: skins[curSkin.hit],
      block: skins[curSkin.block],
      normal: skins[curSkin.normal],
    }
  }

  function click(e: MouseEvent) {
    if (e.target instanceof HTMLButtonElement) return;
    hand.classList.add("hit");
    let missChance = Math.random() < 0.2;
    if (missChance) {
      yoshiimg = getSkin().block[1]
      createNotif("Blocked!", "")
    } else {
      hits++;
      createNotif(`Normal Hit | -${getDamage().toFixed(2)} HP`, "")
      yoshiimg = getSkin().hit[1]
      hp -= getDamage();
      if (curPet !== -1) ownedPets[curPet][1]++;
    }

    if (hp < 1) {
      hp = 100;
      deaths++;
    }

    yoshi.classList.add("hit");

    setTimeout(() => {
      yoshi.classList.remove("hit");
      hand.classList.remove("hit");
    }, 100);

    setTimeout(() => {
      yoshiimg = getSkin().normal[1]
    }, 300)
    saveSave()
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
    if (boughtSkins.has(ind)) return;
    if (deaths >= skins[ind][3]) {
      deaths -= skins[ind][3];
      boughtSkins.add(ind)
      boughtSkins = boughtSkins
      saveSave()
    }
  }

  function equipSkin(skin: number) {
    let skin$ = skins[skin]
    curSkin[skin$[0]] = skin
  }

  $: boughtNums = Array.from(boughtSkins).map((a, i) => [skins[a], a]).sort((a, b) => a[0][3] - b[0][3]) as [["normal" | "hit" | "block", string, string, number], number][]
  $: enumSkins = skins.map((a, i) => [a, i, boughtSkins.has(i)]) as [["normal" | "hit" | "block", string, string, number], number, boolean][]

  $: boughtPets = ownedPets.map((p, i) => ({xp: p[1], pet: pets[p[0]], i: i}))

  globalThis.dev = (msg: string) => {
    let args = msg.split(" ")
    if (args[0] === "+") {
      if (args[1] === "death") {
        let amount = parseInt(args[2])
        deaths += amount
      }
      if (args[1] === "hit") {
        let amount = parseInt(args[2])
        hits += amount
      }
    } else if (args[0] === "=") {
      if (args[1] === "death") {
        let amount = parseInt(args[2])
        deaths = amount
      }
      if (args[1] === "hit") {
        let amount = parseInt(args[2])
        hits = amount
      }
    }
    usedDev = true;
    saveSave()
    console.clear()
  }

  function buyBox(boxType: number) {
    boxLeft = 0;
    if (boxType === 1) {
      if (deaths >= 100) {
        deaths -= 100;
        boxOpen(1)
      }
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
    uncollapsed = uncollapsed.concat(uncollapsed).concat(uncollapsed).sort(() => Math.random()-Math.random())
    boxscroll = true;
    boxitems = uncollapsed.map((a, i) => [pets[a], i === chosen])
    setTimeout(() => {
      boxLeft = 0-(chosen*140) + window.innerWidth/2;
      setTimeout(() => {
        boxLeft = 0;
        boxscroll = false;
        ownedPets.push([uncollapsed[chosen], 0])
        saveSave();
        ownedPets = ownedPets
      }, 3000)
    }, 1000)
    
  }


  function equipPet(id: number): void {
    curPet = id
  }

  function getLevels(pet: typeof boughtPets[0]) {
    if (pet === undefined || pet === null) return {level: -1, xp: -1, desc: ""};
    let j = pet.xp;
    let lev = 0;
    let i = 0;
    for (; i < constants.levelUps.length; i++) {
      const xpReq = constants.levelUps[i];
      if (j < xpReq) {
        break;
      }
      j -= xpReq;
      lev++;

    }
    return {level: lev, xp: constants.levelUps[i]-j, desc: pet.pet.description.replace(/\{Pet Level\}/g, lev.toString())}
  }

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<main on:click={click} on:mousemove={mousemove}>
  <Intro></Intro>
  <div class="main-info">
    <img src="logo.png" alt="Da Yoshi" class="logo"><br>
    <span class="info-label">HP: <div class="bar-full"><div class="bar-bar" style={`width: ${hp}%;`}></div><span>{hp.toFixed(2)} / 100</span></div></span><br>
    <span class="info-label">Hits: {hits}</span><br>
    <span class="info-label">Deaths: {deaths}</span><br>
    <button on:click={() => shopactive = !shopactive}>Toggle Shop</button>
    <button on:click={() => petmenuactive = !petmenuactive}>Toggle Pet Menu</button>
    <button on:click={() => setTimeout(() => {localStorage.removeItem("save"); location.reload()}, 0)}>Reset</button>
    {#if usedDev}<br>Used Dev :&lt;{/if}
  </div>
  <div class="yoshi" bind:this={yoshi} unselectable>
    <img src={yoshiimg} alt="Yoshi" />
  </div>
  <div class="hand" bind:this={hand} unselectable>
    <img src={handimg} alt="Hand" />
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
          
          <button on:click={() => equipSkin(skin[1])} >
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
    <button on:click={() => buyBox(1)}>Buy Common Box | 100 Deaths</button>
    <button on:click={() => buyBox(2)}>Buy Rare Box | 1000 Deaths</button>
    <hr>
    Current Pet: {curPet === -1 ? "None" : boughtPets[curPet].pet.name}<br>
    Level: {getLevels(boughtPets[curPet]).level}<br>
    EXP to next Level: {getLevels(boughtPets[curPet]).xp}<br>
    Description: {getLevels(boughtPets[curPet]).desc}
    <hr>
    <div class="shop-items">
      {#each boughtPets as pet}
        <div class="shop-panel equip">
          <button on:click={() => equipPet(pet.i)}>
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
