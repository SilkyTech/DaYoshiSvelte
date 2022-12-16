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
        desc: "A flimsy sword crafted from yoshi sludge and yoshi steel. Made by an amateur.", 
        img: "items/export/sword/yoshi/Flimsy Yoshi Sword.png",
        type: "sword",
        damage: 1
    },
    "Normal Yoshi Sword": {
        desc: "A sword crafted from yoshi sludge and yoshi steel. Refined by a blacksmith.", 
        img: "items/export/sword/yoshi/Normal Yoshi Sword.png",
        type: "sword",
        damage: 2
    },
    "Sturdy Yoshi Sword": {
        desc: "A sword crafted from yoshi sludge and yoshi steel. Refined by a master blacksmith.", 
        img: "items/export/sword/yoshi/Sturdy Yoshi Sword.png",
        type: "sword",
        damage: 3
    }
} as const;

export const recipes: [[keyof typeof itemIds, number][], [keyof typeof itemIds, number]][] = [
    [[["Yoshi Steel", 10], ["Yoshi Sludge", 30]], ["Flimsy Yoshi Sword", 1]],
    [[["Flimsy Yoshi Sword", 1], ["Yoshi Steel", 30], ["Yoshi Sludge", 100], ["Buff Yoshi Sludge", 50]], ["Normal Yoshi Sword", 1]],
    [[["Normal Yoshi Sword", 1], ["Yoshi Steel", 100], ["Yoshi Sludge", 200], ["Buff Yoshi Sludge", 100]], ["Sturdy Yoshi Sword", 1]]
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