#include <iostream>
#include <iomanip>
#include <limits>
#include <string>
#include <vector>
struct Entry { std::string description, type; double amount; };
int main() {
    std::vector<Entry> entries;
    int choice = 0;
    std::cout << "Portfolio Labs | Expense Tracker\n";
    while (choice != 4) {
        std::cout << "\n1 Add income\n2 Add expense\n3 View summary\n4 Exit\nChoose: ";
        if (!(std::cin >> choice)) {
            std::cin.clear();
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
            std::cout << "Enter a menu number.\n"; continue;
        }
        if (choice == 1 || choice == 2) {
            Entry item; item.type = choice == 1 ? "Income" : "Expense";
            std::cout << "Description: ";
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
            std::getline(std::cin, item.description);
            std::cout << "Amount: ";
            if (!(std::cin >> item.amount) || item.amount <= 0) {
                std::cin.clear();
                std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
                std::cout << "Enter an amount greater than zero.\n"; continue;
            }
            entries.push_back(item);
        } else if (choice == 3) {
            double income = 0, expenses = 0;
            for (const auto& e : entries) {
                std::cout << e.type << " | " << e.description << " | "
                          << std::fixed << std::setprecision(2) << e.amount << '\n';
                if (e.type == "Income") income += e.amount; else expenses += e.amount;
            }
            std::cout << "Income: " << income << "\nExpenses: " << expenses
                      << "\nBalance: " << income - expenses << '\n';
        } else if (choice != 4) std::cout << "Choose 1, 2, 3 or 4.\n";
    }
    return 0;
}