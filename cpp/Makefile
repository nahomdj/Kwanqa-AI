CXX      := g++
CXXFLAGS := -std=c++17 -Wall -Wextra -O2
TARGET   := matrix_demo
SRCS     := main.cpp matrix.cpp

.PHONY: all clean

all: $(TARGET)

$(TARGET): $(SRCS)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(SRCS)

clean:
	rm -f $(TARGET)
