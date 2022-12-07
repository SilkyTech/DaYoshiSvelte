<script lang="ts">
  import Notif from './lib/Notif.svelte'

  let yoshi: HTMLDivElement;
  let yoshiimg: string = "idle/yoshi.png";
  let hand: HTMLDivElement;
  let handimg: string = "hand/hand.png";
  
  let mouse = { x: 0, y: 0 };
  let frame = 0;
  let notifs: {label: string, style: string, uuid: string, time: number}[] = [];
  let notifPos: {[time: number]: {x: number, y: number}} = {}
  let skins: ["normal" | "hit" | "block", string, string, number][] = [
    ["normal", "idle/yoshi.png", "Normal Yoshi", -1],
    ["hit", "hit/sadyoshi.png", "Sad Yoshi", -1],
    ["block", "block/yoshiblock.png", "Blocking Yoshi", -1],
    ["normal", "idle/redyoshi.png", "Red Yoshi", 5],
    ["hit", "hit/cryingyoshi.png", "Crying Yoshi", 15],
    ["hit", "hit/tearyoshi.png", "Tear Yoshi", 20]
  ]
  let curSkin = {
    hit: 1,
    block: 2,
    normal: 0
  };
  let hits = 0;

  function getSkin() {
    return {
      hit: skins[curSkin.hit],
      block: skins[curSkin.block],
      normal: skins[curSkin.normal],
    }
  }

  function click(e: MouseEvent) {
    hand.classList.add("hit");
    let missChance = Math.random() < 0.2;
    if (missChance) {
      yoshiimg = getSkin().block[1]
      
    } else {
      hits++;
      createNotif("Normal Hit | -1 HP", "")
    }

    yoshi.classList.add("hit");

    setTimeout(() => {
      yoshi.classList.remove("hit");
      hand.classList.remove("hit");
    }, 200);

    setTimeout(() => {
      yoshiimg = getSkin().normal[1]
    }, 300)
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
    let uu = globalThis.crypto.randomUUID()
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
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<main on:click={click} on:mousemove={mousemove}>
  <div class="main-info">
    <span class="info-label">Hits: {hits}</span>
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
</main>
