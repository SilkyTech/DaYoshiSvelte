import { derived, get, writable, type Writable } from "svelte/store";

export class Inventory {
    items: Item[]
    constructor() {
        this.items = [];
    }
    static from(items: Item[]): Inventory {
        let newInv = new Inventory()
        newInv.items = items;
        return newInv;
    }

    getItem(id: keyof typeof itemIds) {
        let items = this.items.filter(a => a.id === id);
        let amount = 0;
        items.forEach(_ => {
            amount++;
        })

        return {
            item: id,
            amount: amount,
            img: itemIds[id].img
        }
    }

    getItems() {
        let types: Item["id"][] = [];
        this.items.forEach(a => types.push(a.id))
        let typeSet = new Set(types)
        
        let out: {id: Item["id"], amount: number, img: string}[] = []

        typeSet.forEach(a => {
            if (a === undefined) return;
            let amount = this.getItem(a).amount;
            out.push({id: a, amount: amount, img: this.getItem(a).img})
        })

        return out
    }

    removeItem(id: keyof typeof itemIds, amount: number) {
        for (let i = 0; i < amount; i++) {
            const index = this.items.map(a => a.id).indexOf(id);
            if (index > -1) { // only splice array when item is found
                this.items.splice(index, 1); // 2nd parameter means remove one item only
            } else return false
        }

        return true;
    }

    addItem(id: keyof typeof itemIds, amount: number) {
        for (let _ = 0; _ < amount; _++) {
            this.items.push({id: id})
        }
    }
}
export type Item = {
    id: keyof typeof itemIds
}

export const itemIds = {
    "Yoshi Sludge": {desc: "Some sludge resembling yoshi.", img: "items/export/Yoshi Sludge.png", type: "item"},
    "Buff Yoshi Sludge": {desc: "The sludge is angry. Don't ask me how.", img: "items/export/Buff Yoshi Sludge.png", type: "item"},
    "Yoshi Steel": {desc: "Pure pressure condensed yoshi sludge into steel.", img: "items/export/Yoshi Steel.png", type: "item"},
    "Pancake": {desc: "Pancake. Dropped from Aunt Yoshi.", img: "items/export/Pancake.png", type: "item"},
    "Flimsy Yoshi Sword": {
        desc: "A flimsy sword crafted from yoshi sludge and yoshi steel. Made by an amateur. ", 
        img: "items/export/sword/yoshi/Flimsy Yoshi Sword.png",
        type: "sword",
        damage: 1
    },
    "Normal Yoshi Sword": {
        desc: "A sword crafted from yoshi sludge and yoshi steel. Refined by a blacksmith. ", 
        img: "items/export/sword/yoshi/Normal Yoshi Sword.png",
        type: "sword",
        damage: 2
    },
    "Sturdy Yoshi Sword": {
        desc: "A sword crafted from yoshi sludge and yoshi steel. Refined by a master blacksmith. ", 
        img: "items/export/sword/yoshi/Sturdy Yoshi Sword.png",
        type: "sword",
        damage: 3
    },
    "Yoshi Ball": {
        desc: "A condensed ball of yoshi sludge. Might be edible.",
        img: "items/export/Yoshi Ball.png",
        type: "item"
    },
    "Buff Yoshi Ball": {
        desc: "A condensed ball of buff yoshi sludge. Might be edible.",
        img: "items/export/Buff Yoshi Ball.png",
        type: "item"
    },
    "Yoshi Apple": {
        type: "candy",
        desc: "Lots of buff yoshi ball smooshed together into candy. Grants 50,000 pet exp.",
        img: "items/export/Yoshi Apple.png",
        xp: 50000
    },
    "Raggedy Yoshi Cloak": {
        type: "cloak",
        desc: "A raggedy yoshi cloak. Might increase your damage somehow. ",
        img: "items/export/cloak/Raggedy Yoshi Cloak.png",
        damage: 0.6
    },
    "Yoshi Cloak": {
        type: "cloak",
        desc: "A normal yoshi cloak. Might increase your damage somehow. ",
        img: "items/export/cloak/Yoshi Cloak.png",
        damage: 1.4
    },
    "Well Woven Yoshi Cloak": {
        type: "cloak",
        desc: "A lovely Yoshi cloak. Helps during winter. Might increase your damage somehow. ",
        img: "items/export/cloak/Well Woven Yoshi Cloak.png",
        damage: 2.5
    }, 
    "Yoshi Thread": {type: "item", desc: "Some thread made Aunt Yoshi. Made with care.", img: "items/export/Yoshi Thread.png"},
    "Firefox": {
        type: "candy", desc: "A browser droped by B(r)owser. Part of the browser collection. 20,000 pet xp.",
        img: "items/export/Firefox.png",
        xp: 20000
    },
    "Broken Pancake Necklace": {
        type: "necklace",
        desc: "A broken necklace with a single pancake. How doesn't it fall off? I don't know.",
        img: "items/export/necklace/Broken Pancake Necklace.png",
        damage: 0.6
    },
    "Sorta Broken Pancake Necklace": {
        type: "necklace",
        desc: "A necklace made out of pancakes. Why does it work? I don't know.",
        img: "items/export/necklace/Sorta Broken Pancake Necklace.png",
        damage: 1.2
    },
    "Pancake Necklace": {
        type: "necklace",
        desc: "A necklace made out of pancakes. Why doesn't it expire? I don't know.",
        img: "items/export/necklace/Pancake Necklace.png",
        damage: 1.8
    }, 
    "Cube of Pure Steel": {type: "item", desc: "A pure block of steel.", img: "items/export/Cube of Pure Steel.png"},
    "Dumbbell": {type: "item", desc: "Dumbbells, dropped from Body Builder Yoshi.", img: "items/export/Dumbbell.png"},
    "Iron Yoshi Apple": {type: "candy", desc: "A yoshi apple coated in Yoshi Steel. Binded together by sweat. 500,000 pet XP.", img: "items/export/Iron Yoshi Apple.png", xp: 500000},
    "Flimsy Steel Longsword": {
        type: "sword",
        desc: "A flimsy steel longsword. Is quite jagged.",
        img: "items/export/sword/steellong/Flimsy Steel Longsword.png",
        damage: 2.6,
    },
    "Steel Longsword": {
        type: "sword",
        desc: "A normal steel longsword. Works quite well against heavy yoshis, not so well with smaller ones.",
        img: "items/export/sword/steellong/Steel Longsword.png",
        damage: 3.4,
    },
    "Sturdy Steel Longsword": {
        type: "sword",
        desc: "A sturdy steel longsword. Will leave permanent scars on enemy yoshis",
        img: "items/export/sword/steellong/Sturdy Steel Longsword.png",
        damage: 4.2,
    },
} as const;

