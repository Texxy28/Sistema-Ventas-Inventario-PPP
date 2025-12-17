export const formatDate = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)

  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}