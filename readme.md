<div align="center">
  <img src="./public/logo.svg" alt="Project Logo" width="80" />
  
</div>

<h1 align="center">
  Real-Time Collaborative Workspace
</h1>

<p align="center">
A modern collaborative platform where users can create rooms, chat in real-time, and manage files with a nested folder structure.
</p>

---

# Features

- Real-time collaboration between users
- Room-based workspaces
- Live chat messaging
- Nested folder and file management
- Role-based room permissions
- Optimistic UI updates
- Cached file explorer state
- Real-time synchronization across clients
- Smooth animated user interface

---

# Tech Stack

This project uses a modern **full-stack architecture**.

## Frontend

- Next.js – Full-stack React framework used for routing, server components, and API routes.
- Framer Motion – Smooth UI animations and transitions.
- shadcn/ui – Accessible UI component library.
- Zustand – Lightweight state management.
- Zod – Schema validation for API inputs.

## Real-Time Collaboration

- Yjs – CRDT-based collaborative state synchronization.
- Socket.IO – Real-time communication layer.

## Backend

- Next.js API Routes – Server-side backend logic.

## Database

- MongoDB – NoSQL database storing users, rooms, messages, and files.

---

# System Capabilities

Using this stack, the system supports:

- Real-time collaborative workspaces
- Live chat between room members
- Nested folder and file management
- Role-based access control
- Cached folder and file explorer
- Optimistic UI updates
- Smooth animated UI interactions
- Scalable backend architecture

---

# High Level Architecture

```
Client (Next.js + React)
│
├─ UI Components (shadcn/ui)
├─ Animations (Framer Motion)
├─ State Management (Zustand)
│
├─ Real-Time Layer
│   ├─ Yjs (collaborative state)
│   └─ Socket.IO (live communication)
│
▼
Next.js API Routes
│
▼
MongoDB Database
```

---

# Database Design Documentation

This section explains the database structure used in the project.

The system is designed to support:

- collaborative rooms
- chat messaging
- hierarchical document and file management

---

# Overview

The database consists of the following entities:

- **User**
- **Room**
- **RoomMember**
- **Chat**
- **Message**
- **Doc**
- **File**

The design follows a **modular and scalable structure**.

---

# Entity Descriptions

## User

Stores registered users.

| Field     | Type   | Description       |
| --------- | ------ | ----------------- |
| id        | string | Unique identifier |
| name      | string | Display name      |
| picture   | string | Avatar URL        |
| password  | string | Hashed password   |
| rootDirId | string | Root directory    |

Users can:

- own rooms
- send messages
- upload files
- create folders

---

## Room

Collaborative workspace.

| Field     | Type   | Description        |
| --------- | ------ | ------------------ |
| id        | string | Unique identifier  |
| name      | string | Room name          |
| projectId | string | Associated project |
| admin     | string | Room owner         |

Relationship:

```
Room.admin → User.id
```

---

## RoomMember

Manages membership and permissions.

| Field      | Type   | Description        |
| ---------- | ------ | ------------------ |
| id         | string | Unique identifier  |
| userId     | string | Reference to user  |
| roomId     | string | Reference to room  |
| role       | enum   | Member role        |
| permission | string | Custom permissions |

Relationships:

```
RoomMember.roomId → Room.id
RoomMember.userId → User.id
```

---

## Chat

Represents chat threads.

| Field  | Type   | Description       |
| ------ | ------ | ----------------- |
| id     | string | Unique identifier |
| roomId | string | Associated room   |

Relationship:

```
Chat.roomId → Room.id
```

---

## Message

Stores chat messages.

| Field     | Type   | Description       |
| --------- | ------ | ----------------- |
| id        | string | Unique identifier |
| chatId    | string | Chat reference    |
| userId    | string | Sender            |
| content   | string | Message text      |
| repliedId | string | Reply reference   |

Relationships:

```
Message.chatId → Chat.id
Message.userId → User.id
```

---

## Doc (Folder)

Represents directories.

| Field    | Type   | Description       |
| -------- | ------ | ----------------- |
| id       | string | Unique identifier |
| name     | string | Folder name       |
| parentId | string | Parent folder     |
| roomId   | string | Associated room   |
| userId   | string | Creator           |

Relationships:

```
Doc.userId → User.id
Doc.roomId → Room.id
```

---

## File

Represents files inside folders.

| Field    | Type   | Description       |
| -------- | ------ | ----------------- |
| id       | string | Unique identifier |
| name     | string | File name         |
| parentId | string | Parent folder     |
| userId   | string | Owner             |

Relationship:

```
File.parentId → Doc.id
File.userId → User.id
```

---

# Relationships Diagram

```
User
 │
 │ owns
 ▼
Room ────── RoomMember ────── User
 │
 ▼
Chat
 │
 ▼
Message
 │
 ▼
User

Room
 │
 ▼
Doc (Folders)
 │
 ▼
File
```

---

# Setup Instructions

### Clone Repository

```
git clone https://github.com/your-username/your-project.git
cd your-project
```

### Install Dependencies

```
npm install
```

### Run Development Server

```
npm run dev
```

Open:

```
http://localhost:3000
```

---

# Future Improvements

Possible future enhancements:

- collaborative code editor
- drag and drop file explorer
- file version history
- multi-channel chat
- collaborative whiteboard
- real-time cursors

---

# License

MIT License
