export type StudyRecord = {
    id: string;
    date: string;   // "2026-10-13"の形式
    content: string;    // 何を勉強したか
    minutes: number;    // 学習時間（分）
    category: string;   // "TypeScript"など
};