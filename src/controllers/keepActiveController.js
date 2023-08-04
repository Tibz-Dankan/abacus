const keepActive = async (req, res) => {
  try {
    console.log(req.body);
    res.status(200).json({ status: "success", message: "Hi from Abacus Ug" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

module.exports = { keepActive };
