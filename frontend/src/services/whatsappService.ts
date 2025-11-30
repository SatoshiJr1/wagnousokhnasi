export const sendWhatsAppOrder = async (phone: string, message: string): Promise<boolean> => {
  try {
    const response = await fetch('https://wa.nexteranga.com/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WA-SECRET': 'e9c64f0193ce38099a5e59cfe15faa107325d92fddc655007f62914170e17645'
      },
      body: JSON.stringify({
        phone: phone,
        message: message
      })
    });

    if (response.ok) {
      return true;
    } else {
      console.error('Erreur lors de l\'envoi du message WhatsApp');
      return false;
    }
  } catch (error) {
    console.error('Erreur réseau lors de l\'envoi WhatsApp', error);
    return false;
  }
};
