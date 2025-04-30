import express from 'express';
import User from '../model/userModel.js';

const router = express.Router();

// add stock for a user
router.post('/add', async (req,res)=>{
    try {
        const {userId, units} = req.body;
        if(!userId || !units) {
            return res.status(400).json({message: 'User ID and units are required'});
        }
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        user.stocks.push({
            units: units,
        });

        user.totalUnits = user.stocks.reduce((acc, stock) => acc + stock.units, 0);
        await user.save();
        res.status(201).json({message: "Stock added successfully", stocks: user.stocks});
    } catch (error) {
        console.error("Error adding stock", error);
        res.status(500).json({message: "Internal server error"})
    }
});

// get all stocks for a user
router.get('/user/:userId', async (req,res)=>{
    try {
        const {userId} = req.params;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        // Fetch total units here as well
        const totalUnits = user.stocks.reduce((acc, stock) => acc + stock.units, 0);
        res.status(200).json(user.stocks)
    } catch (error) {
        console.error("Error fetching stocks:", error);
        res.status(500).json({message: "Internal server error"});
    }
});

// approve a stock (change status from processing to approved)
router.put('/approve/:userId/:stockId', async(req,res)=>{
    try {
        const {userId, stockId} = req.params;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const stock = user.stocks.id(stockId);

        if(!stock){
            return res.status(404).json({message: "Stocks not found"});
        }

        stock.status = "Approved";

        await user.save();

        res.status(200).json({message: "Stock approved successfully", stock});
    } catch (error) {
        console.error("Error approving stock:", error);
        res.status(500).json({message: "Internal server error"});
    }
});

// delete a stock from a user
router.delete('/delete/:userId/:stockId', async (req, res)=>{
    try {
        const {userId, stockId} = req.params;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const stock = user.stocks.id(stockId);

        if(!stock){
            return res.status(404).json({message: "Stock not found"});
        }
        
        stock.remove();

        // Recalculate total units after deletion
        user.totalUnits = user.stocks.reduce((acc, stock) => acc + stock.units, 0);
        await user.save();

        res.status(200).json({message: "Stock deleted successfully"});
    } catch (error) {
        console.error("Error deleting stock:", error);
        res.status(500).json({message: "Internal server error"});
    }
});

// Get all stocks for all users (new endpoint)
router.get('/all', async (req, res) => {
    try {
      const users = await User.find({});
  
      if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }
    //   console.log(`User: ${user.firstName} ${user.lastName}, Total Units: ${totalUnits}`);
  
      // Collecting all stocks from all users
      const allStocks = users.flatMap((user) => user.stocks.map((stock) => ({
        userId: user._id,
        userFirstName: user.firstName,
        userLastName: user.lastName,
        stockId: stock._id,
        units: stock.units,
        status: stock.status,
    })));

    res.status(200).json(allStocks); // Return all stocks from all users // Return users with total units
    } catch (error) {
      console.error("Error fetching all stocks:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });


export default router;