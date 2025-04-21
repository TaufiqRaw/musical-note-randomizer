import { createSignal } from "solid-js"
import { MetronomeSubscriber } from "../types"

export const Metronome = (props : {
    onMetronomeEvt: MetronomeSubscriber
}) => {
    const [bpm, setBPM] = createSignal(120)
    const [count, setCount] = createSignal<number | null>(null)
    const [interv, setInterv] = createSignal<number | null>(null)
    
    function bpmFieldHandler (e : Event) {
        setBPM(parseInt((e.target as HTMLInputElement).value))
    }
    function playHandler () {
        if (interv() === null) {
            props.onMetronomeEvt('START')
            setCount(0)
            setInterv(setInterval(() => {
                const newCount = (count()! + 1) % 4
                setCount(newCount)
                if(newCount === 0) {
                    props.onMetronomeEvt('NEW_BAR')
                }
                props.onMetronomeEvt('INCREMENT')
            }, 60000 / bpm()))
        } else {
            props.onMetronomeEvt('STOP')
            clearInterval(interv()!)
            setCount(null)
            setInterv(null)
        }
    }

    return <div class="w-full">
        <div class="mb-1 flex gap-1">
            <i class="bi bi-clock" />
            <div>Tempo Setting</div>
        </div>
        <div class="w-full p-2 flex flex-col gap-2 border border-black">
            <div class="flex flex-row-reverse">
                <div class="flex flex-col">
                    <div class='flex gap-1'>
                        {
                            Array.from({length: 4}, (_, i) => {
                                return <div class={'w-2 h-2 rounded-full border ' + 
                                    (count() === i && interv() != null
                                        ? 'border-blue-500 bg-blue-500 ' 
                                        : 'border-gray-500')}/>
                            })
                        }
                    </div>
                </div>
            </div>
            <div class="flex flex-col gap-1">
                <span>BPM</span>
                <input type='number' value={bpm()} onInput={bpmFieldHandler} class="w-full border border-gray-500"/>
                <div class="w-full flex justify-center">
                    <button class={"p-2 py-1 border w-min " 
                        + (interv() != null 
                            ? "border-blue-500 text-blue-500 "
                            : "border-gray-500 text-gray-500 ")
                    } onclick={playHandler}>
                        <i class="bi bi-play-fill text-2xl "></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
}