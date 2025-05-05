
import { CHATBOT_NAME, FAQ_ITEMS } from "../constants/chatbot";
import { FAQItem, Language } from "../types/chatbot";

// Generate a random ticket number
export function generateTicketNumber(): string {
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  return `SR${datePart}${randomPart}`;
}

// Get current date in YYYY-MM-DD format
export function getCurrentDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

// Get date one month from now in YYYY-MM-DD format
export function getOneMonthFromNow(): string {
  const now = new Date();
  now.setMonth(now.getMonth() + 1);
  return now.toISOString().split('T')[0];
}

// Check if a string contains any keywords from an array
export function containsKeywords(text: string, keywords: string[]): boolean {
  const lowercaseText = text.toLowerCase();
  return keywords.some(keyword => lowercaseText.includes(keyword.toLowerCase()));
}

// Find an FAQ match based on user input
export function findFAQMatch(userInput: string): FAQItem | undefined {
  return FAQ_ITEMS.find(faq => containsKeywords(userInput, faq.keywords));
}

// Format message with bot name and timestamp
export function formatBotMessage(message: string): string {
  return `${message}`;
}

// Get translated text based on current language
export function getTranslatedText(
  key: string, 
  language: Language = 'english',
  params: Record<string, string> = {}
): string {
  const translations: Record<string, Record<string, string>> = {
    english: {
      greeting: "Hello! I'm your POS Service Assistant. How can I help you today?",
      select_option: "Please select an option:",
      installation: "Installation",
      deinstallation: "De-installation",
      reactivation: "Reactivation",
      maintenance: "Maintenance",
      faq: "FAQ",
      back_to_menu: "Going back to the main menu...",
      merchant_id_prompt: "Let's get started with your installation request. Please enter your Merchant ID:",
      merchant_info_found: "I found your merchant information:",
      merchant_confirmation: "Is this information correct? We'll need to verify with an OTP.",
      otp_sent: "A verification code has been sent: ",
      otp_success: "OTP verification successful! Now, which type of POS would you like to install?",
      otp_error: "Sorry, that OTP is incorrect. Please try again.",
      pos_selection: "Now, which type of POS would you like to install?",
      apos: "Advanced POS (APOS)",
      classic_pos: "Classic POS",
      time_slot: "Please select a time slot for your installation on",
      request_submitted: "Installation Request Submitted",
      ticket_created: "Your service ticket has been created:",
      engineer_visit: "Service engineer will visit your location on",
      contact_engineer: "Contact engineer at:",
      feedback_request: "We'd like to ask for your feedback on previous installations to earn service coins. Would you like to proceed with the feedback?",
      yes_feedback: "Yes, provide feedback",
      skip_feedback: "No, skip feedback",
      feedback_submitted: "Feedback Submitted - Thank You!",
      extra_coins: "Thank you for your detailed feedback! You've earned",
      extra_service_coins: "extra Service Coins!",
      total_coins: "Total Service Coins Earned:",
      collect_coins: "Collect 100 coins to redeem for 3 free paper rolls!",
      detailed_feedback: "Your detailed feedback:",
      anything_else: "Is there anything else I can help you with?",
      share_experience: "We'd love to hear more about your experience in detail.",
      share_comments: "Share your comments to earn 5 extra Service Coins!",
      additional_feedback: "Please provide any additional feedback or suggestions:",
      business: "Business:",
      address: "Address:",
      contact: "Contact:",
      mobile: "Mobile:",
    },
    hindi: {
      greeting: "नमस्ते! मैं आपका POS सेवा सहायक हूँ। मैं आपकी कैसे मदद कर सकता हूँ?",
      select_option: "कृपया एक विकल्प चुनें:",
      installation: "इंस्टॉलेशन",
      deinstallation: "डी-इंस्टॉलेशन",
      reactivation: "पुनः सक्रियण",
      maintenance: "रखरखाव",
      faq: "अक्सर पूछे जाने वाले प्रश्न",
      back_to_menu: "मुख्य मेनू पर वापस जा रहे हैं...",
      merchant_id_prompt: "आइए आपके इंस्टॉलेशन अनुरोध के साथ शुरू करें। कृपया अपना मर्चेंट आईडी दर्ज करें:",
      merchant_info_found: "मुझे आपकी मर्चेंट जानकारी मिल गई:",
      merchant_confirmation: "क्या यह जानकारी सही है? हमें OTP के साथ सत्यापित करने की आवश्यकता होगी।",
      otp_sent: "एक सत्यापन कोड भेज दिया गया है: ",
      otp_success: "OTP सत्यापन सफल! अब, आप किस प्रकार का POS इंस्टॉल करना चाहेंगे?",
      otp_error: "क्षमा करें, वह OTP गलत है। कृपया पुनः प्रयास करें।",
      pos_selection: "अब, आप किस प्रकार का POS इंस्टॉल करना चाहेंगे?",
      apos: "उन्नत POS (APOS)",
      classic_pos: "क्लासिक POS",
      time_slot: "कृपया अपने इंस्टॉलेशन के लिए एक समय स्लॉट चुनें",
      request_submitted: "इंस्टॉलेशन अनुरोध जमा किया गया",
      ticket_created: "आपका सेवा टिकट बनाया गया है:",
      engineer_visit: "सेवा इंजीनियर आपके स्थान पर आएंगे",
      contact_engineer: "इंजीनियर से संपर्क करें:",
      feedback_request: "हम सर्विस कॉइन्स कमाने के लिए पिछले इंस्टॉलेशन पर आपके फीडबैक के लिए पूछना चाहेंगे। क्या आप फीडबैक के साथ आगे बढ़ना चाहेंगे?",
      yes_feedback: "हां, फीडबैक प्रदान करें",
      skip_feedback: "नहीं, फीडबैक छोड़ें",
      feedback_submitted: "फीडबैक जमा किया गया - धन्यवाद!",
      extra_coins: "आपके विस्तृत फीडबैक के लिए धन्यवाद! आपने",
      extra_service_coins: "अतिरिक्त सर्विस कॉइन्स कमाए हैं!",
      total_coins: "कुल अर्जित सर्विस कॉइन्स:",
      collect_coins: "3 मुफ्त पेपर रोल के लिए रिडीम करने के लिए 100 कॉइन्स जमा करें!",
      detailed_feedback: "आपका विस्तृत फीडबैक:",
      anything_else: "क्या मैं आपकी और मदद कर सकता हूं?",
      share_experience: "हम आपके अनुभव के बारे में विस्तार से और जानना चाहेंगे।",
      share_comments: "5 अतिरिक्त सर्विस कॉइन्स कमाने के लिए अपनी टिप्पणियां साझा करें!",
      additional_feedback: "कृपया कोई अतिरिक्त प्रतिक्रिया या सुझाव प्रदान करें:",
      business: "व्यापार:",
      address: "पता:",
      contact: "संपर्क:",
      mobile: "मोबाइल:",
    },
    spanish: {
      greeting: "¡Hola! Soy tu Asistente de Servicio POS. ¿Cómo puedo ayudarte hoy?",
      select_option: "Por favor, seleccione una opción:",
      installation: "Instalación",
      deinstallation: "Desinstalación",
      reactivation: "Reactivación",
      maintenance: "Mantenimiento",
      faq: "Preguntas frecuentes",
      back_to_menu: "Volviendo al menú principal...",
      merchant_id_prompt: "Comencemos con su solicitud de instalación. Por favor, ingrese su ID de comerciante:",
      merchant_info_found: "Encontré su información de comerciante:",
      merchant_confirmation: "¿Es correcta esta información? Necesitaremos verificar con un OTP.",
      otp_sent: "Se ha enviado un código de verificación: ",
      otp_success: "¡Verificación OTP exitosa! Ahora, ¿qué tipo de POS le gustaría instalar?",
      otp_error: "Lo siento, ese OTP es incorrecto. Por favor, inténtelo de nuevo.",
      pos_selection: "Ahora, ¿qué tipo de POS le gustaría instalar?",
      apos: "POS Avanzado (APOS)",
      classic_pos: "POS Clásico",
      time_slot: "Por favor, seleccione un horario para su instalación el",
      request_submitted: "Solicitud de Instalación Enviada",
      ticket_created: "Su ticket de servicio ha sido creado:",
      engineer_visit: "El ingeniero de servicio visitará su ubicación el",
      contact_engineer: "Contacte al ingeniero en:",
      feedback_request: "Nos gustaría pedir su opinión sobre instalaciones anteriores para ganar monedas de servicio. ¿Le gustaría proceder con el feedback?",
      yes_feedback: "Sí, proporcionar feedback",
      skip_feedback: "No, omitir feedback",
      feedback_submitted: "Feedback Enviado - ¡Gracias!",
      extra_coins: "¡Gracias por su detallado feedback! Ha ganado",
      extra_service_coins: "¡Monedas de Servicio extra!",
      total_coins: "Total de Monedas de Servicio Ganadas:",
      collect_coins: "¡Reúna 100 monedas para canjear por 3 rollos de papel gratis!",
      detailed_feedback: "Su feedback detallado:",
      anything_else: "¿Hay algo más en lo que pueda ayudarte?",
      share_experience: "Nos encantaría saber más sobre su experiencia en detalle.",
      share_comments: "¡Comparta sus comentarios para ganar 5 Monedas de Servicio extra!",
      additional_feedback: "Por favor, proporcione cualquier feedback o sugerencia adicional:",
      business: "Negocio:",
      address: "Dirección:",
      contact: "Contacto:",
      mobile: "Móvil:",
    }
  };

  // Get the translation for the key in the current language or default to English if not found
  const translatedText = translations[language]?.[key] || translations.english[key] || key;
  
  // Replace any parameters in the text
  let finalText = translatedText;
  Object.entries(params).forEach(([paramKey, paramValue]) => {
    finalText = finalText.replace(`{${paramKey}}`, paramValue);
  });
  
  return finalText;
}
