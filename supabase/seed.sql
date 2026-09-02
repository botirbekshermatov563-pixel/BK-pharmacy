-- ==============================================================================
-- BK PHARMACY SEED DATA
-- Starter categories, products, and site settings
-- ==============================================================================

-- 1. CATEGORIES
INSERT INTO public.categories (slug, name_ru, name_uz, icon) VALUES
('all', 'Все препараты', 'Barcha preparatlar', 'layout-grid'),
('vitamins_minerals', 'Витамины и минералы', 'Vitaminlar va minerallar', 'sparkles'),
('immunity_energy', 'Иммунитет и энергия', 'Immunitet va quvvat', 'shield-plus'),
('sleep_stress', 'Сон и антистресс', 'Uyqu va antistress', 'moon'),
('joints_muscles', 'Суставы и мышцы', 'Bo''g''imlar va mushaklar', 'activity'),
('gastro_digestion', 'Пищеварение и ЖКТ', 'Oshqozon va ovqat hazm qilish', 'apple'),
('women_health', 'Здоровье женщин и мам', 'Ayollar va onalar salomatligi', 'heart'),
('kids_health', 'Для детей', 'Bolalar uchun', 'baby'),
('veins_vessels', 'Вены и сосуды', 'Venalar va qon tomirlari', 'heart-pulse')
ON CONFLICT (slug) DO NOTHING;

-- 2. SITE SETTINGS (Director, Contacts, Hero texts)
INSERT INTO public.site_settings (key, value, description) VALUES
('contacts', '{
  "director_name": "Шерматов Ботир Бахтиярович",
  "director_title_ru": "Генеральный директор аптечной сети BK Pharmacy",
  "director_title_uz": "BK Pharmacy dorixonalar tarmog''i bosh direktori",
  "phone": "+998 97 490 46 65",
  "phone_clean": "+998974904665",
  "telegram": "Botirbek_Baxtiyarovich",
  "telegram_url": "https://t.me/Botirbek_Baxtiyarovich",
  "email": "info@bk-pharmacy.uz",
  "address_ru": "г. Ташкент, Мирзо-Улугбекский р-н, ул. Зиёлилар, 4",
  "address_uz": "Toshkent sh., Mirzo Ulug''bek tumani, Ziyolilar ko''chasi, 4",
  "working_hours_ru": "Пн - Вс: 08:00 - 22:00 (Без выходных)",
  "working_hours_uz": "Dush - Yak: 08:00 - 22:00 (Dam olish kunlarisiz)",
  "license_info_ru": "Лицензия на фармацевтическую деятельность № ФД-89412 от МЗ РУз",
  "license_info_uz": "O''zR SSV tomonidan berilgan farmatsevtik faoliyat litsenziyasi № FD-89412"
}'::jsonb, 'Контактные данные и информация о директоре'),

('hero_content', '{
  "badge_ru": "Сертифицированная аптечная сеть • Европейские стандарты GMP",
  "badge_uz": "Sertifikatlangan dorixonalar tarmog''i • Yevropa GMP standartlari",
  "title_ru": "Ваше здоровье — наша главная ценность",
  "title_uz": "Sog''ligingiz — bizning oliy qadriyatimiz",
  "subtitle_ru": "Официальный каталог оригинальных безрецептурных препаратов, витаминных комплексов и лечебных средств с гарантией подлинности и быстрой доставкой.",
  "subtitle_uz": "Haqiqiy retseptsiz dori vositalari, vitamin majmualari va shifobaxsh vositalarning kafolatlangan va tez yetkazib beriluvchi rasmiy katalogi.",
  "delivery_badge_ru": "Быстрая доставка по Ташкенту и всему Узбекистану",
  "delivery_badge_uz": "Toshkent va butun O''zbekiston bo''ylab tezkor yetkazib berish"
}'::jsonb, 'Тексты и баннеры главного экрана')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 3. STARTER PRODUCTS
INSERT INTO public.products (
  category_id, name_ru, name_uz, form_ru, form_uz, dosage_ru, dosage_uz,
  price, old_price, image_url, description_ru, description_uz,
  composition_ru, composition_uz, usage_ru, usage_uz,
  rating, reviews_count, in_stock, badge_type, badge_ru, badge_uz
) VALUES
-- 1. КОЛЕДАН капли
('vitamins_minerals', 'КОЛЕДАН капли', 'KOLEDAN tomchilari', 'Капли для приема внутрь', 'Ichish uchun tomchilar', 'Флакон 20 мл', 'Flakon 20 ml',
54000, 62000, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
'Высококачественный витамин D3 в биодоступной мицеллярной форме для укрепления иммунитета, костей и зубов.',
'Immunitet, suyak va tishlarni mustahkamlash uchun biofaol D3 vitamini tomchilari.',
'1 мл раствора содержит: холекальциферол (витамин D3) 15 000 МЕ.',
'1 ml eritma tarkibida: xolekalsiferol (D3 vitamini) 15 000 XB.',
'Детям с первых дней жизни и взрослым по 1-2 капли в день во время еды.',
'Yangi tug''ilgan chaqaloqlar va kattalarga kuniga 1-2 tomchidan ovqat bilan birga.',
4.9, 178, true, 'bestseller', 'Хит продаж', 'Hit sotuv'),

