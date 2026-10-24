import { useState } from "react";
import type { StudyRecord } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { validate } from "./validate";
import { StudyRecordItem } from "./components/StudyRecordItem";

const initialRecords: StudyRecord[] = [
  { id: "1", date: "2026-10-12", content: "型注釈と型推論", minutes: 60, category: "TypeScript" },
  { id: "2", date: "2026-10-13", content: "Union型", minutes: 45, category: "TypeScript" },
];

const categories = ["TypeScript", "React", "CSS"];

const STORAGE_KEY = "records";

const isRecords = (v: unknown): v is StudyRecord[] => Array.isArray(v);

function App() {
  const [records, setRecords] = useLocalStorage(STORAGE_KEY, initialRecords, isRecords);
  const [content, setContent] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [category, setCategory] = useState("TypeScript");
  const [filterCategory, setFilterCategory] = useState("all");// "all" = 絞り込みなし
  const [error, setError] = useState("");

  // 画面に出す配列
  const visibleRecords = 
    filterCategory === "all"
     ? records
     : records.filter((rec) => rec.category === filterCategory);
  // 合計時間
  const total = visibleRecords.reduce((sum, r) => sum + r.minutes, 0);

  const handleUpdate = (id: string, newContent: string, newMinutes: number) => {
    setRecords((prev) => 
      prev.map((rec) => 
        rec.id === id
          ? { ...rec, content: newContent, minutes: newMinutes }
          : rec
        )
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    // ブラウザ標準の送信動作をやめて処理はこの中で行う
    e.preventDefault();

    setError("");
    const message = validate(content, minutes);
    if(message !== ""){
      setError(message);
      return
    }

    // 新しいStudyRecordを作る（idはcrypto.randomUUID()が使える）
    const newRecord = { 
      id: crypto.randomUUID(), 
      date: new Date().toLocaleDateString('sv-SE'), 
      content, 
      minutes, 
      category
    };
    setRecords((prev) => [...prev, newRecord]);

    // 入力欄を空に戻す
    setContent("");
    setMinutes(0);
  };

  const handleDelete = (id: string) => {
    setRecords((prev) => prev.filter((rec) => rec.id !== id));
  };

  return (
    <div>
      <h1>学習記録</h1>
      <form onSubmit={handleSubmit}>
        <input value={content} onChange={(e) => setContent(e.target.value)} />
        <input type="number" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button type="submit">追加</button>
      </form>
      {error && <p role="alert">{error}</p>}
      <label>
        絞り込み：
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">すべて</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>
      <p>合計：{total}分</p>
      <ul>
        {visibleRecords.map((r) => (
          <StudyRecordItem
            key={r.id}
            record={r}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </ul>
      
    </div>
  );
}

export default App;