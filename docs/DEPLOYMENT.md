# استقرار رایگان خانه‌ی ما

## گزینه‌ی پیشنهادی برای شروع: Render Free

این پروژه یک سرویس Node.js با WebSocket است و فایل `render.yaml` برای استقرار آماده شده است.

1. یک مخزن **Private** در GitHub با نام `our-little-home` بسازید و فایل‌های این پروژه را push کنید.
2. در Render گزینه‌ی **New → Blueprint** را انتخاب کنید.
3. مخزن خصوصی را وصل کنید؛ Render فایل `render.yaml` را می‌خواند.
4. سرویس `our-little-home` را روی پلن `Free` بسازید.
5. پس از Deploy، آدرس `https://...onrender.com` را کپی کنید.
6. هر دو نفر همان آدرس را باز کنند. یک نفر «شروع زندگی → ساختن اتاق» و نفر دوم «پیوستن به اتاق» را انتخاب کند.

نکته‌های مهم پلن رایگان:

- سرویس اگر ۱۵ دقیقه هیچ درخواست HTTP یا پیام WebSocket ورودی نداشته باشد، متوقف می‌شود و بار اول بعدی حدود یک دقیقه زمان بیدار شدن می‌گیرد.
- هنگام بازی فعال، کلاینت بازی پیام‌های WebSocket می‌فرستد و اتصال زنده می‌ماند.
- فایل‌سیستم این نوع سرویس موقتی است؛ عکس‌های خاطره داخل `assets/memories` بسته‌بندی شده‌اند و از بین نمی‌روند، اما اتاق‌های فعالِ حافظه‌ای با restart سرور از بین می‌روند و باید اتاق تازه بسازید.
- این نسخه برای بازی دونفره‌ی کم‌ترافیک و آزمایشی مناسب است، نه ذخیره‌سازی دائمی تولیدی.

## گزینه‌ی پایدارتر: Oracle Cloud Always Free

اگر می‌خواهید سرویس مثل یک سرور روشن بماند، یک VM کوچک Arm در Oracle Cloud می‌تواند گزینه‌ی بعدی باشد. این روش به ساخت حساب، تأیید هویت/روش پرداخت، تنظیم firewall و اجرای دائمی Node با `systemd` یا Docker نیاز دارد.

طرح کلی روی Ubuntu/Arm:

```bash
git clone <private-repository-url>
cd our-little-home
npm install --omit=dev
PORT=5173 npm start
```

برای استفاده‌ی واقعی، یک reverse proxy مثل Caddy یا Nginx را روی پورت 443 قرار دهید تا HTTPS و WebSocket امن (`wss`) فعال باشد. دامنه‌ی شخصی نیز باید DNS خود را به IP ماشین اشاره دهد.

## Docker

`Dockerfile` و `.dockerignore` آماده‌اند:

```bash
docker build -t our-little-home .
docker run --rm -p 5173:5173 -e PORT=5173 our-little-home
```

## وضعیت دسترسی

از داخل این محیط، دسترسی احراز‌شده به GitHub، Render یا Oracle Cloud نداریم؛ بنابراین نمی‌توانم بدون اجازه‌ی حساب شما یک URL عمومی واقعی بسازم یا ادعا کنم که Deploy شده است. پس از اتصال حساب/مخزن، همین پروژه برای Deploy آماده است.

منبع محدودیت‌های Render Free: https://render.com/docs/free
منبع منابع Always Free اوراکل: https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm
