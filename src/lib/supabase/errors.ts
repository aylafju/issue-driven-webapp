// Übersetzt bekannte Supabase-Auth-Fehlermeldungen ins Deutsche.
export function mapAuthError(message: string): string {
  if (message.includes("provider is not enabled")) {
    return "Dieser Anmeldedienst ist aktuell nicht verfügbar.";
  }
  return "Etwas ist schiefgelaufen. Bitte versuche es erneut.";
}
