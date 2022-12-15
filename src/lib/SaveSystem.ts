
import { game, Inventory, itemIds, type Item } from './stores'
import { get } from 'svelte/store'

const { 
    hits, deaths, hp, 
    usedDev, usedAutoclicker, boughtSkins, 
    curPet, ownedPets, curSkin, inventory, equipment } = game

export function xor(str: string, shift: string) {
    let newS = ""
    str.split("").forEach((letter, i) => {
        newS += String.fromCharCode(letter.charCodeAt(0)^(shift[i%shift.length].charCodeAt(0)))
    })
    return newS
}

function dupe<T>(p: T, amount: number) {
    let o = []
    for (let i = 0; i < amount; i++) {
        o.push(p)
    }
    return o;
}

export function loadSave(save?: string): boolean {
    if (save === undefined) {
        save = localStorage.getItem("save")
    }
    if (save !== null) {
        try {
            let saveParsed = atob(save)
            saveParsed = xor(saveParsed, "yoshiisangry")
            let parts: string[] = saveParsed.split("|")
            if (parts.length < 6) {alert("Invalid Save"); return false}
            hits.set((+parts[0]) - (+parts[1]))
            deaths.set((+parts[2]) - (+parts[3]))
            boughtSkins.set(new Set(parts[4].split(',').map(a => parseInt(a))))
            curSkin.set ({
                normal: +parts[5].split(",")[0],
                block: +parts[5].split(",")[2],
                hit: +parts[5].split(",")[1]
            })
            usedDev.set(parts[6] === "true" ? true : false);
            
            if (parts[7].length !== 0) ownedPets.set(parts[7]?.split(',').map((a: string) => a.split("!").map(b => +b)) as any ?? [])
            
            curPet.set(isNaN(+parts[8]) ? -1 : +parts[8])
            usedAutoclicker.set(parts[9] === "true" ? true : false)
            let newInv: Item[] = [];

            (parts[10]?.split(",")?.map((a: string) => 
                dupe({id: Object.keys(itemIds)[+a.split("!")[0]] as keyof typeof itemIds}, +a.split("!")[1])
            ) ?? []).forEach(a => {
                newInv.push(...a)
            });
            

            inventory.set(newInv)

            let equipmentString = parts[11];
            if (equipmentString !== undefined) {
                let seperating = equipmentString.split("!");
                let sword = Object.keys(itemIds)[(+(seperating[0]) === -1 ? undefined : +(seperating[0]))] as keyof typeof itemIds
                let cloak = Object.keys(itemIds)[(+(seperating[1]) === -1 ? undefined : +(seperating[1]))] as keyof typeof itemIds
                let necklace = Object.keys(itemIds)[(+(seperating[2]) === -1 ? undefined : +(seperating[2]))] as keyof typeof itemIds
                equipment.set({
                    sword: sword,
                    cloak: cloak,
                    necklace: necklace
                })
            }

            return true;
        } catch (e) {
            if (e instanceof DOMException) {
                localStorage.removeItem("save")
                alert("Your save is invalid! Resetting your save for you.")
                location.reload()
                return false;
            }
        }
    
    }
}

export function saveSave() {
    let r1 = Math.floor(Math.random()*9999)
    let r2 = Math.floor(Math.random()*9999)
    let save = [
        get(hits)+r1, r1, 
        get(deaths)+r2, r2, 
        Array.from(get(boughtSkins)).join(","), 
        [get(curSkin).normal, get(curSkin).hit, get(curSkin).block].join(","), 
        get(usedDev),
        get(ownedPets).map(a => a.join("!")).join(","),
        get(curPet),
        get(usedAutoclicker),
        Inventory.from(get(inventory)).getItems().map(a => `${Object.keys(itemIds).indexOf(a.id)}!${a.amount}`),
        `${Object.keys(itemIds).indexOf(get(equipment).sword)}!${Object.keys(itemIds).indexOf(get(equipment).cloak)}!${Object.keys(itemIds).indexOf(get(equipment).necklace)}`
    ]
    localStorage.setItem("save", btoa(xor(save.join("|"), "yoshiisangry")))
}