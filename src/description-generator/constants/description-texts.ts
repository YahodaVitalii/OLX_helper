export const DESCRIPTION_TEXTS = {
  greeting: 'Доброго дня!\n',

  sellIntro: (brand: string, subBrand: string | null, model: string) =>
    `Продається ноутбук ${brand} ${subBrand ?? ''} ${model}.`.trim(),

  characteristicsHeader: 'Характеристики:',

  processor: (cpu: string) => `- Процесор: ${cpu}`,
  ram: (ram: number) => `- Оперативна пам’ять: ${ram} GB`,
  storage: (storage: string) => `- Накопичувач: ${storage}`,
  gpu: (gpu: string) => `- Відеокарта: ${gpu}`,

  screen: (screen: string) => `- Екран: ${screen}`,

  battery: {
    absent: '- Батарея: Немає батареї',
    notWorking: '- Батарея: Не працює',
    working: (wear: number | null | undefined) =>
      wear != null ? `- Знос батареї: (знос ${wear}%)` : '- Батарея: Працює',
  },

  accessories: (value: string) => `- Комплектація: ${value}`,
  featuresHeader: '\nОсобливості:',
  disadvantagesHeader: '\nНедоліки:',
};
