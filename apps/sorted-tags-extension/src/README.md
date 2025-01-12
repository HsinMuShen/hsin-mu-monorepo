# Tabs Sorter

**A Chrome Extension that helps you easily sort, organize, and manage your browser tabs.**

---

## Table of Contents

1. [Introduction](#introduction)
2. [Skills & Technologies Used](#skills--technologies-used)
3. [Features](#features)
4. [How to Use](#how-to-use)
5. [Future Plans](#future-plans)

---

## Introduction

Tired of having dozens or even hundreds of tabs open, feeling overwhelmed, and unable to find what you need quickly? **Tabs Sorter** is here to help! This Chrome extension provides an intuitive way to prioritize certain domains, organize non-priority tabs alphabetically or by open time, and quickly close any tabs you no longer need.

**Key benefits:**

- Quickly identify and reorder tabs by important domains.
- Sort other tabs alphabetically or by their open time.
- See how long a tab has been open, in real time.
- Close tabs with a single click from the popup.

---

## Skills & Technologies Used

1. **TypeScript**

   - Used for type-safe code in the background script (`background.ts`).

2. **React (with functional components)**

   - The popup UI is built using React functional components.

3. **Material UI (MUI)**

   - Provides modern and responsive UI components (Typography, Container, Buttons, etc.).

4. **Chrome Extension APIs**

   - **Tabs API**: Query, create, move, and remove browser tabs.
   - **Storage API**: Save and load priority domains to/from local storage.
   - **Runtime API**: Communicate between the popup and background scripts.

5. **Vite / Webpack / (any build tool of choice)**

   - Typically used to bundle and serve React + TypeScript for Chrome extension development (adjust based on your actual setup).

---

## Features

1. **Priority Domain Sorting**

   - Select one or more domains as priority. These tabs will always be placed at the front of your tabs list.

2. **Non-Priority Tab Sorting**

   - Sort non-priority tabs alphabetically (A–Z by domain).
   - Sort non-priority tabs by their open time (oldest first).

3. **Tab Open Time Tracking**

   - See a real-time display of how long each tab has been open (e.g., `2m 15s`, `3h 10m`, `1d 5h`).

4. **Easy Tab Closing**

   - Close any tab from the popup by clicking the **Close** icon.

5. **Live Refresh**
   - Refresh and re-fetch tabs from the current window with a single click.

---

## How to Use

1. **Install / Load the Extension**

   - Go to `chrome://extensions`.
   - Enable **Developer mode** (toggle in the top right corner).
   - Click **Load unpacked** and select the folder containing the **Tabs Sorter** extension source files (with the `manifest.json`).

2. **Open the Popup**

   - Click on the **Tabs Sorter** extension icon in the Chrome toolbar.

3. **Select Priority Domains**

   - In the popup, select which domains you want to prioritize (e.g., `github.com`, `google.com`).

4. **Sort Tabs**

   - **Sort Priority Tabs** – Moves all priority domains to the front.
   - **Sort Non-Priority Tabs (A–Z)** – Sorts remaining tabs by domain in alphabetical order.
   - **Sort Non-Priority Tabs (Open Time)** – Sorts remaining tabs by the time they were opened (oldest first).

5. **Close Tabs**

   - In the **Open Tabs** list, click the **Close** icon to quickly close any tab.

6. **Refresh**
   - Use the **Refresh Tabs** button in the popup if you’ve opened/closed tabs outside the extension and want to see the latest state.

---

## Future Plans

1. **Advanced Filtering & Tagging**

   - The ability to assign custom tags (e.g., “Work”, “Entertainment”, “Research”) and filter or sort by them.

2. **Tab Group Integration**

   - Automatically create Chrome’s native tab groups based on your chosen priority domains or tags.

3. **Sync Storage**

   - Option to sync extension settings across all Chrome browsers where you’re signed in.

4. **More Sorting Options**

   - Sort by tab title or visit count, or create custom rules (e.g., “Move YouTube tabs to the end”).

5. **Context Menu Support**
   - Right-click options on tabs or links to quickly add them to priority domains.

---

### Thank You for Checking Out **Tabs Sorter**!

We hope **Tabs Sorter** saves you time and keeps your tabs manageable. Contributions and suggestions are welcome—please feel free to [open an issue](#) or submit a pull request if you have ideas for improvements or encounter any bugs.

Enjoy your organized tabs!
