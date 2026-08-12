// Übersetzt bekannte Supabase-Auth-Fehlermeldungen ins Deutsche.
export function mapAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "E-Mail oder Passwort ist falsch.";
  }
  if (message.includes("already registered") || message.includes("already been registered")) {
    return "Für diese E-Mail-Adresse existiert bereits ein Konto.";
  }
  if (message.includes("Password should be at least")) {
    return "Das Passwort muss mindestens 6 Zeichen lang sein.";
  }
  if (message.includes("Unable to validate email address") || message.includes("invalid format")) {
    return "Bitte gib eine gültige E-Mail-Adresse ein.";
  }
  if (message.includes("Email not confirmed")) {
    return "Bitte bestätige zuerst deine E-Mail-Adresse.";
  }
  return "Etwas ist schiefgelaufen. Bitte versuche es erneut.";
}
