export function validate(content: string, minutes: number): string {
  if(content.trim() === ""){
    return "内容を入力してください";
  }
  if(minutes < 1){
    return "時間[分]を入力してください";
  }
  return "";
}