export const recipes: [[keyof typeof itemIds, number][], [keyof typeof itemIds, number]][] = [
    [[["Yoshi Steel", 10], ["Yoshi Sludge", 30]], ["Flimsy Yoshi Sword", 1]],
    [[["Flimsy Yoshi Sword", 1], ["Yoshi Steel", 30], ["Yoshi Sludge", 100], ["Buff Yoshi Sludge", 50]], ["Normal Yoshi Sword", 1]],
    [[["Normal Yoshi Sword", 1], ["Yoshi Steel", 75], ["Yoshi Sludge", 220], ["Buff Yoshi Sludge", 170]], ["Sturdy Yoshi Sword", 1]],
    [[["Yoshi Sludge", 100]], ["Yoshi Ball", 1]],
    [[["Buff Yoshi Sludge", 100]], ["Buff Yoshi Ball", 1]],
    [[["Yoshi Ball", 20], ["Buff Yoshi Ball", 20]], ["Yoshi Apple", 1]],
    [[["Yoshi Thread", 7], ["Yoshi Ball", 6], ["Buff Yoshi Sludge", 36], ["Yoshi Steel", 26]], ["Raggedy Yoshi Cloak", 1]],
    [[["Raggedy Yoshi Cloak", 1], ["Yoshi Thread", 14], ["Yoshi Ball", 12], ["Buff Yoshi Ball", 3], ["Yoshi Steel", 86]], ["Yoshi Cloak", 1]],
    [[["Yoshi Cloak", 1], ["Yoshi Thread", 34], ["Yoshi Ball", 24], ["Buff Yoshi Ball", 9], ["Yoshi Steel", 168]], ["Well Woven Yoshi Cloak", 1]],
    [[["Yoshi Thread", 20], ["Pancake", 8], ["Yoshi Steel", 45]], ["Broken Pancake Necklace", 1]],
    [[["Broken Pancake Necklace", 1], ["Yoshi Thread", 50], ["Pancake", 18], ["Yoshi Steel", 90]], ["Sorta Broken Pancake Necklace", 1]],
    [[["Sorta Broken Pancake Necklace", 1], ["Yoshi Thread", 100], ["Pancake", 29], ["Yoshi Steel", 130]], ["Pancake Necklace", 1]],
    [[["Yoshi Steel", 100], ["Yoshi Sludge", 500]], ["Cube of Pure Steel", 1]],
    [[["Cube of Pure Steel", 10], ["Yoshi Apple", 5], ["Dumbbell", 10]], ["Iron Yoshi Apple", 1]],
    [[["Cube of Pure Steel", 7], ["Dumbbell", 13], ["Yoshi Sludge", 600], ["Buff Yoshi Sludge", 300]], ["Flimsy Steel Longsword", 1]],
    [[["Flimsy Steel Longsword", 1], ["Cube of Pure Steel", 14], ["Dumbbell", 28], ["Yoshi Sludge", 1200], ["Buff Yoshi Sludge", 700]], ["Steel Longsword", 1]],
    [[["Steel Longsword", 1], ["Cube of Pure Steel", 30], ["Dumbbell", 40], ["Yoshi Sludge", 2000], ["Buff Yoshi Sludge", 1000]], ["Sturdy Steel Longsword", 1]],

]

class Game {
    constructor(
        public hits: Writable<number> = writable(0),
        public deaths: Writable<number> = writable(0),
        public hp: Writable<number> = writable(100),
        public usedDev: Writable<boolean> = writable(false),
        public usedAutoclicker: Writable<boolean> = writable(false),
        public boughtSkins: Writable<Set<number>> = writable(new Set([0, 1, 2])),
        public curPet: Writable<number> = writable(-1),
        public ownedPets: Writable<[number, number][]> = writable([]),
        public curSkin: Writable<{hit: number, block: number, normal: number}> = writable({hit: 1, block: 2, normal: 0}),
        public inventory: Writable<Item[]> = writable([]),
        public equipment: Writable<{
            sword: keyof typeof itemIds | undefined,
            necklace: keyof typeof itemIds | undefined,
            cloak: keyof typeof itemIds | undefined,
        }> = writable({
            sword: undefined,
            necklace: undefined,
            cloak: undefined
        }),
    ) { }

    get pInventory() {
        return Inventory.from(get(this.inventory))
    }
}

// Export a singleton
export const game = new Game();

class Settings {
    constructor (
        public potato: Writable<{
            notifs: boolean,
            petAnim: boolean,
        }> = writable({
            notifs: true,
            petAnim: true
        }),
    ) {
    }

    
}

export const settings = new Settings()