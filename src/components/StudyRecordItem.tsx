import { useState } from "react";
import type { StudyRecord } from "../types";
import { validate } from "../validate";

type Props = {
    record: StudyRecord,
    onUpdate: (id: string, content: string, minutes: number) => void,
    onDelete: (id: string) => void
}

export function StudyRecordItem({ record, onUpdate, onDelete }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(record.content);
    const [editMinutes, setEditMinutes] = useState(record.minutes);
    const [error, setError] = useState("");

    const handleEditSave = () => {
        setError("");
        const message = validate(editContent, editMinutes);
        if (message !== "") {
            setError(message);
            return;
        }
        onUpdate(record.id, editContent, editMinutes);
        setIsEditing(false);
    }

    const handleEditCancel = () => {
        setError("");
        setIsEditing(false);
        setEditContent(record.content);
        setEditMinutes(record.minutes);
    }

    const handleEditStart = () => {
        // 編集を始める。入力欄は今のrecordの値から始める
        // record.content が、後で変わっても、editContent は、自動では追いつかない
        // そのため、「編集を始める時に、今の値を入れ直す」処理が必要
        setEditContent(record.content);
        setEditMinutes(record.minutes);
        setIsEditing(true);
    }

    const handleDelete = () => {
        // 親に削除を頼む
        onDelete(record.id);
    }

    return (
        <li>
            { isEditing ? (
                <>
                    {record.date} <input type="text" value={editContent} onChange={(e) => setEditContent(e.target.value)} /> <input type="number" value={editMinutes} onChange={(e) => setEditMinutes(Number(e.target.value))}/> {record.category}
                    <button onClick={handleEditSave}>保存</button>
                    <button onClick={handleEditCancel}>キャンセル</button>
                    {error && <p role="alert">{error}</p>}
                </>
            ) : (
                <>
                    {record.date} {record.content} {record.minutes} {record.category}
                    <button onClick={handleEditStart}>編集</button>
                    <button onClick={handleDelete}>削除</button>
                </>
            )}
        </li>
    )
}