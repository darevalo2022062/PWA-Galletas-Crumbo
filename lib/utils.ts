export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('es-GT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  received: 'Pedido recibido',
  preparing: 'En preparación',
  ready: 'Listo para entrega',
  delivered: 'Entregado',
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  received: 'bg-blue-100 text-blue-800',
  preparing: 'bg-yellow-100 text-yellow-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-700',
}
