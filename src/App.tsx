import { useCallback, useEffect, useState } from 'react';
import { message } from '@tauri-apps/api/dialog';
import { invoke } from "@tauri-apps/api/tauri";
import { emit, listen } from '@tauri-apps/api/event';
import { appWindow } from '@tauri-apps/api/window'

import "./App.css";

interface IMessage {
  message: string
}

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  const eventHandle = useCallback(async () => {
    const unlisten = await listen('hello-event', async (event) => {
      await message((event.payload as IMessage)?.message, {
        title: '示范事件',
        type: 'info'
      });
    })
    return unlisten;
  }, [])
  useEffect(() => {
    eventHandle();
  }, [])
  return (
    <div className="container">
      <button onClick={() => {
        emit('hello-event', {
          message: 'Global event: hello-event!',
        })
      }}>
        触发全局事件: hello-event
      </button>


      <button onClick={() => {
        appWindow.emit('hello-event', { message: 'AppWindow event: hello-event' })
      }}>
        触发当前窗口事件: hello-event
      </button>

      <div className="row">
        <div>
          <input
            id="greet-input"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
          />
          <button type="button" onClick={() => greet()}>
            Greet
          </button>
        </div>
      </div>
      <p>{greetMsg}</p>

      <button onClick={async () => {
        const res: string = await invoke('plugin:hello_plugin|say_hello');
        await message(res, {
          title: '示范事件',
          type: 'info'
        });
      }}>
        触发Plugin中的say-hello
      </button>
    </div>
  );
}

export default App;
