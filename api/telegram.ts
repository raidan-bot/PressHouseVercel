import { VercelRequest, VercelResponse } from "@vercel/node";
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || "");
const ALLOWED_USER_ID = process.env.TELEGRAM_ALLOWED_USER_ID || "8368489420";
const ALLOWED_USERNAME = process.env.TELEGRAM_ALLOWED_USERNAME || "@Raidanye";

// Middleware to check if user is authorized
const isAuthorized = (ctx: any): boolean => {
  const userId = ctx.from?.id?.toString();
  const username = ctx.from?.username ? `@${ctx.from.username}` : "";
  
  return userId === ALLOWED_USER_ID || username === ALLOWED_USERNAME;
};

// Error handler
bot.catch((err: any, ctx: any) => {
  console.error("Telegram bot error:", err);
  ctx.reply("عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى.");
});

// Start command
bot.start((ctx) => {
  if (!isAuthorized(ctx)) {
    return ctx.reply("عذراً، ليس لديك صلاحية الوصول إلى هذا البوت.");
  }
  
  ctx.reply("مرحباً بك في بوت PressHouse Admin! ✅\n\n" +
    "الأوامر المتاحة:\n" +
    "/status - عرض حالة الموقع\n" +
    "/stats - عرض الإحصائيات\n" +
    "/help - عرض المساعدة");
});

// Status command
bot.command("status", async (ctx) => {
  if (!isAuthorized(ctx)) {
    return ctx.reply("عذراً، ليس لديك صلاحية الوصول إلى هذا البوت.");
  }
  
  try {
    const response = await fetch(`${process.env.VITE_API_URL}/api/health`);
    const data = await response.json();
    
    ctx.reply(`✅ حالة الموقع: ${data.status}\n` +
      `🕐 آخر تحديث: ${new Date(data.timestamp).toLocaleString("ar-SA")}`);
  } catch (error) {
    ctx.reply("❌ الموقع غير متاح حالياً");
  }
});

// Stats command
bot.command("stats", async (ctx) => {
  if (!isAuthorized(ctx)) {
    return ctx.reply("عذراً، ليس لديك صلاحية الوصول إلى هذا البوت.");
  }
  
  ctx.reply("📊 الإحصائيات:\n" +
    "- المقالات: قيد التطوير\n" +
    "- المستخدمين: قيد التطوير\n" +
    "- الزيارات: قيد التطوير");
});

// Help command
bot.command("help", (ctx) => {
  if (!isAuthorized(ctx)) {
    return ctx.reply("عذراً، ليس لديك صلاحية الوصول إلى هذا البوت.");
  }
  
  ctx.reply("📋 المساعدة:\n\n" +
    "/start - بدء البوت\n" +
    "/status - حالة الموقع\n" +
    "/stats - الإحصائيات\n" +
    "/help - المساعدة");
});

// Handle webhook updates
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "POST") {
      await bot.handleUpdate(req.body);
      res.status(200).json({ ok: true });
    } else {
      res.status(200).json({ status: "Telegram bot webhook is active" });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
