---
sidebar_position: 1
---
![[Pasted image 20250711130838.png]]
# Tutorial Intro

Let's discover **Docusaurus in less than 5 minutes**.


![[Pasted image 20250711131221.png]]## Getting Started

Get started by **creating a new site**.

Or **try Docusaurus immediately** with **[docusaurus.new](https://docusaurus.new)**.

### What you'll need

- [Node.js](https://nodejs.org/en/download/) version 18.0 or above:
  - When installing Node.js, you are recommended to check all checkboxes related to dependencies.

## Generate a new site

Generate a new Docusaurus site using the **classic template**.

The classic template will automatically be added to your project after you run the command:

```bash
npm init docusaurus@latest my-website classic
```

You can type this command into Command Prompt, Powershell, Terminal, or any other integrated terminal of your code editor.

The command also installs all necessary dependencies you need to run Docusaurus.

## Start your site

Run the development server:

```bash
cd my-website
npm run start
```

The `cd` command changes the directory you're working with. In order to work with your newly created Docusaurus site, you'll need to navigate the terminal there.

The `npm run start` command builds your website locally and serves it through a development server, ready for you to view at http://localhost:3000/.

Open `docs/intro.md` (this page) and edit some lines: the site **reloads automatically** and displays your changes.


```mermaid
flowchart TD
    A[App 启动] --> B[调用 iOS API<br/>getPendingNotificationRequests]
    B --> C[获取当前系统通知 ID 列表]
    C --> D[读取 DB 中 inQueue=true 的通知 ID 列表]
    
    D --> E1[标记不在系统列表但 inQueue=true 的 → inQueue=false]
    D --> E2[标记在系统列表但 inQueue=false 的 → inQueue=true]
    
    E1 --> F[计算系统队列数量]
    E2 --> F
    
    F --> G{队列数量 < 64?}
    G -- 是 --> H[从 DB 中选最早未加入队列的通知<br/>直到补满 64 条]
    G -- 否 --> I[从 DB 中选 inQueue=true 但超出 64 条的通知 → 取消]
    
    H --> J[同步完成，进入正常运行]
    I --> J
    
    J --> K[运行中监听：新增/修改/删除通知事件]
    K --> L[更新系统队列 + DB 的 inQueue 状态]
```