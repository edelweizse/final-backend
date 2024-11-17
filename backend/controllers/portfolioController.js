import { Portfolio } from "../db/models/portfolio.js";

export class PortfolioController {
  constructor() {
    this.getPortfolios = this.getPortfolios.bind(this);
    this.getPortfolio = this.getPortfolio.bind(this);
    this.getPortfolioByUserId = this.getPortfolioByUserId.bind(this);
    this.createPortfolio = this.createPortfolio.bind(this);
    this.updatePortfolio = this.updatePortfolio.bind(this);
    this.deletePortfolio = this.deletePortfolio.bind(this);
  }
  async getPortfolios(req, res) {
    try {
      const portfolios = await Portfolio.find();
      res.status(200).json({ portfolios });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  }

  async getPortfolio(req, res) {
    try {
      const { id } = req.params;
      const portfolio = await Portfolio.findById(id);
      if (!portfolio) {
        return res.status(404).json({ message: 'Portfolio not found' });
      }
      res.status(200).json({ portfolio });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  }

  async getPortfolioByUserId(req, res) {
    try {
      const { userId } = req.body;
      const portfolios = await Portfolio.find({ createdBy: userId });
      res.status(200).json({ portfolios });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  }

  async createPortfolio(req, res) {
    try {
      const { title, description, skills, github, linkedin } = req.body;
      if (!title || !description || !skills || !github || !linkedin) {
        return res.status(400).json({ message: 'Missing fields' });
      }
      
      const portfolio = await Portfolio.create({ title, description, images, skills, links:{github, linkedin}, createdBy: req.user._id });
      res.status(201).json({ portfolio });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  }

  async updatePortfolio(req, res) {
    try {
      const { id } = req.params;
      const { title, description, skills, github, linkedin } = req.body;

      const portfolio = await Portfolio.findById(id);
      if (!portfolio) {
        return res.status(404).json({ message: 'Portfolio not found' });
      }

      portfolio.title = title;
      portfolio.description = description;
      portfolio.skills = skills;
      portfolio.links.github = github;
      const deletedPortfolio = await Portfolio.findByIdAndDelete(id);
      
      if (!deletedPortfolio) {
        // If for some reason deletion fails, log the error
        console.error('Error deleting portfolio with ID:', id);
        return res.status(500).json({ message: 'Failed to delete portfolio' });
      }
     portfolio.links.linkedin = linkedin;

      await portfolio.save();
      res.status(200).json({ portfolio });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  }

  async deletePortfolio(req, res) {
    try {
      const { id } = req.params;

      // Validate if the id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid portfolio ID format' });
      }

      // Find the portfolio by ID
      const portfolio = await Portfolio.findById(id);
      
      // Check if the portfolio exists
      if (!portfolio) {
        return res.status(404).json({ message: 'Portfolio not found' });
      }

      // Delete the portfolio by ID
      const deletedPortfolio = await Portfolio.findByIdAndDelete(id);
      
      // If deletion fails
      if (!deletedPortfolio) {
        console.error('Failed to delete portfolio with ID:', id);
        return res.status(500).json({ message: 'Failed to delete portfolio' });
      }

      // Successful deletion
      res.status(200).json({ message: 'Portfolio deleted successfully' });
    } catch (err) {
      // Log the detailed error for debugging
      console.error('Error in deletePortfolio:', err);
      res.status(500).json({ message: `Internal server error: ${err.message}` });
    }
  }
  
}

export default PortfolioController;