const QRCode = require('qrcode')
// const Jimp = require('jimp')
// const jsQR = require('jsqr')

async function renderToFile(ctx, cb) {
	try {
		await QRCode.toFile(`./qrcode for ${ctx.message.from.username}.png`, ctx.message.text)
		cb()
	} catch (err) {
		throw err
	}
}

// async function tryParse(url) {
// 	console.log(url)

// 	const image = await Jimp.read(url)
// 	image.normalize()
// 	image.scale(2)
// 	const value = jsQR(image.bitmap.data, image.bitmap.width, image.bitmap.height)
// 	if (value) {
// 		return value.data || String.fromCharCode.apply(null, value.binaryData)
// 	}
// }

// async function onPhoto(ctx) {
// 	try {
// 		const photos = ctx.message.photo
// 		console.log(photos)
// 		const photo = photos[photos.length - 1]
// 		const fileId = photo.file_id
// 		const url = await bot.telegram.getFileLink(fileId)
// 		const result = await tryParse(url)
// 		if (!result) {
// 			ctx.reply('No QR code found :(')
// 		} else {
// 			ctx.reply(result)
// 		}
// 	} catch (error) {
// 		ctx.reply('' + error)
// 	}
// }


module.exports.renderToFile = renderToFile
// module.exports.onPhoto = onPhoto