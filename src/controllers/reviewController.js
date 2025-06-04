const Review = require("../models/Review");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// Criar uma  av
exports.createReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId);
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// Lista av de um produto
exports.getReviewsByProduct = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
      return res.status(400).json({ message: "ID de produto inválido" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ productId: req.params.productId })
      .skip(skip)
      .limit(limit);
    const total = await Review.countDocuments({
      productId: req.params.productId,
    });

    res.json({
      reviews,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// Atualiza uma av
exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!review) {
      return res
        .status(404)
        .json({ message: "Avaliação não encontrada para atualizar" });
    }
    res.json(review);
  } catch (error) {
    next(error);
  }
};

// Delete uma av
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res
        .status(404)
        .json({ message: "Avaliação não encontrada para deletar" });
    }
    res.json({ message: "Avaliação deletada com sucesso" });
  } catch (error) {
    next(error);
  }
};
