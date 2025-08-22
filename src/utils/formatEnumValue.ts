// Função utilitária para formatar valores de enums para exibição
export function formatEnumValue(value: string): string {
  if (!value) return '';
  // Converte para maiúsculo, substitui underscores por espaço e capitaliza a primeira letra
  const formatted = value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
  return formatted;
}