-- 2. КОЛЕДАН капсулы
('vitamins_minerals', 'КОЛЕДАН капсулы', 'KOLEDAN kapsulalari', 'Мягкие желатиновые капсулы', 'Yumshoq jelatin kapsulalar', '30 капсул', '30 kapsula',
68000, 78000, 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80',
'Витамин D3 в дозировке 5000 МЕ для восполнения дефицита солнечного витамина, поддержки тонуса и плотности костной ткани.',
'Quyosh vitamini tanqisligini to''ldirish, tetiklik va suyak zichligini oshirish uchun 5000 XB D3 vitamini.',
'Каждая капсула содержит: холекальциферол (витамин D3) 5000 МЕ.',
'Har bir kapsula tarkibida: xolekalsiferol (D3 vitamini) 5000 XB.',
'Взрослым по 1 капсуле в день или по рекомендации специалиста.',
'Kattalarga kuniga 1 kapsuladan yoki mutaxassis tavsiyasiga ko''ra.',
4.9, 134, true, 'bestseller', 'Выбор врачей', 'Shifokorlar tanlovi'),

-- 3. ЙОДОФОЛ
('women_health', 'ЙОДОФОЛ', 'YODOFOL', 'Таблетки', 'Tabletkalar', '30 таблеток', '30 tabletka',
46000, 52000, 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&auto=format&fit=crop&q=80',
'Сбалансированная комбинация фолиевой кислоты и йода для планирования беременности, поддержки будущей мамы и плода.',
'Homiladorlikni rejalashtirish, bo''lajak ona va homila salomatligi uchun foliy kislotasi va yodning mukammal balansi.',
'Фолиевая кислота (витамин B9) — 400 мкг, йод (калия йодид) — 200 мкг.',
'Foliy kislotasi (B9 vitamini) — 400 mkg, yod (kaliy yodid) — 200 mkg.',
'По 1 таблетке в день во время или после еды, запивая водой.',
'Kuniga 1 tabletkadan ovqat paytida yoki undan keyin suv bilan ichiladi.',
5.0, 312, true, 'premium', 'Для будущих мам', 'Bo''lajak onalar uchun'),

-- 4. ЭМФЕТАЛ
('women_health', 'ЭМФЕТАЛ', 'EMFETAL', 'Таблетки покрытые оболочкой', 'Qobiq bilan qoplangan tabletkalar', '60 таблеток', '60 tabletka',
125000, 142000, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80',
'Премиальный мультивитаминный и минеральный комплекс для беременных и кормящих женщин европейского качества.',
'Homilador va emizikli ayollar uchun Yevropa sifatidagi premium multivitamin va mineral majmuasi.',
'12 витаминов и 9 минералов: фолиевая кислота, железо, кальций, йод, цинк, витамины группы B, C, D3, E.',
'12 ta vitamin va 9 ta mineral: foliy kislotasi, temir, kalsiy, yod, rux, B guruhi, C, D3, E vitaminlari.',
'По 1 таблетке 2 раза в день во время еды.',
'Kuniga 2 marta 1 tabletkadan ovqatlanish vaqtida.',
4.9, 215, true, 'premium', 'Премиум комплекс', 'Premium majmua'),

