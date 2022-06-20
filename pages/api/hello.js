
/**
 * @swagger
 * /api/hello:
 *   get:
 *     tags:
 *       - default
 *     summary: Returns the hello world
 *     description: Returns the hello world, you don't need to pass any parameters and body.
 *     responses:
 *       200:
 *         description: hello world
 */

export default function handler(req, res) {
  res.status(200).json({ name: 'Hello World!' })
}
