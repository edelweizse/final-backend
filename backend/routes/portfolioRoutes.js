import express from 'express';
import PortfolioController from '../controllers/portfolioController.js';
import { protect, role } from '../middlewares/authMiddleware.js';

const router = express.Router();
const portfolioController = new PortfolioController();

const isAdminOrOwner = async (req, res, next) => {
  try {
    const portfolio = await portfolioController.getPortfolioById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    if (req.user.role === 'admin' || portfolio.userId.toString() === req.user._id.toString()) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied: Not authorized to modify this portfolio' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @openapi
 * /portfolio:
 *   post:
 *     summary: Create a new portfolio
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the portfolio
 *               description:
 *                 type: string
 *                 description: A brief description of the portfolio
 *               userId:
 *                 type: string
 *                 description: The user who owns the portfolio
 *     responses:
 *       201:
 *         description: Successfully created a portfolio
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "Portfolio created successfully",
 *                 "portfolio": {
 *                   "name": "Tech Portfolio",
 *                   "description": "A collection of my tech projects",
 *                   "userId": "user123",
 *                   "createdAt": "2024-11-17T12:00:00Z"
 *                 }
 *               }
 *       400:
 *         description: Bad request due to missing required fields
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.post('/', protect, portfolioController.createPortfolio);

/**
 * @openapi
 * /portfolio/{id}:
 *   get:
 *     summary: Get a portfolio by its ID
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the portfolio
 *     responses:
 *       200:
 *         description: Successfully retrieved portfolio
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       404:
 *         description: Portfolio not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', protect, portfolioController.getPortfolio);

/**
 * @openapi
 * /portfolio/user/{userId}:
 *   get:
 *     summary: Get portfolios of a specific user
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID to filter portfolios
 *     responses:
 *       200:
 *         description: Successfully retrieved portfolios
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/user/:userId', protect, portfolioController.getPortfolioByUserId);

/**
 * @openapi
 * /portfolio:
 *   get:
 *     summary: Retrieve all portfolios for the authenticated user
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of portfolios
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/', protect, portfolioController.getPortfolios);

/**
 * @openapi
 * /portfolio/{id}:
 *   put:
 *     summary: Update an existing portfolio (Admin or Owner only)
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Portfolio ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Portfolio updated successfully
 *       400:
 *         description: Invalid or missing data
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Access denied - Not admin or portfolio owner
 *       404:
 *         description: Portfolio not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', protect, isAdminOrOwner, portfolioController.updatePortfolio);

/**
 * @openapi
 * /portfolio/{id}:
 *   delete:
 *     summary: Delete a portfolio by ID (Admin or Owner only)
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the portfolio to delete
 *     responses:
 *       200:
 *         description: Portfolio deleted successfully
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Access denied - Not admin or portfolio owner
 *       404:
 *         description: Portfolio not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', protect, isAdminOrOwner, portfolioController.deletePortfolio);

export default router;