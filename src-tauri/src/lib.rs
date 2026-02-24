use serde::Serialize;
use std::fs;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")] // is_dir → isDir for the frontend
struct FileEntry {
    name: String,
    is_dir: bool,
    path: String,
}

#[tauri::command]
fn get_files(path: &str) -> Result<Vec<FileEntry>, String> {
    let mut entries = Vec::new();
    let paths = fs::read_dir(path).map_err(|e| e.to_string())?;

    for entry in paths {
        if let Ok(dir_entry) = entry {
            let file_name = dir_entry.file_name().into_string().unwrap_or_default();
            let file_path = dir_entry.path().display().to_string();
            let is_dir = dir_entry.path().is_dir();
            entries.push(FileEntry { name: file_name, is_dir, path: file_path });
        }
    }

    entries.sort_by(|a, b| b.is_dir.cmp(&a.is_dir).then(a.name.cmp(&b.name)));
    Ok(entries)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![get_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}