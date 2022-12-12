export const levelUps = [
    100,
    200,
    300,
    400,
    500,
    //
    700,
    900,
    1100,
    1300,
    1500,
    //
    2000,
    2500,
    3000,
    3500,
    4000,
    // 
    5000,
    6000,
    7000,
    8000,
    9000,
    //
    10000,
    12000,
    14000,
    16000,
    18000,
    //
    20000,
    22000,
    24000,
    26000,
    28000,
    //
    30000,
    35000,
    40000,
    45000,
    50000,
    //
    57500,
    62500,
    70000,
    75000,
    80000,
    //
    90000,
    100000,
    110000,
    120000,
    130000,
    //
    140000,
    150000,
    160000,
    170000,
    180000,
]

export const boxChances: {[id: number]: [number, number][]} = {
    1: [[0, 19], [1, 4], [2, 1]],
    2: [[0, 20], [1, 10], [2, 3]]
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
        salvage: 70
    }
]