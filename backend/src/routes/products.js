const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Review = require("../models/Review");
const mongoose = require("mongoose");

// criar novo produto
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// lista todos os produtos
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// lista produto pelo id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update em um produto
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado para atualizar" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete produto
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado para deletar" });
    }
    await Review.deleteMany({ productId: req.params.id });
    res.json({ message: "Produto e avaliações associadas deletados com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fazer a média das Av de um produto
router.get("/:id/average-rating", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID de produto inválido" });
    }

    const result = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $group: {
          _id: null, 
          averageRating: { $avg: "$rating" }, 
        },
      },
    ]);
    if (result.length === 0) {
      return res.json({ averageRating: 0 });
    }

    // media calculada
    res.json({ averageRating: result[0].averageRating });
  } catch (error) {
    console.error("Erro ao calcular média das avaliações:", error);
    res.status(500).json({ message: "Erro interno do servidor ao calcular média" });
  }
});

module.exports = router;
