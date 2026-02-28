use serde::Serialize;
use std::fs;
use std::path::PathBuf;
use std::time::SystemTime;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct FileEntry {
    name: String,
    is_dir: bool,
    path: String,
    size: u64,
    modified: Option<u64>,
}

#[tauri::command]
fn open_file(path: &str) -> Result<(), String> {
    open::that(path).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn get_files(path: &str) -> Result<Vec<FileEntry>, String> {
    let mut entries = Vec::new();
    let paths = fs::read_dir(path).map_err(|e| e.to_string())?;

    for entry in paths {
        if let Ok(dir_entry) = entry {
            let file_name = dir_entry.file_name().into_string().unwrap_or_default();

            // skip hidden files (dot-prefixed)
            if file_name.starts_with('.') {
                continue;
            }
            let file_path = dir_entry.path().display().to_string();
            let is_dir = dir_entry.path().is_dir();
            let mut size = 0;
            let mut modified = None;

            if let Ok(metadata) = dir_entry.metadata() {
                size = metadata.len();

                if let Ok(sys_time) = metadata.modified() {
                    if let Ok(duration) = sys_time.duration_since(SystemTime::UNIX_EPOCH) {
                        modified = Some(duration.as_secs());
                    }
                }
            }

            entries.push(FileEntry {
                name: file_name,
                is_dir,
                path: file_path,
                size,
                modified,
            });
        }
    }

    entries.sort_by(|a, b| b.is_dir.cmp(&a.is_dir).then(a.name.cmp(&b.name)));
    Ok(entries)
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct SidebarLocation {
    label: String,
    path: String,
    icon: String,
    category: String, // "places" | "devices"
}

/// Returns the user's home directory, or "/" as a fallback.
fn home_dir() -> PathBuf {
    // std::env::var("HOME") works on Linux/macOS; USERPROFILE on Windows.
    if let Ok(h) = std::env::var("HOME") {
        PathBuf::from(h)
    } else if let Ok(h) = std::env::var("USERPROFILE") {
        PathBuf::from(h)
    } else {
        PathBuf::from("/")
    }
}

/// Reads /proc/mounts (Linux) and returns real block-device mount points,
/// excluding virtual filesystems like proc, sysfs, tmpfs, etc.
#[cfg(target_os = "linux")]
fn mounted_devices() -> Vec<SidebarLocation> {
    let skip_types = [
        "proc",
        "sysfs",
        "devtmpfs",
        "devpts",
        "tmpfs",
        "cgroup",
        "cgroup2",
        "pstore",
        "bpf",
        "securityfs",
        "debugfs",
        "hugetlbfs",
        "mqueue",
        "fusectl",
        "configfs",
        "efivarfs",
        "autofs",
        "fuse.portal",
    ];

    let content = match fs::read_to_string("/proc/mounts") {
        Ok(c) => c,
        Err(_) => return vec![],
    };

    let home = home_dir().display().to_string();
    let mut devices = Vec::new();

    for line in content.lines() {
        let cols: Vec<&str> = line.split_whitespace().collect();
        if cols.len() < 3 {
            continue;
        }
        let device = cols[0];
        let mount_point = cols[1];
        let fs_type = cols[2];

        // skip virtual / kernel filesystems
        if skip_types.contains(&fs_type) {
            continue;
        }
        // skip the root filesystem and home (already listed under Places)
        if mount_point == "/" || mount_point == home {
            continue;
        }
        // only real block devices or fuse mounts (e.g. gvfsd, sshfs)
        if !device.starts_with('/') && !device.starts_with("fuse") {
            continue;
        }

        // derive a human-readable label from the last path segment
        let label = PathBuf::from(mount_point)
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or(mount_point)
            .to_string();

        // pick icon hint based on common mount-point patterns
        let icon = if mount_point.contains("sd") || mount_point.contains("mmcblk") {
            "sdcard"
        } else if mount_point.starts_with("/media") || mount_point.starts_with("/run/media") {
            "usb"
        } else if mount_point.starts_with("/mnt") {
            "hdd"
        } else {
            "database"
        };

        devices.push(SidebarLocation {
            label,
            path: mount_point.to_string(),
            icon: icon.to_string(),
            category: "devices".to_string(),
        });
    }

    devices
}

/// expandable stub for non-Linux targets
#[cfg(not(target_os = "linux"))]
fn mounted_devices() -> Vec<SidebarLocation> {
    vec![]
}

#[tauri::command]
fn get_sidebar_locations() -> Vec<SidebarLocation> {
    let mut locations: Vec<SidebarLocation> = Vec::new();
    let home = home_dir();

    locations.push(SidebarLocation {
        label: "Home".to_string(),
        path: home.display().to_string(),
        icon: "home".to_string(),
        category: "places".to_string(),
    });

    // Common XDG subdirectories
    let xdg_dirs: &[(&str, &str)] = &[
        ("Desktop", "desktop"),
        ("Documents", "documents"),
        ("Downloads", "downloads"),
        ("Music", "music"),
        ("Pictures", "pictures"),
        ("Videos", "videos"),
    ];

    for (name, icon) in xdg_dirs {
        let p = home.join(name);
        if p.exists() {
            locations.push(SidebarLocation {
                label: name.to_string(),
                path: p.display().to_string(),
                icon: icon.to_string(),
                category: "places".to_string(),
            });
        }
    }

    // trash is a virtual location that file managers can support.
    // it does not have a real filesystem path, but we can use a special URL scheme to identify it
    locations.push(SidebarLocation {
        label: "Trash".to_string(),
        path: "trash://".to_string(),
        icon: "trash".to_string(),
        category: "places".to_string(),
    });

    // DEVICES
    // root filesystem always shown
    locations.push(SidebarLocation {
        label: "File System".to_string(),
        path: "/".to_string(),
        icon: "filesystem".to_string(),
        category: "devices".to_string(),
    });

    // dynamically discovered mounted volumes
    locations.extend(mounted_devices());

    locations
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            get_files,
            get_sidebar_locations,
            open_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
