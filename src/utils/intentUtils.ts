import { ChatType } from "../types";

export const getIntentName = (type: ChatType['type']): string => {
    const intentMap = {
        'elderly_care_services': 'Hitta äldreomsorg',
        'apply_chat': 'Att söka äldreomsorg',
        'general_chat': 'Hitta kontaktinformation',
        'general_questions': 'Allmäna frågor'
    };
    return intentMap[type] || 'Tillbaka';
}; 