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
    4: [[0, 16], [8, 30], [9, 2], [1, 16], [10, 7], [12, 6], [13, 1]],
    5: [[1, 35], [2, 16], [17, 30], [16, 8], [6, 30], [4, 12], [18, 1], [5, 30]],
    6: [[20, 1], [5, 30], [22, 27], [21, 4], [6, 15], [4, 7]],
    7: [[5, 50], [22, 22], [26, 15], [27, 6], [28, 1]]
}

export const boxes: {[id: number]: [string, string, number]} = {
    1: ["Common Box", "box/commonbox.png", 50],
    2: ["Rare Box", "box/rarebox.png", 300],
    3: ["Lava Box", "box/lavabox.png", 500],
    4: ["Mario Box","box/mariobox.png", 700], 
    5: ["Nature Box", "box/commonbox.png", 1200],
    6: ["Mineral Box", "box/commonbox.png", 2000],
    7: ["Epic Box", "box/commonbox.png", 3000]
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
    salvage: number,
    rarity: "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythical" | "transcendental" | "chromatic"
}[] = [
    {
        name: "Blue Baby Yoshi",
        perks: (level) => ({hitAdd: level*0.045}),
        source: "pet/bluebabyyoshi.png",
        description: "Blue Baby Yoshi, found from the depths of the common box. Makes you do 0.045*{Pet Level} more damage.",
        salvage: 10,
        rarity: "common"
    }, {
        name: "Green Baby Yoshi",
        perks: (level) => ({hitAdd: level*0.02, hitMul: level*0.02}),
        source: "pet/greenbabyyoshi.png",
        description: "Green Baby Yoshi. Makes you do 0.02*{Pet Level} more damage AND multiplies that by 0.025*{Pet Level}.",
        salvage: 50,
        rarity: "uncommon"
    }, {
        name: "Pink Baby Yoshi",
        perks: (level) => ({hitAdd: level*0.03, hitMul: level*0.02}),
        description: "Pink Baby Yoshi. Makes you do 0.03*{Pet Level} more damage AND multiplies that by 0.02*{Pet Level}.",
        source: "pet/pinkbabyyoshi.png",
        salvage: 75,
        rarity: "rare"
    }, {
        name: "Glowing Baby Yoshi",
        perks: (level) => ({hitAdd: level*Math.random()/10 + level/15, hitMul: level*Math.random()/70}),
        description: "A glowing baby yoshi. Super fancy. Effects: Unknown",
        source: "pet/glowingbabyyoshi.png",
        salvage: 1000,
        rarity: "legendary"
    }, {
        name: "Obsidian Baby Yoshi",
        perks: (level) => ({hitAdd: level*0.1, hitMul: Math.random()*level/70}),
        description: "A obsidian baby yoshi found from the lava box, has a random chance to do more or less damage.",
        source: "pet/obsidianbabyyoshi.png",
        salvage: 100,
        rarity: "legendary"
    }, {
        name: "Your Dad Yoshi",
        perks: (level) => ({hitAdd: -70, hitMul: 0}),
        description: "Your dad that went to the milk store",
        source: "pet/yourdadyoshi.png",
        salvage: -2,
        rarity: "common"
    }, {
        name: "Rock Baby Yoshi",
        perks: (level) => ({hitAdd: level*0.045, hitMul: Math.random()*level/100}),
        description: "A baby yoshi formed from volcanic rock, I wonder how that happened.",
        source: "pet/rockbabyyoshi.png",
        salvage: 40,
        rarity: "common"
    }, {
        name: "Red Baby Yoshi",
        perks: (level) => ({hitAdd: level*0.05, hitMul: Math.random()*level/95}),
        description: "A baby yoshi formed from lava, why is it living.",
        source: "pet/redbabyyoshi.png",
        salvage: 60,
        rarity: "uncommon"
    }, {
        name: "Goomba",
        perks: (level) => ({hitAdd: level*0.0175, hitMul: 0.0175*level + Math.random()}),
        description: "A goomba that doesn't like yoshis.",
        source: "pet/goomba.png",
        salvage: 40,
        rarity: "uncommon"
    }, {
        name: "Galoomba",
        perks: (level) => ({hitAdd: level*0.0275, hitMul: 0.0275*level + Math.random()}),
        description: "An evolved goomba who hates yoshis.",
        source: "pet/galoomba.png",
        salvage: 90,
        rarity: "rare"
    }, {
        name: "Shooter GB Yoshi",
        perks: (level) => ({autoAdd: level*0.015, autoMul: 0.015*level}),
        description: "The green baby yoshi found a gun! I wonder what will happen now?",
        source: "pet/greenshooteryoshi.png",
        salvage: 70,
        rarity: "uncommon"
    }, {
        name: "(OLD) Termiyoshi",
        perks: (level) => ({autoAdd: level*0, autoMul: 0}),
        description: "Why did you get that ron.",
        source: "pet/redjujuyoshi.png",
        salvage: -69,
        rarity: "transcendental"
    }, {
        name: "Grass Baby Yoshi",
        perks: (level) => ({autoAdd: level*0.03, autoMul: 0.02*level}),
        description: "Grass yoshi, the gamers ultimate nemisis.",
        source: "pet/grassbabyyoshi.png",
        salvage: 200,
        rarity: "uncommon"
    }, {
        name: "Blue Goomba Stack",
        perks: (level) => ({hitAdd: level*0.032, hitMul: 0.04*level + Math.random()}),
        description: "Goomba x 4, but not 4x damage",
        source: "pet/goombastack.png",
        salvage: 120,
        rarity: "legendary"
    }, {
        name: "Bowser Jr.",
        perks: (level) => ({hitAdd: level*0.03, hitMul: 0.045*level + Math.random()}),
        description: "Dropped from the belly of B(r)owser, somehow",
        source: "pet/Bowser_Jr.png",
        salvage: 150,
        rarity: "mythical"
    }, {
        name: "Hype Yoshi",
        perks: (level) => ({autoAdd: Infinity, hitMul: Infinity, hitAdd: Infinity}),
        description: "Admin pet, how did you get one?",
        source: "pet/HypeYoshi.png",
        salvage: 69420,
        rarity: "transcendental"
    }, {
        name: "Meander Baby Yoshi",
        perks: (level) => ({hitAdd: level*0.032, hitMul: 0.036*level + Math.random()}),
        description: "A river yoshi that started meandering.",
        source: "pet/meanderbabyyoshi.png",
        salvage: 170,
        rarity: "rare"
    }, {
        name: "River Baby Yoshi",
        perks: (level) => ({hitAdd: level*0.027, hitMul: 0.031*level + Math.random()}),
        description: "A river yoshi.",
        source: "pet/riverbabyyoshi.png",
        salvage: 100,
        rarity: "uncommon"
    }, {
        name: "Sky Baby Yoshi",
        perks: (level) => ({hitAdd: level*0.04, hitMul: 0.041*level + Math.random()}),
        description: "A river yoshi.",
        source: "pet/skybabyyoshi.png",
        salvage: 220,
        rarity: "legendary"
    }, {
        name: "Blue Goomba Stack Pro Max",
        perks: (level) => ({hitAdd: level*0.05, hitMul: 0.05*level + Math.random()}),
        description: "A Goomba stack, x2",
        source: "pet/goombastackpromax.png",
        salvage: 300,
        rarity: "mythical"
    },
    // Epic Box
    {
        name: "Eian Yoshi",
        perks: (level) => ({hitAdd: level*0.05, hitMul: 0.05*level}),
        description: "Pure luck and pure cringe condensed into a yoshi.",
        source: "pet/epicbox/eianbabyyoshi.png",
        salvage: 350,
        rarity: "mythical"
    }, {
        name: "Emerald Yoshi",
        perks: (level) => ({hitAdd: level*0.050, hitMul: 0.07*level*Math.random()}),
        description: "Yoshi made out of emeralds. Very hard.",
        salvage: 370,
        rarity: "epic",
        source: "pet/epicbox/emeraldyoshi.png"
    }, {
        name: "Bronze Yoshi",
        perks: (level) => ({hitAdd: level*0.034, hitMul: 0.035*level*Math.random()}),
        description: "Bronze yoshi from the Bronze Age.",
        salvage: 250,
        rarity: "uncommon",
        source: "pet/epicbox/bronzeyoshi.png"
    },
    //Goomba stacks
    {
        name: "Goomba Stack Pro Max Ultra",
        perks: (level) => ({hitAdd: level*0.056, hitMul: 0.056*level + Math.random()}),
        description: "Goomba Stack Pro Max goes too far",
        salvage: 600,
        rarity: "mythical",
        source: "pet/goombastackpromaxultra.png"
    }, {
        name: "(OLD) Goombascraper",
        perks: (level) => ({hitAdd: 0, hitMul: 0}),
        description: "Goomba Stack Pro Max goes too far its a skyscraper (OLD)",
        salvage: 1200,
        rarity: "chromatic",
        source: "pet/Goombascraper.png"
    }, {
        name: "(OLD) Goombascraper Ultra",
        perks: (level) => ({hitAdd: 0, hitMul: 0}),
        description: "Goombascraper, but more (OLD)",
        salvage: 2400,
        rarity: "chromatic",
        source: "pet/Goombascraperultra.png"
    }, 
 //epic box pets
    {
        name: "Silver Yoshi",
        perks: (level) => ({hitAdd: level*0.037, hitMul: 0.024*level+Math.random()}),
        description: "Yoshi that is silver. These descriptions are getting ridiculous",
        rarity: "rare",
        salvage: 400,
        source: "pet/epicbox/silveryoshi.png",
    }, {
        name: "Gold Yoshi",
        perks: (level) => ({hitAdd: level*0.045, hitMul: 0.05*level + Math.random()}),
        description: "A yoshi made of molten gold.",
        rarity: "epic",
        salvage: 500,
        source: "pet/epicbox/goldyoshi.png",
    }, {
        name: "Diamond Yoshi",
        perks: (level) => ({hitAdd: level*0.05, hitMul: 0.051*level+ Math.random()}),
        description: "A diamond-hard yoshi.",
        rarity: "legendary",
        salvage: 1000,
        source: "pet/epicbox/diamondyoshi.png"
    }, {
        name: "Goombascraper",
        perks: (level) => ({hitAdd: level*0.09, hitMul: level*0.09 + Math.random()}),
        description: "Goomba Stack Pro Max goes too far its a skyscraper",
        salvage: 1200,
        rarity: "chromatic",
        source: "pet/Goombascraper.png"
    }, {
         name: "Goombascraper Ultra",
        perks: (level) => ({hitAdd: level*0.12, hitMul: level*0.12 + Math.random()}),
        description: "Goombascraper, but more tall",
        salvage: 2400,
        rarity: "chromatic",
        source: "pet/Goombascraperultra.png"
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
        drops: [["Yoshi Sludge", 16], ["Buff Yoshi Sludge", 9], ["Yoshi Steel", 5]]
    },
    {
        name: "Aunt Yoshi",
        hp: 50000,
        regen: 6,
        reward: 1000,
        kill: 2000,
        drops: [["Pancake", 2], ["Yoshi Thread", 11]]
    }, {
        name: "B(r)owser",
        hp: 100000,
        regen: 10,
        reward: 1500,
        kill: 2500,
        drops: [["Firefox", 1]]
    }, {
        name: "Body Builder Yoshi",
        hp: 200000,
        regen: 15,
        reward: 3500,
        kill: 7500,
        drops: [["Dumbbell", 99], ["Iron Yoshi Apple", 1]]
    }, {
        name: "Placeholder Yoshi",
        hp: Infinity,
        regen: Infinity,
        reward: Infinity,
        kill: Infinity,
        drops: [["Yoshi Apple", 69420]]
    }
]

