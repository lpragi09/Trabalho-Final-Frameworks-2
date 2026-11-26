const formatoData = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
});
const formatoHora = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });

export const formatarData = (iso) => formatoData.format(new Date(iso));
export const formatarHora = (iso) => formatoHora.format(new Date(iso));
export const formatarDataHora = (iso) => `${formatarData(iso)} às ${formatarHora(iso)}`;

/** "2026-12-10T19:00:00" -> "2026-12-10T19:00" (formato do input datetime-local) */
export const paraInputDataHora = (iso) => (iso ? iso.slice(0, 16) : '');

export const diaDoMes = (iso) => new Date(iso).getDate().toString().padStart(2, '0');
export const mesCurto = (iso) =>
  new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(new Date(iso)).replace('.', '');
