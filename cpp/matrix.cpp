#include "matrix.h"

// ── Construction ─────────────────────────────────────────────────────────────

Matrix::Matrix(size_t rows, size_t cols, double init)
    : rows_(rows), cols_(cols), data_(rows * cols, init) {
    if (rows == 0 || cols == 0)
        throw std::invalid_argument("Matrix dimensions must be greater than zero.");
}

// ── Element access ────────────────────────────────────────────────────────────

double& Matrix::at(size_t row, size_t col) {
    if (row >= rows_ || col >= cols_)
        throw std::out_of_range("Matrix index out of range.");
    return data_[row * cols_ + col];
}

const double& Matrix::at(size_t row, size_t col) const {
    if (row >= rows_ || col >= cols_)
        throw std::out_of_range("Matrix index out of range.");
    return data_[row * cols_ + col];
}

// ── Arithmetic ────────────────────────────────────────────────────────────────

Matrix Matrix::operator+(const Matrix& other) const {
    if (rows_ != other.rows_ || cols_ != other.cols_)
        throw std::invalid_argument("Matrix dimensions must match for addition.");
    Matrix result(rows_, cols_);
    for (size_t i = 0; i < data_.size(); ++i)
        result.data_[i] = data_[i] + other.data_[i];
    return result;
}

Matrix Matrix::operator-(const Matrix& other) const {
    if (rows_ != other.rows_ || cols_ != other.cols_)
        throw std::invalid_argument("Matrix dimensions must match for subtraction.");
    Matrix result(rows_, cols_);
    for (size_t i = 0; i < data_.size(); ++i)
        result.data_[i] = data_[i] - other.data_[i];
    return result;
}

Matrix Matrix::operator*(const Matrix& other) const {
    if (cols_ != other.rows_)
        throw std::invalid_argument(
            "Inner matrix dimensions must agree for multiplication.");
    Matrix result(rows_, other.cols_);
    for (size_t i = 0; i < rows_; ++i)
        for (size_t k = 0; k < cols_; ++k)
            for (size_t j = 0; j < other.cols_; ++j)
                result.at(i, j) += at(i, k) * other.at(k, j);
    return result;
}

Matrix Matrix::operator*(double scalar) const {
    Matrix result(rows_, cols_);
    for (size_t i = 0; i < data_.size(); ++i)
        result.data_[i] = data_[i] * scalar;
    return result;
}

// ── Linear-algebra helpers ────────────────────────────────────────────────────

Matrix Matrix::transpose() const {
    Matrix result(cols_, rows_);
    for (size_t i = 0; i < rows_; ++i)
        for (size_t j = 0; j < cols_; ++j)
            result.at(j, i) = at(i, j);
    return result;
}

// ── Utility ───────────────────────────────────────────────────────────────────

void Matrix::print(std::ostream& out, int width) const {
    for (size_t i = 0; i < rows_; ++i) {
        out << "[ ";
        for (size_t j = 0; j < cols_; ++j)
            out << std::setw(width) << at(i, j) << " ";
        out << "]\n";
    }
}
