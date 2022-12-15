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
            let amount = this.getItem(a).amount;
            out.push({id: a, amount: amount, img: this.getItem(a).img})
        })

        return out
    }
}
export type Item = {
    id: keyof typeof itemIds
}

export const itemIds = {
    "Yoshi Sludge": {desc: "Some sludge resembling yoshi.", img: "items/export/Yoshi Sludge.png"},
    "Buff Yoshi Sludge": {desc: "The sludge is angry. Don't ask me how.", img: "items/export/Buff Yoshi Sludge.png"},
    "Yoshi Steel": {desc: "Pure pressure condensed yoshi sludge into steel.", img: "items/export/Yoshi Steel.png"},
    "Pancake": {desc: "Pancake. Dropped from Aunt Yoshi.", img: "items/export/Pancake.png"}
} as const;

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
    ) { }

    get pInventory() {
        return Inventory.from(get(this.inventory))
    }
}

// Export a singleton
export const game = new Game();