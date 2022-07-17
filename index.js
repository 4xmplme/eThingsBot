const { Telegraf, Markup } = require('telegraf')
const fs = require('fs')
require('dotenv').config()
const help = require('./const')
const toQRCode = require('./qrcode')
const Jimp = require('jimp')
const jsQR = require('jsqr')
const bot = new Telegraf(process.env.BOT_TOKKEN)

bot.start((ctx) => {
	ctx.reply(`Привіт, ${ctx.message.from.first_name ? ctx.message.from.first_name : 'незнайомцю'}!`,
		// Markup.keyboard(['QR-код', 'TikTok'], { columns: 2 }).resize())
		Markup.keyboard(['Генератор QR-кодів', 'Сканер QR-кодів'], { columns: 2 }).resize())
})

// bot.hears('QR-код', (ctx) => {
// 	ctx.reply('Генератор або Сканер?',
// 		Markup.keyboard([['Генератор QR-кодів', 'Сканер QR-кодів'], ['Назад']], { columns: 2 }).resize())

// 	bot.hears('Назад', (ctx) => {
// 		ctx.reply(`Привіт, ${ctx.message.from.first_name ? ctx.message.from.first_name : 'незнайомцю'}!`,
// 			Markup.keyboard(['QR-код', 'TikTok'], { columns: 2 }).resize())
// 	})
// })

bot.hears('Генератор QR-кодів', (ctx) => {
	ctx.reply('Введіть текст для генерації QR-коду',
		Markup.keyboard(['Назад']).resize())
	// Markup.removeKeyboard())

	bot.on('message', (ctx) => {
		toQRCode.renderToFile(ctx, async () => {
			await ctx.replyWithPhoto({ source: `qrcode for ${ctx.message.from.username}.png` })
			fs.rmSync(`qrcode for ${ctx.message.from.username}.png`)
		})
	})
})

bot.hears('Сканер QR-кодів', (ctx) => {
	ctx.reply('Відправте фото з QR-кодом для сканування',
		Markup.keyboard(['Назад']).resize())
	// Markup.removeKeyboard())

	bot.on('photo', onPhoto)
})

bot.hears('Назад', (ctx) => {
	ctx.reply('Генератор або Сканер?',
		Markup.keyboard(['Генератор QR-кодів', 'Сканер QR-кодів'], { columns: 2 }).resize())
})

async function tryParse(url) {
	console.log(url)

	const image = await Jimp.read(url)
	image.normalize()
	image.scale(2)
	const value = jsQR(image.bitmap.data, image.bitmap.width, image.bitmap.height)
	if (value) {
		return value.data || String.fromCharCode.apply(null, value.binaryData)
	}
}

async function onPhoto(ctx) {
	try {
		const photos = ctx.message.photo
		// console.log(photos)
		const photo = photos[photos.length - 1]
		const fileId = photo.file_id
		const url = await bot.telegram.getFileLink(fileId)
		const result = await tryParse(url)
		if (!result) {
			ctx.reply('No QR code found :(')
		} else {
			ctx.reply(result)
		}
	} catch (error) {
		ctx.reply('' + error)
	}
}

bot.help((ctx) => ctx.reply(help.commands))

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))