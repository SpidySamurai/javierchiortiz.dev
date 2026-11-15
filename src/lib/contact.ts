export const WHATSAPP_PHONE = '529904147791';
export const CONTACT_EMAIL = 'javierchiortiz@gmail.com';

export function whatsappUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
