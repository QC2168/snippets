export default function saveFile(url: string) {
  const a = document.createElement('a');
  a.href = url;
  a.click();
}
