import crypto from 'crypto';

const MENU_URL = 'https://menu-js-service-962872886195.europe-west1.run.app/menu.js';

const DAYS_DE: Record<string, string> = {
    monday: 'Montag',
    tuesday: 'Dienstag',
    wednesday: 'Mittwoch',
    thursday: 'Donnerstag',
    friday: 'Freitag'
};

function getWeekDays() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);

    if (dayOfWeek === 0) {
        monday.setDate(now.getDate() + 1);
    } else {
        monday.setDate(now.getDate() - dayOfWeek + 1);
    }

    const days: Record<string, string> = {};
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    dayKeys.forEach((day, index) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + index);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        days[day] = `${DAYS_DE[day]} (${dateStr})`;
    });

    return days;
}

const PRICING: Record<string, any> = {
    starters: { prices: { S: 4.90, L: 6.90 }, weights: { S: 0 } },
    salad: { prices: { S: 7.50, L: 10.90 }, weights: { S: 0 } },
    meatMains: { prices: { S: 7.50, L: 11.90 }, weights: { S: 0 } },
    vegetarianMains: { prices: { S: 7.50, L: 11.90 }, weights: { S: 0 } },
    dessert: { prices: { S: 4.50 }, weights: { S: 0 } }
};

export async function getDynamicMenu(): Promise<any[]> {
    try {
        // next: { revalidate: 3600 } caches the result for 1 hour on the server
        const response = await fetch(MENU_URL, { next: { revalidate: 3600 } });
        if (!response.ok) {
            console.error(`Failed to fetch menu: ${response.statusText}`);
            return [];
        }
        const scriptText = await response.text();

        const extractMenu = new Function(`${scriptText}; return typeof weeklyMenu !== 'undefined' ? weeklyMenu : null;`);
        const weeklyMenu = extractMenu();

        if (!weeklyMenu) {
            console.error('Could not parse weeklyMenu from fetched script.');
            return [];
        }

        const weekDays = getWeekDays();
        const menuItems: any[] = [];

        const komboMocks = [
            {
                id: "kombo-light-" + crypto.randomUUID(),
                category: "Tageskarte",
                name: "Light Lunch Kombo",
                description: "Wähle eine Kombination & spare bis zu 25%!",
                tags: [],
                prices: { S: 9.50 },
                weights: { S: 700 },
                savings: "25%",
                komboOptions: [
                    { label: "Salat/Suppe klein + Main Dish klein" },
                    { label: "Main Dish klein + Dessert" }
                ]
            },
            {
                id: "kombo-big-" + crypto.randomUUID(),
                category: "Tageskarte",
                name: "Big Lunch Kombo",
                description: "Wähle eine Kombination & spare bis zu 20%!",
                tags: [],
                prices: { S: 13.90 },
                weights: { S: 900 },
                savings: "20%",
                komboOptions: [
                    { label: "Salat/Suppe klein + Main Dish groß" },
                    { label: "Main Dish groß + Dessert" }
                ]
            }
        ];

        menuItems.push(...komboMocks);

        // Parse the live days
        for (const [dayKey, dayData] of Object.entries(weeklyMenu)) {
            if (!weekDays[dayKey]) continue;

            const categoryName = weekDays[dayKey];
            const typedDayData = dayData as any;

            const processItem = (item: any, type: string) => {
                if (!item || !item.name || item.name.trim() === '') return;

                let actualType = type;
                if (type === 'starters' && item.name.toLowerCase().includes('salat')) {
                    actualType = 'salad';
                }

                const priceWeight = PRICING[actualType] || { prices: { S: 0 }, weights: { S: 0 } };

                menuItems.push({
                    id: `${dayKey}-${actualType}-${crypto.randomUUID()}`,
                    category: categoryName,
                    name: item.name.trim(),
                    description: item.description ? item.description.trim() : '',
                    tags: item.dietary || [],
                    prices: priceWeight.prices,
                    weights: priceWeight.weights,
                    savings: null
                });
            };

            const categoriesToProcess = ['starters', 'salad', 'meatMains', 'vegetarianMains', 'dessert'];

            categoriesToProcess.forEach(cat => {
                if (Array.isArray(typedDayData[cat])) {
                    typedDayData[cat].forEach((i: any) => processItem(i, cat));
                } else if (typedDayData[cat]) {
                    processItem(typedDayData[cat], cat);
                }
            });
        }

        return menuItems;
    } catch (error: any) {
        console.error('Error fetching dynamic menu:', error.message);
        return [];
    }
}
