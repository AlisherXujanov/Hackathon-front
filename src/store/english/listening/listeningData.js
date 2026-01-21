// Import book data
import cambridge19Data from './cambridge-19.json';
import cambridge19Answers from './cambridge-19-answers.json';
import a1Data from './a1.json';
import a2Data from './a2.json';
import b1Data from './b1.json';
import b2Data from './b2.json';
import c1Data from './c1.json';
import c2Data from './c2.json';

import a1DataAnswers from './a1-answers.json';
import a2DataAnswers from './a2-answers.json';
import b1DataAnswers from './b1-answers.json';
import b2DataAnswers from './b2-answers.json';
import c1DataAnswers from './c1-answers.json';
import c2DataAnswers from './c2-answers.json';

/**
 * Get listening book data by book ID
 * @param {string} bookId - The ID of the book to retrieve
 * @returns {object|null} The book data object or null if not found
 */
export async function getBookDataById(bookId) {
    // Map bookIds to their data
    const booksMap = {
        'cambridge-19': cambridge19Data,
        'a1': a1Data,
        'a2': a2Data,
        'b1': b1Data,
        'b2': b2Data,
        'c1': c1Data,
        'c2': c2Data,
    };
    
    return booksMap[bookId] || null;
}

/**
 * Get listening test answers by book ID
 * @param {string} bookId - The ID of the book to retrieve answers for
 * @returns {object|null} The book answers object or null if not found
 */
export async function getAnswersByBookId(bookId) {
    const answersMap = {
        'cambridge-19': cambridge19Answers,
        'a1': a1DataAnswers,
        'a2': a2DataAnswers,
        'b1': b1DataAnswers,
        'b2': b2DataAnswers,
        'c1': c1DataAnswers,
        'c2': c2DataAnswers,
    };
    
    return answersMap[bookId] || null;
}

/**
 * Get a list of all available listening books
 * @returns {Array} List of available book objects with id, title, and brief info
 */
export async function getAvailableBooks() {
    return [
        {
            id: 'cambridge-19',
            title: 'Cambridge IELTS 19',
            testCount: cambridge19Data.tests?.length || 0,
            en: 'Official Cambridge IELTS 19 Academic and General Training listening test materials with authentic exam questions and comprehensive practice scenarios.',
            ru: 'Официальные материалы Cambridge IELTS 19 для академического и общего обучения с аутентичными экзаменационными вопросами и комплексными практическими сценариями.',
            uz: 'Rasmiy Cambridge IELTS 19 akademik va umumiy tayyorgarlik tinglab tushunish test materiallari haqiqiy imtihon savollari va keng qamrovli amaliyot stsenariylari bilan.'
        },
        {
            id: 'a1',
            title: 'A1 Level Listening',
            testCount: a1Data?.length || 0,
            en: 'Beginner-level listening comprehension exercises designed to develop fundamental audio processing skills through structured multiple-choice and true/false assessments.',
            ru: 'Упражнения на понимание речи на слух для начинающих, разработанные для развития основных навыков обработки аудиоинформации через структурированные тесты с множественным выбором и вопросы "правда/ложь".',
            uz: 'Boshlang\'ich darajadagi tinglab tushunish mashqlari asosiy audio qayta ishlash ko\'nikmalarini rivojlantirish uchun mo\'ljallangan, tuzilgan ko\'p tanlovli va to\'g\'ri/noto\'g\'ri baholash usullari orqali.'
        },
        {
            id: 'a2',
            title: 'A2 Level Listening',
            testCount: a2Data?.length || 0,
            en: 'Elementary-level listening practice materials focusing on everyday conversations and basic informational content with interactive assessment formats.',
            ru: 'Материалы для практики понимания речи на слух элементарного уровня, сосредоточенные на повседневных разговорах и базовом информационном контенте с интерактивными форматами оценки.',
            uz: 'Boshlang\'ich darajadagi tinglab tushunish amaliyot materiallari kundalik suhbatlar va asosiy ma\'lumot mazmuniga qaratilgan, interfaol baholash formatlari bilan.'
        },
        {
            id: 'b1',
            title: 'B1 Level Listening',
            testCount: b1Data?.length || 0,
            en: 'Intermediate listening comprehension exercises featuring authentic dialogues and presentations to strengthen understanding of main ideas and supporting details.',
            ru: 'Упражнения на понимание речи на слух среднего уровня с аутентичными диалогами и презентациями для укрепления понимания основных идей и вспомогательных деталей.',
            uz: 'O\'rta darajadagi tinglab tushunish mashqlari asosiy g\'oyalar va qo\'shimcha tafsilotlarni tushunishni mustahkamlash uchun haqiqiy dialoglar va taqdimotlar bilan.'
        },
        {
            id: 'b2',
            title: 'B2 Level Listening',
            testCount: b2Data?.length || 0,
            en: 'Upper-intermediate listening materials with complex audio scenarios, academic lectures, and professional discussions to enhance critical listening skills.',
            ru: 'Материалы для понимания речи на слух продвинутого среднего уровня со сложными аудиосценариями, академическими лекциями и профессиональными дискуссиями для развития критических навыков слушания.',
            uz: 'Yuqori o\'rta darajadagi tinglab tushunish materiallari murakkab audio stsenariylari, akademik ma\'ruzalar va professional muhokamalar bilan tanqidiy tinglash ko\'nikmalarini rivojlantirish uchun.'
        },
        {
            id: 'c1',
            title: 'C1 Level Listening',
            testCount: c1Data?.length || 0,
            en: 'Advanced listening practice featuring sophisticated content including academic presentations, professional meetings, and nuanced conversational exchanges.',
            ru: 'Продвинутая практика понимания речи на слух с изысканным контентом, включающим академические презентации, профессиональные встречи и тонкие разговорные обмены.',
            uz: 'Rivojlangan tinglab tushunish amaliyoti akademik taqdimotlar, professional uchrashuvlar va nozik suhbat almashinuvlarini o\'z ichiga olgan murakkab mazmun bilan.'
        },
        {
            id: 'c2',
            title: 'C2 Level Listening',
            testCount: c2Data?.length || 0,
            en: 'Proficient-level listening comprehension materials with expert-level content, including specialized academic discourse and complex professional communications.',
            ru: 'Материалы для понимания речи на слух профессионального уровня с экспертным контентом, включая специализированный академический дискурс и сложные профессиональные коммуникации.',
            uz: 'Malakali darajadagi tinglab tushunish materiallari ekspert darajasidagi mazmun bilan, ixtisoslashgan akademik nutq va murakkab professional aloqalarni o\'z ichiga oladi.'
        },
    ];
}

/**
 * Get a specific test from a book
 * @param {string} bookId - The ID of the book
 * @param {number} testId - The ID of the test
 * @returns {object|null} The test data or null if not found
 */
export async function getTestById(bookId, testId) {
    const bookData = await getBookDataById(bookId);
    if (!bookData) return null;
    
    // Handle different data structures
    if (Array.isArray(bookData)) {
        // Difficulty books (a1-c2) are arrays of test objects
        return bookData.find(test => test.id === parseInt(testId, 10)) || null;
    } else {
        // Cambridge books have tests property
        return bookData.tests?.find(test => test.id === parseInt(testId, 10)) || null;
    }
} 