-- 5. ПОЛИЖЕН
('immunity_energy', 'ПОЛИЖЕН', 'POLIJEN', 'Желатиновые капсулы', 'Jelatin kapsulalar', '30 капсул', '30 kapsula',
148000, 165000, 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=600&auto=format&fit=crop&q=80',
'Элитный антиоксидантный комплекс с женьшенем, маточным молочком, пыльцой и коэнзимом Q10 для максимальной энергии и молодости.',
'Jenshen, ona ari suti, gulchang va koenzim Q10 bilan maksimal energiya va yoshlikni saqlovchi elita majmuasi.',
'Экстракт женьшеня 40 мг, маточное молочко 10 мг, цветочная пыльца 50 мг, масло зародышей пшеницы 50 мг, коэнзим Q10, 12 витаминов, 10 минералов.',
'Jenshen ekstrakti 40 mg, ona ari suti 10 mg, gulchang 50 mg, bug''doy murtagi moyi 50 mg, koenzim Q10, 12 vitamin, 10 mineral.',
'Взрослым по 1 капсуле в день утром во время завтрака.',
'Kattalarga kuniga 1 kapsuladan ertalab nonushta paytida.',
5.0, 420, true, 'bestseller', 'Энергия и молодость', 'Energiya va yoshlik'),

-- 6. РЕЙТОИЛ
('immunity_energy', 'РЕЙТОИЛ', 'REYTOIL', 'Мягкие желатиновые капсулы', 'Yumshoq jelatin kapsulalar', '30 капсул', '30 kapsula',
98000, 112000, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
'Натуральный концентрат Омега-3 полиненасыщенных жирных кислот и витамина Е для здоровья сердца, сосудов, кожи и сияния волос.',
'Yurak, qon tomirlari, teri va sochlar yorqinligi uchun tabiiy Omega-3 yog'' kislotalari va E vitamini konsentrati.',
'Рыбий жир глубоководных морских рыб 1000 мг (ЭПК 180 мг, ДГК 120 мг), витамин Е 12 мг.',
'Chuqur dengiz baliqlari moyi 1000 mg (EPK 180 mg, DGK 120 mg), E vitamini 12 mg.',
'По 1 капсуле 1-2 раза в день во время приема пищи.',
'Kuniga 1-2 marta 1 kapsuladan ovqat paytida.',
4.8, 160, true, 'natural', '100% Омега-3', '100% Omega-3'),

-- 7. ВАМЕЛАН
('sleep_stress', 'ВАМЕЛАН', 'VAMELAN', 'Мягкие капсулы', 'Yumshoq kapsulalar', '30 капсул', '30 kapsula',
92000, 105000, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
'Растительный фитокомплекс тройного действия: валериана, мята и мелисса для естественного снятия стресса и глубокого сна.',
'Tabiiy fitomajmua: valeriana, yalpiz va melissa stressni kamaytirish va mustahkam chuqur uyquni ta''minlaydi.',
'Экстракт валерианы 125 мг, экстракт мяты перечной 25 мг, экстракт мелиссы 25 мг.',
'Valeriana quruq ekstrakti 125 mg, qalampir yalpiz ekstrakti 25 mg, melissa ekstrakti 25 mg.',
'При стрессе: 1-2 капсулы 2-3 раза в день; для сна: 1-2 капсулы за 1 час до сна.',
'Stressda: kuniga 2-3 marta 1-2 kapsuladan; uyqu uchun: uyqudan 1 soat oldin 1-2 kapsula.',
4.9, 290, true, 'natural', '100% Травы', '100% Tabiiy o''tlar'),

-- 8. ВАМЕЛАН КИДС
('kids_health', 'ВАМЕЛАН КИДС', 'VAMELAN KIDS', 'Сироп', 'Sirop', 'Флакон 150 мл', 'Flakon 150 ml',
76000, 86000, 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&auto=format&fit=crop&q=80',
'Мягкий успокаивающий растительный сироп для детей с экстрактами мелиссы, липы и пассифлоры. Помогает при капризах и гиперактивности.',
'Bolalar uchun melissa, jo''ka va passiflora ekstraktlariga asoslangan yumshoq tinchlantiruvchi sirop.',
'Экстракты пассифлоры, цветков липы, листьев мелиссы, ромашки аптечной.',
'Passiflora, jo''ka gullari, melissa barglari, moychechak ekstraktlari.',
'Детям от 3 лет по 5 мл 1-2 раза в день после еды.',
'3 yoshdan oshgan bolalarga kuniga 1-2 marta 5 ml dan ovqatdan so''ng.',
4.8, 95, true, 'kids', 'Для детского спокойствия', 'Bolalar xotirjamligi'),

-- 9. ПРОТЕКТА
('joints_muscles', 'ПРОТЕКТА', 'PROTEKTA', 'Шипучие таблетки', 'Eruvchan shiddatli tabletkalar', '20 шипучих таблеток', '20 eruvchan tabletka',
115000, 130000, 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&auto=format&fit=crop&q=80',
'Инновационный хондропротектор в форме вкусных шипучих таблеток с глюкозамином, хондроитином и кальцием для гибкости суставов.',
'Bo''g''imlar elastikligi va tog''ay to''qimasini tiklash uchun glyukozamin, xondroitin va kalsiyli eruvchan tabletkalar.',
'Глюкозамина сульфат 750 мг, хондроитина сульфат 600 мг, кальций 500 мг, витамин D3 400 МЕ.',
'Glyukozamin sulfat 750 mg, xondroitin sulfat 600 mg, kalsiy 500 mg, D3 vitamini 400 XB.',
'По 1 шипучей таблетке в день, растворив в стакане воды.',
'Kuniga 1 eruvchan tabletkadan 1 stakan suvda eritib ichiladi.',
4.9, 185, true, 'bestseller', 'Здоровые суставы', 'Sog''lom bo''g''imlar'),

-- 10. ПРОТЕКТА ЭДВАНС
('joints_muscles', 'ПРОТЕКТА ЭДВАНС', 'PROTEKTA EDVANS', 'Таблетки', 'Tabletkalar', '60 таблеток', '60 tabletka',
145000, 160000, 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&auto=format&fit=crop&q=80',
'Усиленная формула с коллагеном II типа, MSM и гиалуроновой кислотой для максимальной защиты хрящевой ткани и связок.',
'II turdagi kollagen, MSM va gialuron kislotali kuchaytirilgan bo''g''im himoyasi formulasi.',
'Глюкозамин 1500 мг, хондроитин 1200 мг, МСМ 500 мг, коллаген II типа 40 мг, гиалуроновая кислота.',
'Glyukozamin 1500 mg, xondroitin 1200 mg, MSM 500 mg, II turdagi kollagen 40 mg, gialuron kislotasi.',
'По 1 таблетке 2 раза в день во время еды. Курс 2-3 месяца.',
'Kuniga 2 marta 1 tabletkadan ovqat bilan birga. Kurs 2-3 oy.',
5.0, 110, true, 'premium', 'Усиленная формула', 'Kuchaytirilgan formula'),

-- 11. САНОВИТ
('kids_health', 'САНОВИТ', 'SANOVIT', 'Сироп', 'Sirop', 'Флакон 100 мл', 'Flakon 100 ml',
52000, 59000, 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=80',
'Сбалансированный поливитаминный сироп с приятным фруктовым вкусом для активного роста, крепкого иммунитета и аппетита детей.',
'Bolalarning sog''lom o''sishi, baquvvat immunitet va ishtaha uchun ajoyib mevali polivitamin siropi.',
'Витамины A, D3, B1, B2, B6, B12, C, никотинамид, декспантенол, кальций.',
'A, D3, B1, B2, B6, B12, C vitaminlari, nikotinamid, dekspantenol, kalsiy.',
'Детям от 1 года до 5 лет — по 5 мл в день; школьникам — по 10 мл в день.',
'1 yoshdan 5 yoshgacha bolalarga kuniga 5 ml dan; maktab yoshidagilarga — kuniga 10 ml dan.',
4.9, 340, true, 'bestseller', 'Любимый вкус детей', 'Bolalar sevimli ta''mi'),

-- 12. АРТРОКОЛ гель
('joints_muscles', 'АРТРОКОЛ гель', 'ARTROKOL gel', 'Гель для наружного применения', 'Tashqi qo''llash uchun gel', 'Туба 45 г', 'Tuba 45 g',
48000, 55000, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
'Охлаждающий и быстродействующий обезболивающий гель с кетопрофеном и лавандовым маслом при болях в суставах, мышцах и спине.',
'Bo''g''im, mushak va bel og''rig''ida ketoprofen va lavanda moyi bilan tezkor yengillik beruvchi sovutuvchi gel.',
'1 г геля содержит: кетопрофен 25 мг, лавандовое масло, очищенная вода.',
'1 g gel tarkibida: ketoprofen 25 mg, lavanda moyi, tozalangan suv.',
'Наносить тонким слоем на болезненную зону 2-3 раза в день легкими массирующими движениями.',
'Kuniga 2-3 marta og''riqli sohaga yupqa qilib surtib, yengil massaj qilinadi.',
4.9, 142, true, 'bestseller', 'Быстрое действие', 'Tezkor ta''sir'),

