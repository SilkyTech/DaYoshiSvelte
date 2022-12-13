<script lang="ts">
    import { game } from './stores'
    import * as SaveSystem from './SaveSystem'

    const {
        deaths,
        hits,
        hp
    } = game

    let devOn = false;
    globalThis.toggleDev = (password: string) => {
        if (password === "yoshi is very happy")
        {devOn = !devOn; console.clear()}
        else console.error("Incorrect password! >:(")
    }
    let data: string = "";
    let input: string;

    function error(msg: string, color: string = "red") {
        data += `<span style="color: ${color};">${msg}</span><br>`
    }
    function log(msg: string, color: string = "white") {
        data += `<span style="color: ${color};">${msg}</span><br>`
    }

    function keyPress(e: KeyboardEvent) {
        setTimeout(() => {
            if (e.key === "Enter") {
                log(input, "yellow")
                let args = input.split(" ");
                if (args[0] === "/modify") {
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
                } else if (args[0] === "/view") {
                    if (args[1] === "save") {
                        if (args[2] === "pretty") log(`Save: "${SaveSystem.xor(atob(localStorage.getItem("save")), "yoshiisangry").split("|").join("<br>")}"`)
                        else
                        log(`Save: "${SaveSystem.xor(atob(localStorage.getItem("save")), "yoshiisangry")}"`)
                    }
                }
                else {
                    error(`Unknown command "${args[0]}"`)
                }
                input = ""
            }
            
        }, 0)
    }
</script>

{#if devOn}
<div class="dev">
    <span class="data">{@html data}</span>
    <input type="text" bind:value={input} on:keypress={keyPress}>
</div>
{/if}