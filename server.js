const express=require('express');
const app=express();
const port=process.env.PORT || 3000;

app.use(express.json());

let storedData={
    secretKey: null,
    numbers:[]
};

app.post('/upload-data', (req, res) => {
    const { secretKey, numbers } = req.body;

    if(!secretKey || !Array.isArray(numbers)){
        return res.status(400).json({ success: false, message : "invalid Input" });
    }

    storedData.secretKey=secretKey;
    storedData.numbers=numbers;

    return res.status(200).json({ success: true, message : "Data uploaded successfully" });
});

app.post('/get-data', (req , res) => {
    const { secretKey } = req.body;

    if(secretKey !== storedData.secretKey){
        return res.status(403).json({ success: false, message : "Unauthorised: Invalid secret key" });
    }

    const nums= storedData.numbers;
    if(nums.length === 0){
        return res.status(404).json({ success: false, message : "No data found" });
    }

    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const sum = nums.reduce((a, b) => a + b, 0);
    const avg = sum / nums.length;
    const median = nums.length % 2 === 0 ? (nums[nums.length / 2 - 1] + nums[nums.length / 2]) / 2 : nums[nums.length / 2];
    const count = nums.length;

    res.json(
        {
            success: true,
            message: "Data fetched successfully",
            data: {
                min,
                max,
                sum,
                avg,
                median,
                count
            }
        }
    )

});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});