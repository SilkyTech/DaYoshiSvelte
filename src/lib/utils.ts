import type { pets } from './constants';
import * as constants from './constants'

export function getLevels(pet: any) {
    if (pet === undefined || pet === null) return {level: -1, xp: -1, desc: ""};
    let j = pet.xp;
    let lev = 0;
    let i = 0;
    for (; i < constants.levelUps.length; i++) {
        const xpReq = constants.levelUps[i];
        if (j < xpReq) {
        break;
        }
        j -= xpReq;
        lev++;

    }
    return {level: lev, xp: constants.levelUps[i]-j, desc: pet.pet.description.replace(/\{Pet Level\}/g, lev.toString())}
}

export function getLevelsNoLocal(pet: any[]) {
    let xp: number = pet[1];
    let j = xp;
    let lev = 0;
    let i = 0;
    for (; i < constants.levelUps.length; i++) {
        const xpReq = constants.levelUps[i];
        if (j < xpReq) {
        break;
        }
        j -= xpReq;
        lev++;

    }
    return {level: lev, xp: constants.levelUps[i]-j}
}   