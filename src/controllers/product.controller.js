import { prisma } from '../config/db.js'
import { productSchema } from '../schemas/product.schema.js'
import { cloudinary } from '../config/cloudinary.js'


export const createProduct = async (c) => {
  const userId = c.get('userId')
  const formData = await c.req.formData()
  const imageFile = formData.get('image')
  const values = Object.fromEntries(formData.entries())


  const data = productSchema.parse({
    label: values.label,
    price: parseFloat(values.price),
    quantity: parseInt(values.quantity, 10),
  })


  let imageUrl = ''
  if (imageFile) {
    const arrayBuffer = await imageFile.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const uploadRes = await cloudinary.uploader.upload(
      `data:${imageFile.type};base64,${base64}`,
      { folder: 'products' },
    )
    imageUrl = uploadRes.secure_url
  }


  const product = await prisma.product.create({
    data: { ...data, imageUrl, ownerId: userId },
  })
  return c.json(product, 201)
}


export const getProducts = async (c) => {
  const userId = c.get('userId')
  const products = await prisma.product.findMany({ where: { ownerId: userId } })
  return c.json(products)
}


export const getProduct = async (c) => {
  const userId = c.get('userId')
  const id = Number(c.req.param('id'))
  const product = await prisma.product.findFirst({ where: { id, ownerId: userId } })
  if (!product) return c.json({ message: 'Not found' }, 404)
  return c.json(product)
}


export const updateProduct = async (c) => {
  const userId = c.get('userId')
  const id = Number(c.req.param('id'))
  const formData = await c.req.formData()
  const imageFile = formData.get('image')
  const values = Object.fromEntries(formData.entries())


  const payload = {}
  if (values.label) payload.label = values.label
  if (values.price) payload.price = parseFloat(values.price)
  if (values.quantity) payload.quantity = parseInt(values.quantity, 10)


  if (imageFile) {
    const arrayBuffer = await imageFile.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const uploadRes = await cloudinary.uploader.upload(
      `data:${imageFile.type};base64,${base64}`,
      { folder: 'products' },
    )
    payload.imageUrl = uploadRes.secure_url
  }


  const result = await prisma.product.updateMany({ where: { id, ownerId: userId }, data: payload })
  if (!result.count) return c.json({ message: 'Not found' }, 404)
  return c.json({ message: 'Updated' })
}


export const deleteProduct = async (c) => {
  const userId = c.get('userId')
  const id = Number(c.req.param('id'))
  const result = await prisma.product.deleteMany({ where: { id, ownerId: userId } })
  if (!result.count) return c.json({ message: 'Not found' }, 404)
  return c.json({ message: 'Deleted' })
}


