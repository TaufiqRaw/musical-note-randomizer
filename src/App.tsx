import { createSignal, type Component } from 'solid-js';
import { Metronome } from './components/metronome';
import { Note } from './components/note';
import { IntervalEvent, MetronomeSubscriber } from './types';

const App: Component = () => {
    const [mSubs, setMSubs] = createSignal<MetronomeSubscriber[]>([])
    
    function onMetronomeEvent (e : IntervalEvent) {
        mSubs().forEach(sub => sub(e))
    }
    function subscribeToMetronome (cb : MetronomeSubscriber) {
        setMSubs([...mSubs(), cb])
    }
    function unsubscribeFromMetronome (cb: MetronomeSubscriber) {
        setMSubs(mSubs().filter(sub => sub !== cb))
    }
  return (
    <div class='flex flex-col items-center'>
        <div class='flex flex-col items-center w-52 gap-2 mt-5'>
            <Metronome onMetronomeEvt={onMetronomeEvent}/>
            <Note subscribeToInterval={subscribeToMetronome} unsubscribeFromInterval={unsubscribeFromMetronome} />
        </div>
    </div>
  );
};

export default App;
