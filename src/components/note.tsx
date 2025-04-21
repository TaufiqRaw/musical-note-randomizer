import { batch, createSignal, onCleanup } from "solid-js"
import { IntervalEvent, MetronomeSubscriber } from "../types"

import MetronomeSfx from "../assets/sounds/metronome.mp3"
import MetronomeAccentSfx from "../assets/sounds/metronome-accent.mp3"

const Naturals = ["A", "B", "C", "D", "E", "F", "G"]
const Sharps = ["A#", "C#", "D#", "F#", "G#"]
const Flats = ["Bb", "Db", "Eb", "Gb", "Ab"]

function shuffleArray<T>(array : T[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export const Note = (props : {
    subscribeToInterval : (x : MetronomeSubscriber) => void
    unsubscribeFromInterval : (x : MetronomeSubscriber) => void
}) => {
    const [notes, setNotes] = createSignal<string[]>([])
    const [lastNote, setLastNote] = createSignal<string>()
    const [isRandom, setIsRandom] = createSignal(true)
    const [naturalAllowed, setNaturalAllowed] = createSignal(true)
    const [changeNoteOn, setChangeNoteOn] = createSignal(1)
    const [sharpOrFlatAllowed, setSharpOrFlatAllowed] = createSignal<null | "SHARP" | "FLAT">()
    
    const metronomeAudio = new Audio(MetronomeSfx) 
    const metronomeAccentAudio = new Audio(MetronomeAccentSfx) 

    function randomCheckHandler (e : Event) {
        setIsRandom((e.target as HTMLInputElement).checked)
    }
    function naturalCheckHandler (e : Event) {
        setNaturalAllowed((e.target as HTMLInputElement).checked)
    }
    function sharpCheckHandler (e : Event) {
        setSharpOrFlatAllowed((e.target as HTMLInputElement).checked ? "SHARP" : null)
    }

    function flatCheckHandler (e : Event) {
        setSharpOrFlatAllowed((e.target as HTMLInputElement).checked ? "FLAT" : null)
    }

    function onInterval (e : IntervalEvent) {
        if(e == 'START' || e == 'NEW_BAR') {
            if(notes().length <= 1){
                if(notes().at(0)){
                    setLastNote(notes().at(0))
                }
                const newNotes : string[] = [];
                if (naturalAllowed()) {
                    newNotes.push(...Naturals)
                } 
                if (sharpOrFlatAllowed() === "SHARP") {
                    newNotes.push(...Sharps)
                    newNotes.sort((a,b)=>{
                        if(a.charCodeAt(0) == b.charCodeAt(0)) {
                            if(a.length > 1) {
                                return 1
                            }else {
                                return -1
                            }
                        }
                        if (a.charCodeAt(0) < b.charCodeAt(0)) {
                            return -1
                        }else {
                            return 1
                        }
                    })
                } else if (sharpOrFlatAllowed() === "FLAT") {
                    newNotes.push(...Sharps)
                    newNotes.sort((a,b)=>{
                        if(a.charCodeAt(0) == b.charCodeAt(0)) {
                            if(a.length > 1) {
                                return -1
                            }else {
                                return 1
                            }
                        }
                        if (a.charCodeAt(0) < b.charCodeAt(0)) {
                            return -1
                        }else {
                            return 1
                        }
                    })
                }
                if (isRandom()) {
                    shuffleArray(newNotes)
                }
                
                setNotes(newNotes)
            }else {
                batch(()=>{
                    setLastNote(notes()[0])
                    setNotes(notes().slice(1))
                })
            }
            metronomeAccentAudio.play()
        }
        if (e == 'INCREMENT') {
            metronomeAudio.load()
            metronomeAudio.play()
        }
        if (e == "STOP") {
            setNotes([])
            setLastNote(undefined)
        }
    }
    props.subscribeToInterval(onInterval)
    onCleanup(() => {
        props.unsubscribeFromInterval(onInterval)
    })
    return <>
        <div class="w-full">
            <div class="mb-1 flex gap-1">
                <i class="bi bi-music-note" />
                <div>Note Setting</div>
            </div>
            <div class="w-full p-2 flex flex-col gap-2 border border-black">
                <div class="flex flex-col gap-1">
                    <div class="flex gap-1">
                        <input type='checkbox' class="border border-gray-500" id="natural" checked={naturalAllowed()} onChange={naturalCheckHandler}/>
                        <label for="natural">Natural</label>
                    </div>
                    <div class="flex relative">
                        <div class={"absolute left-0 h-full w-1 " + (sharpOrFlatAllowed() ? "bg-blue-500 hover:cursor-pointer " : "bg-gray-400 ")} onClick={()=>setSharpOrFlatAllowed(null)}></div>
                        <div class="ml-2 flex flex-col gap-1">
                            <div class="flex gap-1">
                                <input type='checkbox' class="border border-gray-500" id="sharp" checked={sharpOrFlatAllowed() === "SHARP"} onChange={sharpCheckHandler}/>
                                <label for="sharp">Sharps</label>
                            </div>
                            <div class="flex gap-1">
                                <input type='checkbox' class="border border-gray-500" id="flats" checked={sharpOrFlatAllowed() === "FLAT"} onChange={flatCheckHandler}/>
                                <label for="flats">Flats</label>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div class="flex gap-1">
                    <input type='checkbox' class="border border-gray-500" id="random" checked={isRandom()} onChange={randomCheckHandler}/>
                    <label for="random">Randomized</label>
                </div>
                {/* <hr />
                <div class="flex gap-1 flex-col">
                    <div>Change note every</div>
                    <div class="flex gap-1">
                        <input type="radio" name="note-change" class="border border-gray-500" id="note-change-1" onclick={()=>setChangeNoteOn(1)} checked={changeNoteOn() === 1}/>
                        <label for="note-change-1">1 beat</label>
                    </div>
                    <div class="flex gap-1">
                        <input type="radio" name="note-change" class="border border-gray-500" id="note-change-2" onclick={()=>setChangeNoteOn(2)} checked={changeNoteOn() === 2}/>
                        <label for="note-change-2">2 beats</label>
                    </div>
                    <div class="flex gap-1">    
                        <input type="radio" name="note-change" class="border border-gray-500" id="note-change-4" onclick={()=>setChangeNoteOn(4)} checked={changeNoteOn() === 4}/>
                        <label for="note-change-4">4 beats</label>
                    </div>
                </div> */}
            </div>
        </div>
        <div class="flex gap-2">    
            <div class='bg-blue-500 w-20 h-20 text-white grid place-content-center'>
                { notes().length > 0 
                    ? <div class="text-3xl">{lastNote()}</div>
                    : ""
                }
            </div>
            <div class='border-blue-500 border-2 w-20 h-20 text-blue-500 grid place-content-center'>
                { notes().length > 0 
                    ? <div class="text-3xl">{notes()[0]}</div>
                    : ""
                }
            </div>
        </div>
    </>
}