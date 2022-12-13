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
    696420,
    Infinity
    
]

export const boxChances: {[id: number]: [number, number][]} = {
    1: [[0, 19], [1, 4], [2, 1], [5, 2]],
    2: [[0, 100], [1, 40], [2, 8], [3, 1], [5, 6]],
    3: [[0, 100], [1, 20], [2, 8], [4, 2], [5, 3]]
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
    },
    source: string,
    description: string,
    salvage: number
}[] = [
    {
        name: "Blue Baby Yoshi",
        perks: (level) => ({hitAdd: level*0.03}),
        source: "pet/bluebabyyoshi.png",
        description: "Blue Baby Yoshi, found from the depths of the common box. Makes you do 0.03*{Pet Level} more damage.",
        salvage: 10
    }, {
        name: "Green Baby Yoshi",
        perks: (level) => ({hitAdd: level*0.02, hitMul: level*0.01}),
        source: "pet/greenbabyyoshi.png",
        description: "Green Baby Yoshi. Makes you do 0.02*{Pet Level} more damage AND multiplies that by 0.01*{Pet Level}.",
        salvage: 50
    }, {
        name: "Pink Baby Yoshi",
        perks: (level) => ({hitAdd: level*0.03, hitMul: level*0.03}),
        description: "Pink Baby Yoshi. Makes you do 0.03*{Pet Level} more damage AND multiplies that by 0.03*{Pet Level}.",
        source: "pet/pinkbabyyoshi.png",
        salvage: 75
    }, {
        name: "Glowing Baby Yoshi",
        perks: (level) => ({hitAdd: level*Math.random()/20+level/100+10, hitMul: level*Math.random()/50}),
        description: "A glowing baby yoshi. Super fancy. Effects: Unknown",
        source: "pet/glowingbabyyoshi.png",
        salvage: 1000,
    }, {
        name: "Red Baby Yoshi",
        perks: (level) => ({hitAdd: level*0.1, hitMul: Math.random()*level/70}),
        description: "A red baby yoshi found from the lava box, has a random chance to do more or less damage.",
        source: "pet/redbabyyoshi.png",
        salvage: 100,
    }, {
        name: "Your Dad Yoshi",
        perks: (level) => ({hitAdd: -69, hitMul: 0}),
        description: "Your dad that went to the milk store",
        source: "pet/yourdadyoshi.png",
        salvage: -2
    }
]

export const yoshis: {
    name: string,
    hp: number,
    regen: number,
    reward: number
}[] = [
    {
        name: "Normal Yoshi",
        hp: 100,
        regen: 0,
        reward: 1
    },
    {
        name: "Buff Yoshi",
        hp: 300,
        regen: 3,
        reward: 2
    }
]
