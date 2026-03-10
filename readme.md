# Database Design Documentation

This document explains the database structure used in the project.
The system is designed to support **collaborative rooms, chat messaging, and file/document management**.

---

# Overview

The database consists of the following main entities:

- **User** – Stores user profile and authentication data.
- **Room** – Represents a collaborative workspace or project.
- **RoomMember** – Manages membership and permissions in rooms.
- **Chat** – Represents a chat thread inside a room.
- **Message** – Stores chat messages.
- **Doc** – Represents folders/directories inside a room.
- **File** – Represents files stored inside folders.

The design follows a **modular and scalable structure** so rooms, chats, and files can grow independently.

---

# Entity Descriptions

## 1. User

Stores information about registered users.

| Field     | Type   | Description                          |
| --------- | ------ | ------------------------------------ |
| id        | string | Unique identifier for the user       |
| name      | string | User's display name                  |
| picture   | string | URL to the user's avatar             |
| password  | string | Hashed password                      |
| rootDirId | string | Root directory belonging to the user |

A user can:

- Own rooms
- Send messages
- Upload files
- Create documents/folders

---

## 2. Room

Represents a collaborative workspace where users can interact.

| Field     | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| id        | string | Unique identifier for the room |
| name      | string | Room name                      |
| projectId | string | Associated project identifier  |
| admin     | string | Owner of the room              |

A room can contain:

- multiple **members**
- one **chat thread**
- multiple **documents/folders**

Relationship:

```
Room.admin → User.id
```

---

## 3. RoomMember

Manages which users belong to which rooms.

| Field      | Type   | Description                                |
| ---------- | ------ | ------------------------------------------ |
| id         | string | Unique identifier                          |
| userId     | string | Reference to the user                      |
| roomId     | string | Reference to the room                      |
| role       | enum   | Member role (admin / editor / viewer etc.) |
| permission | string | Custom permissions                         |

Relationship:

```
RoomMember.roomId → Room.id
RoomMember.userId → User.id
```

This table allows:

- **multiple users per room**
- **multiple roles**
- flexible permission systems

---

## 4. Chat

Represents the chat system inside a room.

| Field  | Type   | Description                    |
| ------ | ------ | ------------------------------ |
| id     | string | Unique identifier              |
| roomId | string | Room to which the chat belongs |

Relationship:

```
Chat.roomId → Room.id
```

Each room can have **one chat channel**.

---

## 5. Message

Stores messages sent in chat.

| Field     | Type   | Description                                |
| --------- | ------ | ------------------------------------------ |
| id        | string | Unique identifier                          |
| chatId    | string | Chat thread reference                      |
| userId    | string | Sender of the message                      |
| content   | string | Message text                               |
| repliedId | string | Reference to another message (for replies) |

Relationship:

```
Message.chatId → Chat.id
Message.userId → User.id
```

Features supported:

- threaded replies
- message ownership
- scalable message history

---

## 6. Doc (Folder / Directory)

Represents folders inside a room.

| Field    | Type   | Description                      |
| -------- | ------ | -------------------------------- |
| id       | string | Unique identifier                |
| name     | string | Folder name                      |
| parentId | string | Parent folder                    |
| roomId   | string | Room to which the folder belongs |
| userId   | string | Creator of the folder            |

Relationships:

```
Doc.userId → User.id
Doc.roomId → Room.id
```

This allows **nested folder structures**.

---

## 7. File

Represents files stored inside folders.

| Field    | Type   | Description       |
| -------- | ------ | ----------------- |
| id       | string | Unique identifier |
| name     | string | File name         |
| parentId | string | Parent folder     |
| userId   | string | Owner of the file |

Relationship:

```
File.parentId → Doc.id
File.userId → User.id
```

This supports:

- hierarchical file systems
- folder-based organization

---

# Relationships Diagram (Simplified)

```
User
 │
 │ owns
 ▼
Room ────── RoomMember ────── User
 │
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

# Key Design Decisions

### 1. Room-Based Architecture

All collaboration happens inside **rooms**, making it easy to scale permissions and features.

### 2. Separation of Chat and Messages

A separate **Chat table** allows future expansion like:

- multiple channels
- private chats
- message analytics

### 3. Folder-Based Document System

`Doc` represents directories and `File` represents files, allowing **nested file structures**.

### 4. Role-Based Access Control

`RoomMember` stores roles and permissions, enabling flexible access control.

---
