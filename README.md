# 🚀 Task Management App (Kanban Board)

A premium, fully-functional Kanban-style Task Management application built with React, TypeScript, and Vite. Designed with modern UI/UX principles, smooth animations, and a rich feature set for managing projects efficiently.

## ✨ Features

- **Drag & Drop Kanban Board**: Easily move tasks between columns and reorder columns using `@dnd-kit`.
- **Rich Task Management**:
  - Detailed task modals with Title, Description, Priority, and Labels.
  - Due date selection with calendar picker.
  - Subtasks and checklists with progress tracking.
  - Comments and activity history.
- **File Attachments**: Upload files, view images in a full-screen lightbox preview, and download attachments.
- **Workspace & Project Management**: Switch between projects, invite members, and manage access.
- **Premium UI/UX**:
  - Beautiful, responsive design built with **Tailwind CSS**.
  - Smooth micro-animations, transitions, and modals powered by **Framer Motion**.
  - Custom confirmation dialogues (no native browser alerts).
- **Data Portability**: Export your board to a JSON file and import it back anytime.
- **Local State**: State is currently managed entirely on the client side using **Zustand**.

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Utility**: [date-fns](https://date-fns.org/)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+ recommended) and `npm` installed.

### 2. Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/dandyj18/task-management-app-FE.git

# Navigate to the project directory
cd task-management-app-FE

# Install dependencies
npm install
```

### 3. Running the Development Server

Start the Vite development server:

```bash
npm run dev
```

Open your browser and navigate to the URL provided in the terminal (usually `http://localhost:5173`).

### 4. Building for Production

To build the app for production:

```bash
npm run build
```

This will generate optimized static assets in the `dist` folder.

## 📝 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Compiles TypeScript and builds the app for production.
- `npm run preview`: Previews the production build locally.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is licensed under the MIT License.
