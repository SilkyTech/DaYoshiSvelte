import type { Item } from "./stores"

export const levelUps = [
    50,
    100,
    150,
    150,
    250,
    //
    300,
    350,
    400,
    450,
    500,
    //
    600,
    700,
    800,
    900,
    1000,
    //
    1100,
    1200,
    1300,
    1400,
    1500,
    //
    1700,
    1900,
    2100,
    2300,
    2500,
    //
    2800,
    3100,
    3400,
    3700,
    4000,
    //
    4400,
    4800,
    5200,
    5600,
    6000,
    //
    6500,
    7000,
    7500,
    8000,
    8500,
    //
    9000,
    9600,
    10200,
    10800,
    11500,
    //
    13000,
    14000,
    15000,
    16000,
    17000,
    //
    17500,
    19000,
    20000,
    22000,
    24000,
    //
    26000,
    27000,
    28000,
    29000,
    30000,
    //
    32000,
    34000,
    36000,
    38000,
    40000,
    //
    43000,
    46000,
    49000,
    52000,
    55000,
    //
    60000,
    64000,
    68000,
    69420,
    70000,
    //
    75000,
    80000,
    85000,
    90000,
    95000,
    //
    100000,
    110000,
    120000,
    130000,
    140000,
    //
    150000,
    169420,
    170000,
    180000,
    190000,
    //
    200000,
    210000,
    220000,
    230000,
    240000,
    //
    250000,
    260000,
    270000,
    280000,
    290000,
    //
    300000,
    320000,
    340000,
    360000,
    380000,
    //
    400000,
    420000,
    440000,
    460000,
    480000,
    500000,
    //
    525000,
    550000,
    575000,
    600000,
    625000,
    //
    650000,
    675000,
    696969,
    700000,
    //
    740000,
    780000,
    820000,
    860000,
    900000,
    //
    950000,
    1000000, //You have reached max XP for nex tier 
    1000000, 
    1000000,
    1000000,
    //
    1000000,
    1000000,
    1000000,
    1000000,
    1000000,
    //
    1000000,
    1000000,
    1000000,
    1000000,
    1000000,
    //
    1000000,
    1000000,
    1000000,
    1000000,
    1000000,
    //
    1000000,
    1000000,
    1000000,
    1000000,
    1000000,
    //
    1000000,
    1000000,
    1000000,
    1000000,
    1000000,
    //
    1000000,
    1000000,
    1000000,
    1000000,
    1000000,
    //
    1000000,
    1000000,
    1000000,
    1000000,
    1000000,
    1000000,
    //
    1000000,
    1000000,
    1000000,
    1000000,
    1000000,
    //
    1000000,
    1000000,
    1000000,
    1000000,
    1000000,
    //
    1000000,
    1000000,
    1000000,
    1000000,
    1000000,
    //
    1000000,
    1000000,
    1000000,
    1000000,
    1000000,
    //
    1000000,
    1000000,
    1000000,
    1000000,
    1000000,
    //
    1000000,
    1000000,
    1000000,
    1000000,
    1000000,
    //
    1000000,
    1000000,
    1000000,
    1000000,
    //
    Infinity
]

export const boxChances: {[id: number]: [number, number][]} = {
    1: [[0, 19], [1, 4], [2, 1], [5, 2]],
    2: [[0, 100], [1, 40], [2, 8], [3, 1], [5, 6]],
    3: [[0, 30], [6, 30], [1, 20], [7, 10], [2, 8], [4, 2], [5, 3]],
    4: [[0, 8], [8, 30], [9, 2], [1, 16], [10, 5], [12, 7]]
}

export const boxes: {[id: number]: [string, string, number]} = {
    1: ["Common Box", "box/commonbox.png", 50],
    2: ["Rare Box", "box/rarebox.png", 300],
    3: ["Lava Box", "box/lavabox.png", 500],
    4: ["Mario Box","box/commonbox.png", 700], // TODO: add mario box texture
}

