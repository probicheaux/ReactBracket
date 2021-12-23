export interface Tournament {
    name: string
    id: number
    shortId: string
    brackets?: Bracket[]
}

export interface Bracket {
    id?: number
    name: string
    // TODO: other stuff about brackets?
}