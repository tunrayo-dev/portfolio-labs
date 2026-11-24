using System;
using System.Collections.Generic;
record Flashcard(string Question, string Answer);
class StudyCards {
    static void Main() {
        var cards = new List<Flashcard>();
        while (true) {
            Console.WriteLine("\nPortfolio Labs | Study Cards");
            Console.WriteLine("1 Add card  2 Review cards  3 Count cards  4 Exit");
            Console.Write("Choose: "); string? choice = Console.ReadLine();
            if (choice == "1") {
                Console.Write("Question: "); string question = Console.ReadLine() ?? "";
                Console.Write("Answer: "); string answer = Console.ReadLine() ?? "";
                if (string.IsNullOrWhiteSpace(question) || string.IsNullOrWhiteSpace(answer)) {
                    Console.WriteLine("Both fields are required."); continue;
                }
                cards.Add(new Flashcard(question.Trim(), answer.Trim()));
            } else if (choice == "2") {
                if (cards.Count == 0) { Console.WriteLine("Add a card first."); continue; }
                foreach (var card in cards) {
                    Console.WriteLine("\nQ: " + card.Question);
                    Console.Write("Press Enter to reveal the answer..."); Console.ReadLine();
                    Console.WriteLine("A: " + card.Answer);
                    Console.Write("Did you remember it? (y/n): ");
                    string? result = Console.ReadLine();
                    Console.WriteLine(result?.Trim().ToLower() == "y" ? "Good recall." : "Review this card again.");
                }
            } else if (choice == "3") Console.WriteLine($"You have {cards.Count} card(s).");
            else if (choice == "4") break;
            else Console.WriteLine("Choose 1, 2, 3 or 4.");
        }
    }
}