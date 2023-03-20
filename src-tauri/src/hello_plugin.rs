use tauri::{  
    plugin::{Builder, TauriPlugin},
    Runtime
};

#[tauri::command]
fn say_hello() -> &'static str {
    "Plugin !! Hello Hello ~~"
}

pub fn init <R: Runtime>() -> TauriPlugin<R> {
    Builder::new("hello_plugin")
    .invoke_handler(tauri::generate_handler![say_hello])
    .build()
}
