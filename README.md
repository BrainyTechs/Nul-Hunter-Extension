# Nul Hunter

A VS Code extension that finds and removes NUL (null byte) files from your projects.

## Features

- **Find NUL Files**: Scans your workspace to detect files that consist entirely of NUL (0x00) bytes
- **Clean NUL Files**: Safely removes detected NUL files with confirmation
- **Context Menu**: Right-click any folder in the explorer to clean NUL files
- **Progress Tracking**: Visual progress indicator during scanning and cleaning
- **Size Reporting**: Shows the total size of deleted files

## Usage

### Command Palette
1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type `Nul Hunter: Find NUL Files` to scan for NUL files
3. Type `Nul Hunter: Clean NUL Files` to find and delete NUL files

### Explorer Context Menu
1. Right-click on any folder in the Explorer
2. Select `Nul Hunter: Clean NUL Files`

## What are NUL Files?

NUL files are corrupted or invalid files where the entire content consists of null bytes (0x00). These files typically occur due to:
- File system corruption
- Interrupted write operations
- Software bugs during file creation
- Disk errors

These files serve no purpose and can safely be removed from your projects.

## Requirements

- VS Code 1.74.0 or higher

## Installation

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for `Nul Hunter`
4. Click `Install`

## Feedback

If you have any feedback or issues, please visit our [GitHub repository](https://github.com/MuratBilginerSoft/Nul-Hunter-Extension).

---

# Nul Hunter (Turkce)

Projelerinizdeki NUL (null byte) dosyalarini bulan ve temizleyen bir VS Code eklentisi.

## Ozellikler

- **NUL Dosyalarini Bul**: Calisma alaninizi tarayarak tamamen NUL (0x00) baytlarindan olusan dosyalari tespit eder
- **NUL Dosyalarini Temizle**: Tespit edilen NUL dosyalarini onay ile guvenle siler
- **Sag Tik Menusu**: Explorer'da herhangi bir klasore sag tiklayarak NUL dosyalarini temizleyin
- **Ilerleme Takibi**: Tarama ve temizleme sirasinda gorsel ilerleme gostergesi
- **Boyut Raporu**: Silinen dosyalarin toplam boyutunu gosterir

## Kullanim

### Komut Paleti
1. Komut Paletini acin (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. NUL dosyalarini taramak icin `Nul Hunter: Find NUL Files` yazin
3. NUL dosyalarini bulup silmek icin `Nul Hunter: Clean NUL Files` yazin

### Explorer Sag Tik Menusu
1. Explorer'da herhangi bir klasore sag tiklayin
2. `Nul Hunter: Clean NUL Files` secenegini secin

## NUL Dosyalari Nedir?

NUL dosyalari, tum icerigi null baytlarindan (0x00) olusan bozuk veya gecersiz dosyalardir. Bu dosyalar genellikle su nedenlerle olusur:
- Dosya sistemi bozulmasi
- Kesintiye ugrayan yazma islemleri
- Dosya olusturma sirasinda yazilim hatalari
- Disk hatalari

Bu dosyalar hicbir amaca hizmet etmez ve projelerinizden guvenle kaldirilabilir.

## Gereksinimler

- VS Code 1.74.0 veya ustu

## Kurulum

1. VS Code'u acin
2. Eklentiler bolumune gidin (`Ctrl+Shift+X`)
3. `Nul Hunter` arayin
4. `Install` tiklayin

## Geri Bildirim

Herhangi bir geri bildiriminiz veya sorununuz varsa, lutfen [GitHub deposumuzu](https://github.com/MuratBilginerSoft/Nul-Hunter-Extension) ziyaret edin.
