<script lang="ts">
  import Notif from './lib/Notif.svelte'
  import Intro from './lib/Intro.svelte'
  let yoshi: HTMLDivElement;
  let yoshiimg: string = "idle/yoshi.png";
  let hand: HTMLDivElement;
  let handimg: string = "hand/hand.png";
  let shopactive: boolean = false;
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

  loadSave()

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
      usedDev = Boolean(parts[6]);
    }
  }

  function saveSave() {
    let r1 = Math.floor(Math.random()*9999)
    let r2 = Math.floor(Math.random()*9999)
    let save = [hits+r1, r1, deaths+r2, r2, Array.from(boughtSkins).join(","), [curSkin.normal, curSkin.hit, curSkin.block].join(","), usedDev]
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
      createNotif("Normal Hit | -1 HP", "")
      yoshiimg = getSkin().hit[1]
      hp--;
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

    if (hand !== null) 
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
      // console.log(`bought skin: ${ind}`, boughtSkins)
      saveSave()
    }
  }

  function equipSkin(skin: number) {
    // console.log(skin)
    let skin$ = skins[skin]
    curSkin[skin$[0]] = skin
  }

  $: boughtNums = Array.from(boughtSkins).map((a, i) => [skins[a], a]).sort((a, b) => a[0][3] - b[0][3]) as [["normal" | "hit" | "block", string, string, number], number][]
  $: enumSkins = skins.map((a, i) => [a, i, boughtSkins.has(i)]) as [["normal" | "hit" | "block", string, string, number], number, boolean][]

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
    }
    usedDev = true;
    saveSave()
    console.clear()
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<main on:click={click} on:mousemove={mousemove}>
  <Intro></Intro>
  <div class="main-info">
    <img src="logo.png" alt="Da Yoshi" class="logo"><br>
    <span class="info-label">HP: <div class="bar-full"><div class="bar-bar" style={`width: ${hp}%;`}></div><span>{hp} / 100</span></div></span><br>
    <span class="info-label">Hits: {hits}</span><br>
    <span class="info-label">Deaths: {deaths}</span><br>
    <button on:click={() => shopactive = !shopactive}>Toggle Shop</button>
    <button on:click={() => setTimeout(() => {localStorage.removeItem("save"); location.reload()}, 0)}>Reset</button>
    {#if usedDev} Used Dev :&lt;{/if}
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
</main>
