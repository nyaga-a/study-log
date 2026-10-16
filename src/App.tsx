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
    // TODO: idが一致しないものだけを残した新しい配列を、setRecordsに渡す
    // ヒント：prev.filter((r) => ...)
    // setRecords((prev) => prev.filter();
    setRecords((prev) => prev.filter((rec) => rec.id != id));
  };

  return (
    <div>
      <h1>学習記録</h1>
      <form onSubmit={handleSubmit}>
        <input value={content} onChange={(e) => setContent(e.target.value)} />
        {/** TODO: minutes用のinput　type="number"の時の値の型に注意 */}
        <input type="number" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} />
        <button type="submit">追加</button>
      </form>
      <ul>
        {records.map((r) => (
          <li  key={r.id}>
        {/* {records.map((r, index) => (
          <li  key={index}> */}
            {r.date} {r.content} {r.minutes} {r.category}
            <input />
            <button onClick={() => handleDelete(r.id)}>削除</button>
            {/* <button onClick={handleDelete(r.id)}>削除</button> */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;