-- 13. ВЕНОДИОЛ-УЛЬТРА гель
('veins_vessels', 'ВЕНОДИОЛ-УЛЬТРА гель', 'VENODIOL-ULTRA gel', 'Гель для ног', 'Oyoqlar uchun gel', 'Туба 100 г', 'Tuba 100 g',
62000, 71000, 'https://images.unsplash.com/photo-1556228722-d0b5f1589480?w=600&auto=format&fit=crop&q=80',
'Венотонизирующий освежающий гель с экстрактом конского каштана, ментолом и троксерутином. Снимает тяжесть и отеки в ногах.',
'Ot kashtani, mentol va trokserutinli venatonik gel. Oyoqdagi og''irlik va shishlarni bir zumda bartaraf etadi.',
'Троксерутин, экстракт семян конского каштана, ментол, экстракт гинкго билоба.',
'Trokserutin, ot kashtani urug''i ekstrakti, mentol, ginkgo biloba ekstrakti.',
'Наносить снизу вверх от стопы к бедру 2 раза в день мягкими движениями.',
'Oyoq panjasidan yuqoriga qarab kuniga 2 marta mayin massaj bilan surtiladi.',
4.8, 118, true, 'natural', 'Легкость в ногах', 'Oyoqlarda yengillik'),

-- 14. ГРИПОФФ
('immunity_energy', 'ГРИПОФФ', 'GRIPOFF', 'Порошок в саше', 'Sashe kukunlari', '10 саше', '10 sashe',
38000, 44000, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
'Комплексное средство для быстрого снятия симптомов простуды, жара, заложенности носа и головной боли с приятным лимонным вкусом.',
'Shamollash, isitma, burun bitishi va bosh og''rig''i alomatlarini tezda bartaraf etuvchi limonli sashe.',
'Парацетамол 500 мг, фенилэфрин 10 мг, фенирамин 20 мг, витамин C 50 мг.',
'Paratsetamol 500 mg, fenilefrin 10 mg, feniramin 20 mg, C vitamini 50 mg.',
'Растворить 1 пакетик в стакане горячей воды, принимать каждые 6-8 часов.',
'1 paketchaning tarkibini 1 stakan issiq suvda eritib, har 6-8 soatda ichiladi.',
4.8, 260, true, 'bestseller', 'Экспресс-помощь', 'Ekspress yordam'),

-- 15. ЛАЦИДОФОРТЕ
('gastro_digestion', 'ЛАЦИДОФОРТЕ', 'LATSIDOFORTE', 'Капсулы', 'Kapsulalar', '20 капсул', '20 kapsula',
72000, 82000, 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&auto=format&fit=crop&q=80',
'Синбиотик нового поколения: 4 млрд живых полезных лакто- и бифидобактерий с пребиотиком для здоровой микрофлоры кишечника.',
'Yangi avlod sinbiotigi: ichak sog''lom mikroflorasini tiklash uchun 4 mlrd foydali bakteriyalar va prebiotik.',
'Lactobacillus rhamnosus, Bifidobacterium longum, олигофруктоза 100 мг.',
'Lactobacillus rhamnosus, Bifidobacterium longum, oligofruktoza 100 mg.',
'По 1-2 капсулы в день во время еды. При приеме антибиотиков — через 2 часа после них.',
'Kuniga 1-2 kapsuladan ovqat paytida. Antibiotik qabulidan 2 soat o''tib ichiladi.',
4.9, 195, true, 'bestseller', 'Здоровый кишечник', 'Sog''lom ichak'),

-- 16. СИМАЛЬГЕЛЬ
('gastro_digestion', 'СИМАЛЬГЕЛЬ', 'SIMALGEL', 'Суспензия в саше', 'Sashe suspenziyasi', '20 саше по 15 мл', '20 sashe 15 ml dan',
65000, 75000, 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80',
'Быстродействующий антацид с симетиконом против изжоги, боли в желудке, кислой отрыжки и вздутия.',
'Jig'ildon qaynashi, oshqozon og'rig'i va dam bo'lishiga qarshi tez ta'sir qiluvchi antatsid suspenziya.',
'Алюминия гидроксид, магния гидроксид, симетикон.',
'Alyuminiy gidroksid, magniy gidroksid, simetikon.',
'По 1 пакетику через 1 час после еды и перед сном.',
'Kuniga 1 paketchaning ichidagisi ovqatdan 1 soat keyin va uyqudan oldin qabul qilinadi.',
4.9, 140, true, 'bestseller', 'От изжоги за 2 мин', 'Jig''ildon qaynashiga qarshi');
