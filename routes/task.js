const router = require("express").Router();
const authMiddleware = require("../middleware/auth");
const Task = require("../models/task");
const User = require("../models/user");

router.post("/addtasks", authMiddleware, async (req, res) => {
    try {
        const { title, projectName, description } = req.body;
        const { id } = req.headers;
        const newTasks = new Task({ title, projectName, description });
        const savedtasks = await newTasks.save();
        const taskId = savedtasks._id;
        await User.findByIdAndUpdate(id, { $push: { tasks: taskId._id } });
        return res.status(200).json({
            message: "Task added successfully!",
            type: "success",
            task: savedtasks,
        });
    } catch (error) {
        console.log("Login error:", error);
        res.status(400).json({ message: "Internal server error", type: "error" });
    }
});
router.get("/getalltasks", authMiddleware, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findOne({ _id: id }).populate({
            path: "tasks",
            options: { sort: { createdat: -1 } },
        });
        res.status(200).json({ data: userData });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal server error", type: "error" });
    }
});
router.delete("/tasksdelete/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers.id;
        await Task.findByIdAndDelete(id);
        await User.findByIdAndUpdate(userId, { $pull: { tasks: id } })
        res
            .status(200)
            .json({ message: "Task deleted Successfully!", type: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal server error", type: "error" });
    }
});

router.put("/tasks_update/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, projectName, description } = req.body;
        await Task.findByIdAndUpdate(id, { title, projectName, description })
        res
            .status(200)
            .json({ message: "Task updated Successfully!", type: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal server error", type: "error" });
    }
});
router.put("/tasks_update_imp/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const TaskData = await Task.findById(id);
        const Imp = TaskData.important;
        await Task.findByIdAndUpdate(id, { important: !Imp })
        res
            .status(200)
            .json({ message: "Task updated Successfully!", type: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal server error", type: "error" });
    }
});
router.put("/tasks_update_complete/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const TaskData = await Task.findById(id);
        const Comtasks = TaskData.complete;
        await Task.findByIdAndUpdate(id, { complete: !Comtasks })
        res
            .status(200)
            .json({ message: "Task updated Successfully!", type: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal server error", type: "error" });
    }
});
router.get("/getimportnettasks", authMiddleware, async (req, res) => {
    try {
        const { id } = req.headers;
        const Data = await User.findOne({ _id: id }).populate({
            path: "tasks",
            match:{important:true},
            options: { sort: { createdat: -1 } },
        });
        const ImpTaskData = Data.tasks;
        res.status(200).json({ data: ImpTaskData });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal server error", type: "error" });
    }
});
router.get("/getcompletetasks", authMiddleware, async (req, res) => {
    try {
        const { id } = req.headers;
        const Data = await User.findOne({ _id: id }).populate({
            path: "tasks",
            match: { complete:true},
            options: { sort: { createdat: -1 } },
        });
        const ComTaskData = Data.tasks;
        res.status(200).json({ data: ComTaskData });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal server error", type: "error" });
    }
});
router.get("/getincompletetasks", authMiddleware, async (req, res) => {
    try {
        const { id } = req.headers;
        const Data = await User.findOne({ _id: id }).populate({
            path: "tasks",
            match: { complete:false},
            options: { sort: { createdat: -1 } },
        });
        const ComTaskData = Data.tasks;
        res.status(200).json({ data: ComTaskData });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal server error", type: "error" });
    }
});

module.exports = router;
