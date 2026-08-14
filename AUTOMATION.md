# AUTOMATION — 発火・駆動・停止・連携の宣言

> このリポジトリがどう発火・駆動・停止し、エコシステムの他リポとどう連携するかの Single Source of Truth。
> 配置規約は [SHARED_MODULE_DESIGN.md](SHARED_MODULE_DESIGN.md)。本ファイルは発火・駆動の宣言に限定する。

## Driver(発火方式)

| 用途 | 現在の driver | 最終 driver |
|---|---|---|
| 開発(共有コード追加・修正) | **manual** — どちらかのプロダクト(fill_ai / proof_ai)で共有コードが必要になった依頼を起点に、このリポで直接編集・commit・push | manual(需要駆動のライブラリ開発として維持) |
| 配布(下流への反映) | **event-driven** — push 後、各プロダクトが `git submodule update --remote src/shared` でポインタ更新して追従。リリース・パッケージ公開の作業は存在しない | event-driven(維持) |

## Schedule(駆動間隔)

- 開発: 非定期・需要時(プロダクト側の依頼がトリガー)。
- 定期実行(cron / timer / CI スケジュール)は**設定していない**。

## Entrypoint(実行コマンド)

- 開発: このリポ(`fill_ai_shared`)で直接編集 → `git add/commit/push`
- 品質ゲート(コミット前提): 単体テストは `npx vitest run`(スタンドアロン実行可能)。プロダクト側でも `npm run test:shared`(proof_ai)/ 各プロダクトのビルドで検証
- 配布: push 後、各プロダクト側で `git submodule update --remote src/shared` → ポインタ更新コミット(手順は各プロダクトの CLAUDE.md)

## Stall Policy(停止時の扱い)

- **開発(manual)**: 手動・停止は自然。変更需要がない(= どちらのプロダクトも共有コードの追加・修正を必要としていない)のは正常状態。
- **配布(event-driven)**: push 後にプロダクトが追従しなくても自然。各プロダクトの AUTOMATION.md に宣言された追従ポリシーに従う(本リポ側から催促しない)。

## Coordination(エコシステム連携)

- **役割**: fill_ai(PDF自動記入・現在 paused)と proof_ai(WordPress記事AI校閲・active)の共通ライブラリ(LLM providers / config / crypto / types 等)。TypeScript ソースをそのまま ship し、依存は親プロダクトが提供。
- **配置規約**: 両プロダクトで使用するものだけを置く(SHARED_MODULE_DESIGN.md)。片方専用のコードは各プロダクトの `engine-config.ts` 等へ。
- **下流**: fill_ai / proof_ai(git submodule `src/shared` として参照)。**後方互換性を維持すること** — 特に fill_ai が休止中のため、破壊的変更は active な proof_ai が即追従できる形に限る。

## Kill Switch(緊急停止)

- N/A(manual 駆動のみ・定期実行なし・ランタイムプロセスを持たないライブラリ)。

## Status(現在の稼働状態)

**stable(需要駆動)** — 最終 push 2026-05-16(6e5586c)。変更要件なし・ブロッカーなし。main は origin/main と同期。

## Notes(特記)

- 破壊的変更(export 削除・型変更)は、両プロダクトの追従状況を確認してから行うこと(fill_ai は paused 中のため実質 proof_ai 同時追従が前提)。
- push だけでは下流に反映しない(ポインタ更新は各プロダクトの責務)。変更通知が必要な場合はプロダクト側の依頼として扱う。
- 姉妹リポ(fill_ai / proof_ai)の AUTOMATION.md と連携宣言の整合を保つこと。

_最終更新: 2026-08-14 / driver 変更時は本ファイルを更新すること_
