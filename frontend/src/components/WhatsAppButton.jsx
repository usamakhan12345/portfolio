import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = '923162920295'; // Pakistani code + number
  const message = 'Hi Usama, I found your portfolio and would like to discuss a project.';
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Contact Usama on WhatsApp"
      title="Chat on WhatsApp"
    >
      <MessageCircle size={28} style={{ transform: 'scaleX(-1)' }} />
    </a>
  );
};

export default WhatsAppButton;