export const skins: ["normal" | "hit" | "block", string, string, number][] = [
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

export const pets: {
    name: string,
    perks: (level: number) => {
        hitMul?: number,
        hitAdd?: number,
        autoAdd?: number,
        autoMul?: number,
    },
    source: string,
    description: string,
    salvage: number
}[] = [
    {
        name: "Blue Baby Yoshi",
        perks: (level) => ({hitAdd: level*0.045}),
        source: "pet/bluebabyyoshi.png",
        description: "Blue Baby Yoshi, found from the depths of the common box. Makes you do 0.045*{Pet Level} more damage.",
        salvage: 10,
    }, {
        name: "Green Baby Yoshi",
        perks: (level) => ({hitAdd: level*0.02, hitMul: level*0.02}),
        source: "pet/greenbabyyoshi.png",
        description: "Green Baby Yoshi. Makes you do 0.02*{Pet Level} more damage AND multiplies that by 0.025*{Pet Level}.",
        salvage: 50,
    }, {
        name: "Pink Baby Yoshi",
        perks: (level) => ({hitAdd: level*0.03, hitMul: level*0.02}),
        description: "Pink Baby Yoshi. Makes you do 0.03*{Pet Level} more damage AND multiplies that by 0.02*{Pet Level}.",
        source: "pet/pinkbabyyoshi.png",
        salvage: 75
    }, {
        name: "Glowing Baby Yoshi",
        perks: (level) => ({hitAdd: level*Math.random()/10 + level/15, hitMul: level*Math.random()/70}),
        description: "A glowing baby yoshi. Super fancy. Effects: Unknown",
        source: "pet/glowingbabyyoshi.png",
        salvage: 1000,
    }, {
        name: "Obsidian Baby Yoshi",
        perks: (level) => ({hitAdd: level*0.1, hitMul: Math.random()*level/70}),
        description: "A obsidian baby yoshi found from the lava box, has a random chance to do more or less damage.",
        source: "pet/obsidianbabyyoshi.png",
        salvage: 100,
    }, {
        name: "Your Dad Yoshi",
        perks: (level) => ({hitAdd: -70, hitMul: 0}),
        description: "Your dad that went to the milk store",
        source: "pet/yourdadyoshi.png",
        salvage: -2
    }, {
        name: "Rock Baby Yoshi",
        perks: (level) => ({hitAdd: level*0.045, hitMul: Math.random()*level/100}),
        description: "A baby yoshi formed from volcanic rock, I wonder how that happened.",
        source: "pet/rockbabyyoshi.png",
        salvage: 40,
    }, {
        name: "Red Baby Yoshi",
        perks: (level) => ({hitAdd: level*0.05, hitMul: Math.random()*level/95}),
        description: "A baby yoshi formed from lava, why is it living.",
        source: "pet/redbabyyoshi.png",
        salvage: 60,
    }, {
        name: "Goomba",
        perks: (level) => ({hitAdd: level*0.02, hitMul: 0.02*level + Math.random()}),
        description: "A goomba that doesn't like yoshis.",
        source: "pet/goomba.png",
        salvage: 40,
    }, {
        name: "Galoomba",
        perks: (level) => ({hitAdd: level*0.03, hitMul: 0.03*level + Math.random()}),
        description: "An evolved goomba who hates yoshis.",
        source: "pet/galoomba.png",
        salvage: 90,
    }, {
        name: "Shooter GB Yoshi",
        perks: (level) => ({autoAdd: level*0.015, autoMul: 0.015*level}),
        description: "The green baby yoshi found a gun! I wonder what will happen now?",
        source: "pet/greenshooteryoshi.png",
        salvage: 70
    }, {
        name: "No yoshi",
        perks: (level) => ({autoAdd: level*0, autoMul: 0}),
        description: "Why did you get that ron.",
        source: "pet/yourdadyoshi.png",
        salvage: -69
    }, {
        name: "Grass Baby Yoshi",
        perks: (level) => ({autoAdd: level*0.03, autoMul: 0.02*level}),
        description: "Grass yoshi, the gamers ultimate nemisis.",
        source: "pet/grassbabyyoshi.png",
        salvage: 200
    }
]

export const yoshis: {
    name: string,
    hp: number,
    regen: number,
    reward: number,
    kill: number,
    drops: [Item["id"], number][]
}[] = [
    {
        name: "Normal Yoshi",
        hp: 100,
        regen: 0,
        reward: 1, 
        kill: 5,
        drops: [["Yoshi Sludge", 5]]
    },
    {
        name: "Buff Yoshi",
        hp: 300,
        regen: 1,
        reward: 3,
        kill: 15,
        drops: [["Yoshi Sludge", 9], ["Buff Yoshi Sludge", 17], ["Yoshi Steel", 2]]
    },
    {
        name: "Aunt Yoshi",
        hp: 69420,
        regen: 5,
        reward: 1000,
        kill: 2000,
        drops: [["Pancake", 1]]
    }
]

