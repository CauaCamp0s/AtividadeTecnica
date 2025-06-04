const Product = require("../models/Product");
const Review = require("../models/Review");
const mongoose = require("mongoose");

// Criar um produto
exports.createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// get all produtos
exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit);
    const total = await Product.countDocuments();

    res.json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// Lista produto pelo id
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// upadate de produto
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res
        .status(404)
        .json({ message: "Produto não encontrado para atualizar" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// Deletar produto e suas av
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Produto não encontrado para deletar" });
    }
    await Review.deleteMany({ productId: req.params.id });
    res.json({
      message: "Produto e avaliações associadas deletados com sucesso",
    });
  } catch (error) {
    next(error);
  }
};

// Calcular media das av de um produto
exports.getAverageRating = async (req, res, next) => {
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

    const averageRating = result.length > 0 ? result[0].averageRating : 0;
    res.json({ averageRating });
  } catch (error) {
    next(error);
  }
};
