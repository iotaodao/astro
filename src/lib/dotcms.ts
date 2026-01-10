// src/lib/dotcms.ts

// Функция для получения переменных окружения (безопасная)
const getEnv = (key: string): string | undefined => {
  // @ts-ignore
  const runtimeValue = typeof process !== 'undefined' ? process.env[key] : undefined;
  const buildTimeValue = import.meta.env[key];
  return runtimeValue || buildTimeValue;
};

const authToken = getEnv('PUBLIC_DOTCMS_AUTH_TOKEN');
const dotcmsHost = getEnv('PUBLIC_DOTCMS_HOST');

// Простая проверка конфигурации
if (!authToken) throw new Error('CRITICAL: PUBLIC_DOTCMS_AUTH_TOKEN is missing');
if (!dotcmsHost) throw new Error('CRITICAL: PUBLIC_DOTCMS_HOST is missing');

// Определяем базовый URL (для Docker или браузера)
const baseUrl = typeof window === 'undefined' ? 'http://dotcms:8080' : dotcmsHost;

// НАШ СОБСТВЕННЫЙ МИНИ-КЛИЕНТ (Direct Fetch)
export const dotcmsClient = {
  page: {
    get: async ({ path, depth = 2 }: { path: string, depth?: number }) => {
      
      // 1. Формируем правильный URL для API
      // Убираем слэш в начале, если он есть, так как API может капризничать
      const cleanPath = path.startsWith('/') ? path.slice(1) : path;
      
      // Если путь пустой, значит это главная ('index')
      const finalPath = cleanPath === '' ? 'index' : cleanPath;

      const apiUrl = `${baseUrl}/api/v1/page/json/${finalPath}?depth=${depth}`;

      console.log(`[DirectFetch] Запрос: ${apiUrl}`);

      // 2. Делаем прямой запрос
      const res = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store' 
      });

      if (!res.ok) {
        // Важно: не выбрасываем ошибку сразу, а даем понять роутеру, что страницы нет
        if (res.status === 404) {
           throw new Error('Not Found');
        }
        console.error(`[DirectFetch] Ошибка API ${res.status}: ${res.statusText}`);
        throw new Error(`DotCMS API Error: ${res.status}`);
      }

      // 3. Получаем данные
      const json = await res.json();
      return json.entity; 
    }
  }
};

/**
 * НОВАЯ ФУНКЦИЯ: Обертка для Роутера
 * Именно её не хватало в src/pages/[...slug].astro
 */
export const getPage = async (path: string) => {
  return await dotcmsClient.page.get({ path });
};
