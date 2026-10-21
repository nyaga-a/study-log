import { useState, useEffect } from "react";

export function useLocalStorage<T>(
    key: string, 
    initialValue: T,
    isValid: (value: unknown) => value is T
){
    const [value, setValue] = useState<T>(() => {
        // localStorage から読み込み、JSON.parse する
        // isValid(parsed) が true なら、そのまま返す
        // （true の後は、TypeScriptが「T 型だ」と理解してくれる）
        // 失敗した時や、isValid が false の時は、initialValue を返す
        try{
            const storageItem = localStorage.getItem(key);
            if(storageItem === null) return initialValue;
            const parsedItem = JSON.parse(storageItem);
            if (isValid(parsedItem)) return parsedItem;
            return initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }

    });

    useEffect(() => {
        // valueが変わったら保存する
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue] as const;
}