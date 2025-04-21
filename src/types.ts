export type IntervalEvent = 'INCREMENT' | 'STOP' | 'NEW_BAR' | 'START'
export type MetronomeSubscriber = (e : IntervalEvent) => void