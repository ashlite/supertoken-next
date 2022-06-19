export default function useDateFormat(date, format) {
  let dateResult
  if (format == "calendar") {
    dateResult = new Date(date*1000).toLocaleDateString('en-US')
  } else if (format == "timestamp") {
    dateResult = Math.floor(new Date(date).getTime() / 1000)
  }
  return dateResult
}