#include <iostream>
#include "matrix.h"

int main() {
    std::cout << "=== Kwanqa-AI C++ Matrix Utility Demo ===\n\n";

    // 2×3 matrix A
    Matrix A(2, 3);
    A.at(0, 0) = 1;  A.at(0, 1) = 2;  A.at(0, 2) = 3;
    A.at(1, 0) = 4;  A.at(1, 1) = 5;  A.at(1, 2) = 6;

    std::cout << "Matrix A (2x3):\n";
    A.print();

    // 3×2 matrix B
    Matrix B(3, 2);
    B.at(0, 0) = 7;  B.at(0, 1) = 8;
    B.at(1, 0) = 9;  B.at(1, 1) = 10;
    B.at(2, 0) = 11; B.at(2, 1) = 12;

    std::cout << "\nMatrix B (3x2):\n";
    B.print();

    // Matrix multiplication: A * B  → (2×2)
    Matrix C = A * B;
    std::cout << "\nA * B (2x2):\n";
    C.print();

    // Transpose of A  → (3×2)
    Matrix At = A.transpose();
    std::cout << "\nTranspose of A (3x2):\n";
    At.print();

    // Scalar multiplication
    Matrix D = A * 2.0;
    std::cout << "\nA * 2 (2x3):\n";
    D.print();

    // Element-wise addition
    Matrix E = A + A;
    std::cout << "\nA + A (2x3):\n";
    E.print();

    return 0;
}
