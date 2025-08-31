import express from 'express';
import cors from 'cors';

const app = express();
const port = 4002;

app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ success: true, message: 'Test server is working' });
});

// Mock stock endpoint
app.get('/api/product/stock/low', (req, res) => {
    const { threshold = 5 } = req.query;
    res.json({
        success: true,
        data: [
            {
                _id: 'test-product-1',
                name: 'Test Product',
                category: 'Test Category',
                lowStockVariants: [
                    {
                        color: 'Black',
                        stock: 3,
                        price: 1000
                    }
                ]
            }
        ],
        threshold: parseInt(threshold)
    });
});

app.listen(port, () => {
    console.log(`Test server running on port ${port}`);
    console.log(`Test endpoint: http://localhost:${port}/test`);
    console.log(`Stock endpoint: http://localhost:${port}/api/product/stock/low?threshold=5`);
});

