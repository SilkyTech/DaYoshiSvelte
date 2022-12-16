<script lang="ts">
    import { game, Inventory, itemIds } from './stores'
    import * as SaveSystem from './SaveSystem'
  import { boxChances, levelUps, pets } from './constants';
  import { getLevelsNoLocal, median } from './utils';
  import App from '../App.svelte';

    const {
        deaths,
        hits,
        hp,
        ownedPets,
        usedDev,
        inventory
    } = game

    let showToggle = true;
    let devOn = localStorage.getItem('topsecretdevonlyoptiononlydevswillknow') === "supersecretcodethatonlydevsknow";

    let data: string = "Use /toggle to toggle visibility<br>";
    let input: string;

    function error(msg: string, color: string = "red") {
        data += `<span style="color: ${color};">${msg}</span><br>`
    }
    function log(msg: string, color: string = "white") {
        data += `<span style="color: ${color};">${msg}</span><br>`
    }
    let prevCmds = []
    let ind = 0;

    function keyPress(e: KeyboardEvent) {
        setTimeout(() => {
            console.log(e)
            if (e.key === "ArrowUp") {
                ind++
                if (ind > prevCmds.length) ind = prevCmds.length
                input = prevCmds[prevCmds.length-ind]
            } else if (e.key === "Enter") {
                ind = 0;
                log(input, "yellow")
                let args = input.split(/\s+/g);
                if (["/modify", "/m", "/mod"].includes(args[0])) {
                    if (args[1] === "deaths") {
                        if (!isNaN(parseInt(args[3]))) {
                            if (args[2] === "add") $deaths += parseInt(args[3])
                            if (args[2] === "set") $deaths = parseInt(args[3])
                            if (args[2] === "clear") $deaths = 0
                            log(`Successful modification of deaths`)
                        } else {
                            error("Argument 3 of modify command wasn't a number")
                        }
                    } else if (args[1] === "hits") {
                        if (!isNaN(parseInt(args[3]))) {
                            if (args[2] === "add") $hits += parseInt(args[3])
                            if (args[2] === "set") $hits = parseInt(args[3])
                            if (args[2] === "clear") $hits = 0
                            log(`Successful modification of hits`)
                        } else {
                            error("Argument 3 of modify command wasn't a number")
                        }
                    } else if (args[1] === "hp") {
                        if (!isNaN(parseInt(args[3]))) {
                            if (args[2] === "add") $hp += parseInt(args[3])
                            if (args[2] === "set") $hp = parseInt(args[3])
                            if (args[2] === "clear") $hp = 0
                            log(`Successful modification of hp`)
                        } else {
                            error("Argument 3 of modify command wasn't a number")
                        }
                    } else {
                        error(`Unknown property "${args[1]}"`)
                    }
                } else if (["/view", "/v"].includes(args[0])) {
                    if (args[1] === "save") {
                        if (args[2] === "pretty") log(`Save: "${SaveSystem.xor(atob(localStorage.getItem("save")), "yoshiisangry").split("|").join("<br>")}"`)
                        else
                        log(`Save: "${SaveSystem.xor(atob(localStorage.getItem("save")), "yoshiisangry")}"`)
                    }
                } else if (["/clear", "/cls", "/c"].includes(args[0])) {
                    data = ""
                } else if (["/pet", "/p"].includes(args[0])) {
                    if (["list-pets", "lp"].includes(args[1])) {
                        pets.forEach((pet, i) => {
                            data += `ID: ${i} - ${pet.name}<br>`
                        })
                    } else if (["add", "a"].includes(args[1])) {
                        if (isNaN(+args[2]) || isNaN(+args[3])) {
                            error(`Either pet ID or XP level was not a number`)
                        } else {
                            $ownedPets.push([+args[2], +args[3]])
                            $ownedPets = $ownedPets
                            log(`Successfully added a ${pets[+args[2]].name} to your owned pets with xp ${+args[3]}`)
                        }
                       
                    } else if (["remove", "rem", "rm", "r"].includes(args[1])) {
                        if (isNaN(+args[2])) {
                            error(`Pet index has to be a number`)
                        } else {
                            if (+args[2] < 0 || +args[2]-1 > $ownedPets.length) {
                                error(`Pet index outside of bounds (min: 0, max: ${$ownedPets.length-1})`)
                            } else {
                                log(`Removed pet in index: ${+args[2]}, name: ${pets[$ownedPets[+args[2]][0]].name}`)
                                $ownedPets = $ownedPets.filter((_, i) => i !== +args[2])
                            }
                        }
                    } else if (["help", "h"].includes(args[1])) {
                        log(`/pet - HELP MENU<br>/pet list-pets|lp - lists all pets<br>/pet add|a {id:number} {xp:number} - adds a pet to the inventory with specified properties<br>/pet remove|rem|rm|r {index:number} - removes pet in pet inventory with index {index}<br>`
                        + `/pet set-xp|sxp|sx {petindex:number} {xp:number}<br>/pet set-level|slevel|slev|sl {petindex:number} {level:0-50}<br>/pet damage-suite|ds {id:number} {level:number} {runs:number} - runs a damage test suite<br>`
                        + ``)
                    } else if (["set-xp", "sxp", "sx"].includes(args[1])) {
                        if (isNaN(+args[2]) || isNaN(+args[3])) {
                            error(`Either argument 3 or 4 is not a valid number`)
                        } else {
                            $ownedPets[+args[2]][1] = +args[3]
                            log(`Set pet with index ${+args[2]}'s xp to ${+args[3]}`)
                        }
                    } else if (["set-level", "slevel", "slev", "sl"].includes(args[1])) {
                        if (isNaN(+args[2]) || isNaN(+args[3])) {
                            error(`Either argument 3 or 4 is not a valid number`)
                        } else {
                            let tot = 0;
                            levelUps.slice(0, +args[3]).forEach(a => {
                                tot += a;
                            })  
                            $ownedPets[+args[2]][1] = tot
                            log(`Set pet with index ${+args[2]}'s xp to ${tot}`)
                        }
                    } else if (["list-inv", "li"].includes(args[1])) {
                        let i = 0;
                        for (const pet of $ownedPets) {
                            let sPet = pets[pet[0]]
                            log(`Index: ${i} | ${sPet.name}: Level ${getLevelsNoLocal(pet).level}`)
                            i++;
                        }
                    } else if (["damage-suite", "ds"].includes(args[1])) {
                        log(`Damage suite for ${pets[+args[2]].name} at level ${+args[3]}:`)
                        let total = 0;
                        let damages = []
                        for (let i = 0; i < +args[4]; i++) {
                            let base = 1;
                            let cPet = pets[+args[2]];
                            let level = +args[3];
                            let outcome = cPet.perks(level);
                            if (outcome.hitAdd) {
                                base += outcome.hitAdd
                            }
                            if (outcome.hitMul) {
                                base *= outcome.hitMul + 1
                            }
                            log(`&nbsp;&nbsp;Run #${i+1} - ${base} damage dealt`)
                            total += base;
                            damages.push(base)
                        }
                        log(`Mean: ${total/+args[4]} | Median: ${median(damages)}<br>Min: ${Math.min(...damages)} | Max: ${Math.max(...damages)}`)
     
                    } else if (["info", "i"].includes(args[1])) {
                        let sPet = pets[$ownedPets[+args[2]][0]];
                        
                        log(`Pet number ${+args[2]}:`)
                        log(`&nbsp;&nbsp;Name: ${sPet.name}<br>&nbsp;&nbsp;Description: ${sPet.description}`)
                        log(`&nbsp;&nbsp;Source Image: ${sPet.source}<br>&nbsp;&nbsp;Salvage Worth: ${sPet.salvage}`)
                        log(`&nbsp;&nbsp;Level: ${getLevelsNoLocal($ownedPets[+args[2]]).level}<br>&nbsp;&nbsp;XP left: ${getLevelsNoLocal($ownedPets[+args[2]]).xp}`)
                        log(`&nbsp;&nbsp;Total XP: ${$ownedPets[+args[2]][1]}`)
                    } else if (["all-suite", "as"].includes(args[1])) {
                        let outcomes: {mean: number, name: string}[] = []               
                        
                        for (const l of pets) {
                            log(`Damage suite for ${l.name} at level ${+args[2]}:`)
                            let total = 0;
                            let damages = []
                            for (let i = 0; i < +args[3]; i++) {
                                let base = 1;
                                let level = +args[3];
                                let outcome = l.perks(level);
                                if (outcome.hitAdd) {
                                    base += outcome.hitAdd
                                }
                                if (outcome.hitMul) {
                                    base *= outcome.hitMul + 1
                                }
                                log(`&nbsp;&nbsp;Run #${i+1} - ${base} damage dealt`)
                                total += base;
                                damages.push(base)
                            }
                            log(`Mean: ${total/+args[3]} | Median: ${median(damages)}<br>Min: ${Math.min(...damages)} | Max: ${Math.max(...damages)}`)
                            outcomes.push({mean: total/+args[3], name: l.name})
                        }

                        outcomes.sort((a, b) => b.mean-a.mean).forEach((out, i) => {
                            log(`#${i+1} | ${out.name} - ${out.mean} Damage (Average)`)
                        })
                    }
                } else if (["/save"].includes(args[0])) {
                    SaveSystem.saveSave()
                    log(`Saved save`)
                } else if (["/load"].includes(args[0])) {
                    SaveSystem.loadSave()
                    log(`Loaded save`)
                } else if (["/toggle", "/t"].includes(args[0])) {
                    showToggle = !showToggle
                } else if (["/boxchances", "/bc"].includes(args[0])) {
                    for (let id in boxChances) {
                        let obj = boxChances[id]
                        log(`Box ${id} : Chances`)
                        let tot = 0;
                        obj.forEach(a => tot += a[1])
                        obj.forEach(o => {
                            log(`&nbsp;&nbsp;${pets[o[0]].name} | ${(o[1]/tot*100).toFixed(2)}%`)
                        })
                    }
                } else if (["/b64xor"].includes(args[0])) {
                    log(btoa(SaveSystem.xor(args[1], "yoshiisangry")))
                } else if (["/help"].includes(args[0])) {
                    log(`== commands ==`)
                    log((`\t/m(od(ify)) deaths|hp|hits add|set {amount:number}<br>`
                    + "\t/v(iew) save (pretty)<br>"
                    + "\t/c(lear)<br>"
                    + "\t/p(et) - Check /pet help<br>"
                    + "\t/save /load - self explanatory<br>"
                    + "\t/t(oggle)<br>"
                    + "\t/boxchances|/bc - Shows percentages for all boxes<br>"
                    + "\t/b64xor encrypts a string into save file format<br>"
                    + "\t/help<br>").replace(/\t/g, "&nbsp;&nbsp;"))
                } else if (["/inv", "/i"].includes(args[0])) {
                    if (["add", "a"].includes(args[1])) {
                        let newInv = Inventory.from($inventory);
                        newInv.addItem(Object.keys(itemIds)[+args[2]] as keyof typeof itemIds, +args[3])
                        $inventory = newInv.items
                    } else if (["list", "l"].includes(args[1])) {
                        Object.keys(itemIds).forEach((a, i) => {
                            log(`#${i} - ${a}`)
                        })
                    }
                }
                else {
                    error(`Unknown command "${args[0]}"`)
                }
                prevCmds.push(input)
                input = ""
                $usedDev = true
                SaveSystem.saveSave()
            } else {
                ind = 0;
            }
            
        }, 0)
    }

    const sayMessage = () => {
        const messages = [
            "=== imagine trying to hack this ===",
            "-== Arms weak like moms spaghetti ==-",
            "-=- What if, you were smart? -=-",
            "=-= 'Z2V0IGplYmFpdGVk' =-=",
            "==- The save code format isnt hard -==",
            "*=* Woah, a moron appears *=*",
            "=*= Walter White makes [REDACTED] =*=",
            "*== The dev team is actually quite small ==*",
            "==* Only silky and daniel have access *==",
            "pdp This is quite bruh qbq",
            ">>> Neighbours being the definition of annoying <<<",
            "<>< Me when i want banana ><>",
            "><> Get ~~~~~~~'ed <><"
        ]

        let msg = messages[Math.floor(Math.random() * messages.length)]
        let styles = []
        let letters = []

        msg.split("").forEach(letter => {
            styles.push(`font-size: ${Math.random()/3 + 1}rem; color: #${Math.floor(Math.random()*9)}${Math.floor(Math.random()*9)}${Math.floor(Math.random()*9)};`)
            letters.push("%c" + letter)
        })
        console.log("\n" + letters.join(""), ...styles)
    }

    setInterval(() => {
        if (Math.random() < 0.1) {
            sayMessage()
        }
    }, 10000)
    sayMessage()
</script>

{#if devOn}
<div class="dev" draggable="true" style={showToggle ? "height: 100vh;" : ""}>
    <input type="text" bind:value={input} on:keydown={keyPress}>
    {#if showToggle}
    <span class="data">{@html data}</span>
    {/if}
</div>
{/if}