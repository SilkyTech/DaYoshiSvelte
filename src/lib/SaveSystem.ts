
import { game } from './stores'
import { get } from 'svelte/store'

const { 
    hits, deaths, hp, 
    usedDev, usedAutoclicker, boughtSkins, 
    curPet, ownedPets, curSkin } = game

export function xor(str: string, shift: string) {
    let newS = ""
    str.split("").forEach((letter, i) => {
        newS += String.fromCharCode(letter.charCodeAt(0)^(shift[i%shift.length].charCodeAt(0)))
    })
    return newS
}

export function loadSave() {
    let save = localStorage.getItem("save")
    if (save !== null) {
        try {
            console.log(save)
            let saveParsed = atob(save)
            saveParsed = xor(saveParsed, "yoshiisangry")
            let parts: any[] = saveParsed.split("|")
            if (parts.length < 6) {return alert("Invalid Save");}
            hits.set((+parts[0]) - (+parts[1]))
            deaths.set((+parts[2]) - (+parts[3]))
            boughtSkins.set(new Set(parts[4].split(',').map(a => parseInt(a))))
            curSkin.set ({
                normal: +parts[5].split(",")[0],
                block: +parts[5].split(",")[2],
                hit: +parts[5].split(",")[1]
            })
            usedDev.set(parts[6] === "true" ? true : false);
            
            if (parts[7].length !== 0) ownedPets.set(parts[7]?.split(',').map((a: string) => a.split("!").map(b => +b)) ?? [])
            
            curPet.set(isNaN(+parts[8]) ? -1 : +parts[8])
            usedAutoclicker.set(parts[9] === "true" ? true : false)
        } catch (e) {
            if (e instanceof DOMException) {
            localStorage.removeItem("save")
            alert("Your save is invalid! Resetting your save for you.")
            location.reload()
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
        get(usedAutoclicker)
    ]
    localStorage.setItem("save", btoa(xor(save.join("|"), "yoshiisangry")))
}