<script lang="ts">
    import { game } from '../stores'
    import { skins, pets } from '../constants'
    import * as int from '../Internal' 
    const { 
        hits, deaths, hp, 
        usedDev, usedAutoclicker, boughtSkins, 
        curPet, ownedPets, curSkin } = game
    $: enumSkins = skins.map((a, i) => [a, i, $boughtSkins.has(i)]) as [["normal" | "hit" | "block", string, string, number], number, boolean][]

    let shopactive: boolean = false

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
    
    export function toggle() {
        shopactive = !shopactive
    }
</script>

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