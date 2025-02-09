require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

const CHANNEL_ID = process.env.CHANNEL_ID // Thay bằng ID kênh muốn gửi thông báo

client.once('ready', () => {
  console.log(`Bot đã hoạt động với tên ${client.user.tag}`);
});

// Khi GitHub gửi webhook
app.post('/github-webhook', (req, res) => {
  const payload = req.body;
  if (payload.pusher) {
    const commitMessage = payload.head_commit.message;
    const commitAuthor = payload.head_commit.author.name;
    const commitUrl = payload.head_commit.url;
    
    const message = `🚀 **Commit mới!**\n📌 **Người commit**: ${commitAuthor}\n📝 **Message**: ${commitMessage}\n🔗 **Xem chi tiết**: [Click vào đây](${commitUrl})`;

    const channel = client.channels.cache.get(CHANNEL_ID);
    if (channel) {
      channel.send(message);
    }
  }
  res.sendStatus(200).send('✅ Webhook received successfully');
});

app.get('/', (req, res) => {
  res.send('Hello! GitHub Webhook Bot is running 🚀');
});

client.login(process.env.DISCORD_TOKEN);

// Chạy server trên cổng 3000
app.listen(3000, () => console.log('Server đang chạy trên cổng 3000'));
