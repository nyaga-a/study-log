import { useState } from "react";
import type { StudyRecord } from "./types";

const initialRecords: StudyRecord[] = [
  { id: "1", date: "2026-10-12", content: "型注釈と型推論", minutes: 60, category: "TypeScript" },
  { id: "2", date: "2026-10-13", content: "Union型", minutes: 45, category: "TypeScript" },
];

function App() {
  const [records, setRecords] = useState<StudyRecord[]>(initialRecords);
  const [content, setContent] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editMinutes, setEditMinutes] = useState(0);

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
    
    // 新しいStudyRecordを作る（idはcrypto.randomUUID()が使える）
    const newRecord = { 
      id: crypto.randomUUID(), 
      date: new Date().toLocaleDateString('sv-SE'), 
      content, 
      minutes, 
      category: "TypeScript"
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
        <button type="submit">追加</button>
      </form>
      <ul>
        {records.map((r) => (
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