# Shared Module (fill_ai_shared) 設計規約

## 概要

`src/shared` は fill_ai と proof_ai の共通ライブラリ（submodule: `fill_ai_shared`）。
**どちらのプロジェクトにも属さない汎用的なものだけ**を置く。

## 配置基準

### ✅ shared に置いていいもの
- **両プロジェクトで使用する型定義**（`ParsedArticle`, `Patch` 等）
- **両プロジェクトで使用する定数**（`LLM_MAX_RETRIES`, `MAX_RETRY_DELAY_MS` 等）
- **両プロジェクトで使用するユーティリティ**（logger, helpers）
- **LLM provider設定**（`PORTKEY_ENABLED`, `ZAI_API_KEY` 等）
- **汎用的なバリデーション・スコア計算**

### ❌ shared に置いてはいけないもの
- **片方のプロジェクト専用の定数**
  - 例: `CHUNK_BATCH_SIZE`, `PHASE_START_DELAY_MS`, `MAX_INPUT_CHARS`, `SUMMARY_MAX_TOKENS`, `DEFAULT_CONFIDENCE_THRESHOLD`, `FILL_AUTO_APPLY_THRESHOLD`
  - これらは各プロジェクトの `src/lib/engine/engine-config.ts` に配置する
- **片方のプロジェクト専用のロジック**
- **プロジェクト固有のエラーメッセージ**

## 判断フロー

```
新しい定数・関数を追加したい
  ├─ 両プロジェクトで使う？ → YES → shared に配置
  └─ 一方のプロジェクトのみ？ → NO → そのプロジェクト内に配置
```

## 更新手順

### shared 側の変更時
1. `fill_ai_shared` リポでコミット＆プッシュ
2. **両方のプロジェクト**で `git submodule update --remote src/shared`
3. **両方のプロジェクト**で `git add src/shared && git commit -m "chore: update fill_ai_shared submodule (xxx)"`
4. それぞれプッシュ

### プロジェクト側から shared に追加したい時
1. `src/shared` に直接コミット＆プッシュ
2. ↑ の更新手順に従う

## 過去の教訓

- **2026-03-28**: proof_ai の Phase Engine 専用定数を shared に置いた結果、shared 更新時に proof_ai のビルドが壊れた → `engine-config.ts` に分離して解決
- **2026-03-28**: `shared/`（古いパス）が fill_ai に残骸として残っていた → 不要なディレクトリは即削除
- **2026-03-28**: tsx 実行時に `.env.local` が読まれない → dotenv/config が必要
