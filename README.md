# World Indicator News Discord Bot

世界銀行の経済指標とニュースをまとめて配信するDiscordボットです。指標の比較、国別のニュース取得、サブスク通知に対応しています。

## 主な機能
- 経済指標の取得（World Bank）
- 国別ニュースの取得（NewsData.io）
- スラッシュコマンド（/news, /top, /compare, /subscribe など）
- サブスクリプション通知

## 必要要件
- Node.js 18+
- Discord Botトークン
- NewsData.io APIキー

## セットアップ
1) 依存関係をインストール
```
npm install
```

2) 環境変数を設定
```
copy .env.example .env
```
`.env`に以下を設定してください。
- `DISCORD_TOKEN` : Discord Botトークン
- `APPLICATION_ID` : DiscordのアプリケーションID
- `NEWSDATA_API_KEY` : NewsData.io APIキー
- `DB_PATH` : SQLite DBの保存パス（省略可）

3) コマンドの登録
```
npm run deploy-commands
```

4) 起動
```
npm run dev
```

## スクリプト
- `npm run dev` : 開発起動（nodemon）
- `npm run build` : TypeScriptビルド
- `npm start` : 本番起動（dist）
- `npm run deploy-commands` : スラッシュコマンド登録

## 公開時の注意
- `.env`には秘密情報が含まれるため、必ずコミットしないでください。
- すでに公開してしまった場合は、トークン/キーを再発行してください。

## データ
- SQLite DBはデフォルトで `./data/bot.db` に作成されます。

## ライセンス
- 未設定
