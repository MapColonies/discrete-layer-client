import { MessageFormatElement } from 'intl-messageformat-parser';

import messages_en from './en.json';
import messages_he from './he.json';
const MESSAGES: { [key: string]: Record<string, string> | Record<string, MessageFormatElement[]> } = {
    he: messages_he,
    en: messages_en
};

export default MESSAGES;
