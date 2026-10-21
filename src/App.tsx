import { useState } from "react";
import type { StudyRecord } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editMinutes, setEditMinutes] = useState(0);
  const [filterCategory, setFilterCategory] = useState("all");// "all" = 絞り込みなし
  const [error, setError] = useState("");

  // 画面に出す配列
  const visibleRecords = 
    filterCategory === "all"
     ? records
     : records.filter((rec) => rec.category === filterCategory);
  // 合計時間
  const total = visibleRecords.reduce((sum, r) => sum + r.minutes, 0);

  const handleEditStart = (r: StudyRecord) => {
    setEditingId(r.id);
    setEditContent(r.content);// 今の値を編集世の状態にコピーする
    setEditMinutes(r.minutes);
  };

  const handleEditCancel = () => setEditingId(null);

  const handleEditSave = () => {
    setRecords((prev) => 
      prev.map((rec) => 
        rec.id === editingId
          ? { ...rec, content: editContent, minutes: editMinutes }
          : rec
        )
    );
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    // ブラウザ標準の送信動作をやめて処理はこの中で行う
    e.preventDefault();

    setError("");
    if(content.trim() === ""){
      setError("内容を入力してください");
      return
    }
    if(minutes < 1){
      setError("時間[分]を入力して下さい");
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
      {error && <p role="alert">{error} </p>}
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
          <li  key={r.id}>
            {editingId === r.id ? (
              <>
                {r.date} <input type="text" value={editContent} onChange={(e) => setEditContent(e.target.value)} /> <input type="number" value={editMinutes} onChange={(e) => setEditMinutes(Number(e.target.value))}/> {r.category}
                <button onClick={handleEditSave}>保存</button>
                <button onClick={handleEditCancel}>キャンセル</button>
              </>
            ) : (
              <>
                {r.date} {r.content} {r.minutes} {r.category}
                <button onClick={() => handleEditStart(r)}>編集</button>
                <button onClick={() => handleDelete(r.id)}>削除</button>
              </>
            )}
          </li>
        ))}
      </ul>
      
    </div>
  );
}

export default App;