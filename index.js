const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

client.on('guildMemberAdd', async (member) => {
  const channel = member.guild.systemChannel; // 기본 환영 채널 사용
  if (!channel) return;

  const canvas = createCanvas(800, 300);
  const ctx = canvas.getContext('2d');

  // 💗 핑크 그라데이션 배경
  const gradient = ctx.createLinearGradient(0, 0, 800, 0);
  gradient.addColorStop(0, "#ff69b4");
  gradient.addColorStop(1, "#ffb6c1");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 프로필 이미지 불러오기
  const avatar = await loadImage(
    member.user.displayAvatarURL({ extension: 'png', size: 256 })
  );

  // 원형 프로필
  ctx.beginPath();
  ctx.arc(150, 150, 80, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, 70, 70, 160, 160);

  // 텍스트 설정
  ctx.font = 'bold 40px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${member.user.username}님 안환영합니다🎉앙응디섹스기분좋다`, 280, 130);

  ctx.font = '28px sans-serif';
  ctx.fillText(`태그: ${member.user.tag}`, 280, 180);

  ctx.fillText(`현재 인원: ${member.guild.memberCount}명`, 280, 220);

  const attachment = new AttachmentBuilder(canvas.toBuffer(), {
    name: 'welcome.png'
  });

  channel.send({ files: [attachment] });
});

client.login(process.env.TOKEN);
