# Note App

## 概要
ユーザーがノートを作成、整理、タグ付けできるアプリケーションです。フォルダによる階層管理や、AI生成タグの管理機能、NextAuth.js による認証機能を備えています。

## 技術スタック

- **Database**: PostgreSQL (Supabase等)
- **ORM**: Prisma
- **Authentication**: NextAuth.js (Auth.js)

## データモデル (Prisma Schema)

- **User**: アプリケーションのユーザー。NextAuth と連携。
- **Note**: ユーザーが作成するノート。タイトルと本文を持つ。
- **Folder**: ノートを整理するためのフォルダ。
- **Tag**: ノートに付与するタグ。AI生成かどうかのフラグ (`isAiGenerated`) を持つ。

## 開発環境のセットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成し、データベース接続URLを設定してください。

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

### 3. データベースの同期

Prisma のスキーマ定義をデータベースに反映させます。

```bash
# 開発用（プロトタイピング）
npx prisma db push

# または マイグレーション管理を行う場合
npx prisma migrate dev --name init
```

### 4. Prisma Studio の起動

データベースの中身をGUIで確認・編集できます。

```bash
npx prisma studio
```
---
# 2026/01/08　技術不足により一時中断および引き継ぎ十分

## 1. プロジェクトの現状 (Where am I?)

* **目的**: AIが自動タグ付けするMarkdownノートアプリの構築。
* **構成**: Next.js (App Router) + Supabase (PostgreSQL) + Prisma (ORM)。
* **進捗**: データベースの「箱」と「設計図」ができあがり、**認証機能（NextAuth）の実装を開始した直後**でストップしています。

---

## 2. 完了済みのステップ

* [x] **Supabaseプロジェクト作成**: クラウド上にDBが稼働中。
* [x] **Prisma初期設定**: `schema.prisma` ファイルが存在し、モデル定義が完了。
* [x] **DBスキーマ反映**: `npx prisma db push` を実行し、Supabase側に `User`, `Note`, `Tag` 等のテーブルが作成済み。
* [x] **環境変数設定**: `.env` に `DATABASE_URL` が記述済み。
* [x] **ライブラリ導入**: `next-auth`, `@auth/prisma-adapter`, `bcrypt` がインストール済み。

---

## 3. 次にやるべきこと (Next Steps)

### ① 認証の心臓部を作る

`src/app/api/auth/[...nextauth]/route.ts` を作成し、メールアドレス/パスワード認証（Credentials）のロジックを書き込む。

### ② ユーザー登録（サインアップ）の実装

1. `src/app/api/register/route.ts` を作成（パスワードを `bcrypt` で暗号化してDBに保存するAPI）。
2. 登録画面（UI）を作成し、自分のアカウントを実際に作ってみる。

### ③ ログイン・ログアウトの実装

1. ログイン画面を作成。
2. `useSession()` を使って、ログイン中のユーザー名が画面に出るか確認。

---

## 4. 学習が必要なキーワード (Learning Keywords)

1. **Prisma (ORM)**:
* `prisma.user.create()` や `findUnique()` といったコードで、どうやってDBを操作するか。


2. **NextAuth (Credentials Provider)**:
* 独自のメール＆パスワード認証の流れ。特に「JWT」という単語の意味。


3. **API Routes (Next.js)**:
* `src/app/api/` 内に `route.ts` を置くと、フロントからリクエストを送れるようになる仕組み。



---

## 5. 接続情報 (Secret Info)

再開時にチェックが必要なファイル：

* **`.env`**: ここにDBのパスワードや `NEXTAUTH_SECRET` が正しく入っているか。
* **`prisma/schema.prisma`**: ここに定義された `model` が最新か。

---
