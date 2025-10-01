# 🏠 Hostel Issues Management System

## 📁 Project Structure

- **Frontend**: React.js + Tailwind CSS
- **Backend**: Node.js + Express.js + MySQL
- **Authentication**: Google Sign-In (for students) & JWT (for caretakers)

---

## 🔧 Backend Setup

### ✅ Requirements
- Node.js
- MySQL
- npm

### ⚙️ Configuration
- Check and update:
  - `db.js`: for DB connection
  - `.env`: for environment variables
  - `index.js`: main server file

### 🗃️ Database Setup
1. Create a MySQL database (name should match database name in `db.js`).
2. Run the provided `.sql` file(in folder hc/sql file) to create tables and insert initial data.

### 👥 Users Setup
- Insert users manually into the `users` table.
- **Students**:
  - Use a Google email.
  - Set `role` as `'user'`.
- **Caretakers**:
  - Set `role` as `'admin'`.
  - Password must be **hashed** using bcrypt with salt rounds = 10:
    ```js
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('your_password', 10);
    ```

### 🛡️ Authentication
- JWT tokens are used.
- Tokens are issued on login and required for protected routes.

### ▶️ Run Backend

```bash
npm install
node index.js
```
-
-
-
-
-
-
-
-

-
-
-
-
-
-
-
-
-
-
-
-
-




# 🔄 Hostel Connect– Workflow Overview

This document explains the complete **workflow** of the Hostel Management System project, including how different modules function and interact between **students** and **caretakers**.

---

## 🧑‍🎓 Student Dashboard

The student dashboard consists of the following sections:

- **Profile**
- **Complaints**
- **Lost and Found**
- **Collaborative Learning**
- **Late Entry Requests**
- **Announcements**

---

### 📇 1. Profile

- Displays personal and academic details of the student.
- Information is fetched from the database and is mostly read-only.

---

### 📝 2. Complaints – Workflow

- Students can:
  - File new complaints
  - View complaint logs
- Complaint **types**:
  - **Block Specific**:
    - Visible to students in the **same block** and relevant caretakers.
  - **Personal/Confidential**:
    - Visible **only** to the student who raised it and the **caretaker**.
  - **General**:
    - Visible to **all students and caretakers**, across blocks.

- **Blocks** supported: `A`, `B`, `C`, `D`
- **Caretaker Side**:
  - Can view all complaints.
  - Can update the **action/status**, which will be reflected in the student’s view.

---

### 🔍 3. Lost and Found – Workflow

- Students can:
  - **Post items** with images.
  - Choose whether an item is **Lost** or **Found**.

#### 🔄 Status Flow:

**If posted as Lost:**
- Caretaker can mark the status as:
  - `With Caretaker`
- Student will see the updated status.
- Once student collects it → caretaker marks as `Claimed`.

**If posted as Found:**
- Other students can check.
- If the original owner collects it from caretaker → status is updated to `Claimed`.

- All actions are **tracked** and visible depending on status.

---

### 🤝 4. Collaborative Learning – Workflow

- Students can:
  - Post **skills or topics** they want to **teach or discuss**.
  - Other students can **join** or **leave** a learning group.

- Designed to encourage **peer-to-peer learning**.

---

### ⏰ 5. Late Entry Requests – Workflow

- Students can:
  - Submit **late entry requests** with reason/date/time.
- Caretaker can:
  - **Approve** or **Reject** requests.
- Status is shown to the student once acted upon.

---

### 📢 6. Announcements – Workflow

- Caretaker can:
  - Post announcements.
  - Categorize them (e.g., `Urgent`, `General`, `Maintenance`, etc.)
  - Specify whether announcement is:
    - **Block Specific** (visible only to students of that block)
    - **General** (visible to all students)

- Students can:
  - View announcements relevant to their block or general ones.

---

## 🔁 Summary of Roles

### 👨‍🎓 Students Can:
- View and update their profile
- Raise complaints
- Post or view lost/found items
- Participate in collaborative learning
- Submit late entry requests
- View announcements

### 🧑‍💼 Caretakers Can:
- View all complaints and update statuses
- Track lost/found items and update their status
- Approve/reject late entry requests
- Post announcements for specific blocks or general notices

---

