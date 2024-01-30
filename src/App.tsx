import './App.css'
import useStateMachine, {t} from '@cassiozen/usestatemachine'

type TrafficLightColor = 'red' | 'yellow' | 'green';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getColor(state: TrafficLightColor, color: TrafficLightColor): TrafficLightColor | 'grey' {
  return state === color ? color : 'grey';
}

function App() {

  const [state, send] = useStateMachine({
    // verbose: true,  // Uncomment to trigger logging
    initial: 'red',
    context: { previous: 'red' },
    schema: {
      context: t<{ previous: TrafficLightColor }>()
    },
    states: {
      red: {
        on: { SWITCH: 'yellow' },
      },
      yellow: {
        effect: ({send, context}) => {
          const transition = async () => {
            await sleep(1000);
            context.previous === "red" ? send("SWITCH_GREEN") : send("SWITCH_RED");
          }
          void transition();
        },
        on: { SWITCH_GREEN: 'green', SWITCH_RED: 'red' },
      },
      green: {
        on: { SWITCH: 'yellow' },
      }
      },
    });

  return (
    <>
      <h1>useTrafficLight</h1>
      <div className='circle' style={{"backgroundColor": getColor(state.value, 'red')}}/>
      <div className='circle' style={{"backgroundColor": getColor(state.value , 'yellow')}}/>
      <div className='circle' style={{"backgroundColor": getColor(state.value, 'green')}}/>
      <div className="card">
        <button onClick={() => send("SWITCH")}>
          Light is: {state.value}
        </button>
      </div>
    </>
  )
}

export default App
