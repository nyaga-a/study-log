import { useState } from "react";
import type { StudyRecord } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { StudyRecordItem } from "./components/StudyRecordItem";
import { AddRecordForm } from "./components/AddRecordForm";

const initialRecords: StudyRecord[] = [
  { id: "1", date: "2026-10-12", content: "型注釈と型推論", minutes: 60, category: "TypeScript" },
  { id: "2", date: "2026-10-13", content: "Union型", minutes: 45, category: "TypeScript" },
];

const categories = ["TypeScript", "React", "CSS"];

const STORAGE_KEY = "records";

const isRecords = (v: unknown): v is StudyRecord[] => Array.isArray(v);

function App() {
  const [records, setRecords] = useLocalStorage(STORAGE_KEY, initialRecords, isRecords);
  const [filterCategory, setFilterCategory] = useState("all");// "all" = 絞り込みなし

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

  const handleAdd = (newContent: string, newMinutes: number, newCategory: string) =>{
    const newRecord: StudyRecord = { 
      id: crypto.randomUUID(), 
      date: new Date().toLocaleDateString('sv-SE'), 
      content: newContent, 
      minutes: newMinutes, 
      category: newCategory
    };
    setRecords((prev) => [...prev, newRecord]);
  }

  const handleDelete = (id: string) => {
    setRecords((prev) => prev.filter((rec) => rec.id !== id));
  };

  return (
    <div>
      <h1>学習記録</h1>
      <AddRecordForm categories={categories} onAdd={handleAdd}/>
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