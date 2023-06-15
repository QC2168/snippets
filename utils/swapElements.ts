export default function swapElements(arr: any[], index1: number, index2: number): any[] {
  if (arr.length < index1 || arr.length < index2) return arr;
  [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
  return arr;
}
