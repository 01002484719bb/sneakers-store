const NAMES = ["أحمد محمد", "سارة علي", "محمود حسن", "منى إبراهيم", "كريم عادل", "هبة سمير"];
const CITIES = ["الإسماعيلية", "القاهرة", "الجيزة", "الإسكندرية", "بورسعيد", "السويس"];
const STATUSES = ["new", "shipped", "delivered"];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function makeDemoOrders(products) {
  if (!products.length) return [];

  const orders = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    date.setHours(9 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60));

    const items = Array.from({ length: 1 + Math.floor(Math.random() * 2) }, () => {
      const p = pick(products);
      const color = p.colors[0];
      const size = pick(p.sizes);
      return {
        key: `${p.id}-${size}-${color.name}`,
        id: p.id,
        name: p.name,
        brand: p.brand,
        image: p.image,
        price: p.price,
        size,
        color,
        qty: 1 + Math.floor(Math.random() * 2),
      };
    });

    return {
      id: `ORD-${400000 + i * 13}`,
      date: date.toISOString(),
      customer: {
        name: pick(NAMES),
        phone: `010${Math.floor(10000000 + Math.random() * 89999999)}`,
        city: pick(CITIES),
      },
      items,
      total: items.reduce((s, it) => s + it.price * it.qty, 0),
      status: pick(STATUSES),
    };
  });

  return orders.sort((a, b) => new Date(b.date) - new Date(a.date));
}