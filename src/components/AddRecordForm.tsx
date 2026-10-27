import { useState } from "react";
import { validate } from "../validate";

type Props = {
    categories: string[],
    onAdd: (content: string, minutes: number, category: string) => void,
}

export function AddRecordForm({ categories, onAdd }: Props) {
  const [content, setContent] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [category, setCategory] = useState(categories[0]);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = validate(content, minutes);
    if(message !== ""){
        setError(message);
        return;
    }
    setError("");
    setContent("");
    setMinutes(0);
    onAdd(content, minutes, category);
  }

  return (
      <>
        <form onSubmit={handleSubmit}>
            <input aria-label="内容" value={content} onChange={(e) => {setContent(e.target.value); setError("");}} />
            <input aria-label="時間" type="number" value={minutes} onChange={(e) => {setMinutes(Number(e.target.value)); setError(""); }} />
            <select aria-label="区分" value={category} onChange={(e) => {setCategory(e.target.value); setError("");}}>
            {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
            ))}
            </select>
            <button type="submit">追加</button>
        </form>
        {error && <p role="alert">{error}</p>}
      </>
  )
}