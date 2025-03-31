const express = require("express");
const app = express();

// Middleware để đọc JSON từ request
app.use(express.json());

// Kiểm tra server chạy đúng không
app.get('/', (req, res) => {
    res.send('🚀 Server đang chạy!');
});

// Webhook xử lý Dialogflow
app.post('/webhook', async (req, res) => {
    console.log("📩 Nhận request từ Dialogflow:", req.body);

    const intentName = req.body.queryResult?.intent?.displayName;
    const carBrand = req.body.queryResult?.parameters?.car_brand;

    if (intentName === "ask_car_brand") {
        const carList = {
            "Toyota": ["Camry", "Corolla", "Fortuner", "Vios"],
            "Honda": ["City", "Civic", "CR-V", "Accord"],
            "Mazda": ["Mazda2", "Mazda3", "CX-5", "CX-8"],
            "Kia": ["Morning", "Seltos", "K3", "Sorento"],
            "Hyundai": ["Grand i10", "Accent", "Tucson", "SantaFe"]
        };

        const models = carList[carBrand] || ["Không tìm thấy xe cho hãng này"];

        console.log(`✅ Trả về danh sách xe của hãng: ${carBrand}`);

        return res.json({
            fulfillmentText: `📌 Dưới đây là danh sách xe của hãng ${carBrand}: ${models.join(", ")}\nBạn muốn biết giá của mẫu xe nào?`
        });
    }

    console.log("⚠️ Intent không xác định hoặc không có dữ liệu phù hợp.");
    return res.json({ fulfillmentText: "Xin lỗi, tôi chưa có thông tin về hãng xe này." });
});

// Middleware xử lý lỗi 404
app.use((req, res) => {
    res.status(404).send("⛔ Không tìm thấy đường dẫn này!");
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server chạy tại: http://localhost:${PORT}`);
});
