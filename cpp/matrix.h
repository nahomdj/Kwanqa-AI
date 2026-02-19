#pragma once

#include <vector>
#include <stdexcept>
#include <iostream>
#include <iomanip>

// A simple 2-D matrix class with common linear-algebra operations.
class Matrix {
public:
    Matrix(size_t rows, size_t cols, double init = 0.0);

    // Element access
    double&       at(size_t row, size_t col);
    const double& at(size_t row, size_t col) const;

    size_t rows() const { return rows_; }
    size_t cols() const { return cols_; }

    // Arithmetic
    Matrix operator+(const Matrix& other) const;
    Matrix operator-(const Matrix& other) const;
    Matrix operator*(const Matrix& other) const;  // matrix multiplication
    Matrix operator*(double scalar) const;         // scalar multiplication

    // Linear-algebra helpers
    Matrix transpose() const;

    // Utility
    void print(std::ostream& out = std::cout, int width = 8) const;

private:
    size_t rows_;
    size_t cols_;
    std::vector<double> data_;  // row-major storage
};
