const express = require("express");
const app = express();

// Middleware đọc JSON từ request
app.use(express.json());

// Kiểm tra server có chạy đúng không
app.get('/', (req, res) => {
    res.send('🚀 Server đang chạy!');
});

// Webhook xử lý Dialogflow
app.post('/webhook', async (req, res) => {
    console.log("📩 Nhận request từ Dialogflow:", JSON.stringify(req.body, null, 2));

    // Kiểm tra dữ liệu có đúng không
    if (!req.body || !req.body.queryResult) {
        console.error("❌ Request không hợp lệ!");
        return res.status(400).json({ fulfillmentText: "Lỗi: Request không hợp lệ!" });
    }

    const intentName = req.body.queryResult.intent?.displayName;
    const carBrand = req.body.queryResult.parameters?.car_brand;

    console.log(`👉 Intent nhận được: ${intentName}`);
    console.log(`👉 Hãng xe nhận được: ${carBrand}`);

    if (intentName === "ask_car_brand") {
        const carList = {
            "Toyota": ["Camry", "Corolla", "Fortuner", "Vios"],
            "Honda": ["City", "Civic", "CR-V", "Accord"],
            "Mazda": ["Mazda2", "Mazda3", "CX-5", "CX-8"],
            "Kia": ["Morning", "Seltos", "K3", "Sorento"],
            "Hyundai": ["Grand i10", "Accent", "Tucson", "SantaFe"]
        };

        const models = carList[carBrand] || ["Không tìm thấy xe cho hãng này"];
        console.log(`✅ Trả về danh sách xe của hãng ${carBrand}: ${models.join(", ")}`);

        return res.json({
            fulfillmentText: `📌 Danh sách xe ${carBrand}: ${models.join(", ")}\nBạn muốn biết giá xe nào?`
        });
    }

    console.log("⚠️ Intent không khớp hoặc không có dữ liệu phù hợp.");
    return res.json({ fulfillmentText: "Xin lỗi, tôi chưa có thông tin về hãng xe này." });
});

// Middleware xử lý lỗi 404
app.use((req, res) => {
    console.error(`⛔ Đường dẫn không hợp lệ: ${req.originalUrl}`);
    res.status(404).send("⛔ Không tìm thấy đường dẫn này!");
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server đang chạy tại: http://0.0.0.0:${PORT}`);
});
