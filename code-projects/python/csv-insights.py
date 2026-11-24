"""CSV Insights: a small standard-library CSV summary tool.

Run: python csv-insights.py path/to/records.csv
Expected columns: category, amount (other columns are allowed).
"""
import csv
import sys
from collections import defaultdict
from decimal import Decimal, InvalidOperation
from pathlib import Path

def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python csv-insights.py path/to/records.csv")
        return 2
    path = Path(sys.argv[1])
    if not path.is_file():
        print(f"File not found: {path}")
        return 1

    totals: dict[str, Decimal] = defaultdict(Decimal)
    count = 0
    skipped = 0
    try:
        with path.open("r", newline="", encoding="utf-8-sig") as handle:
            reader = csv.DictReader(handle)
            if not reader.fieldnames or not {"category", "amount"}.issubset(
                {name.strip().lower() for name in reader.fieldnames}
            ):
                print("CSV needs columns named category and amount.")
                return 1
            for row in reader:
                normalized = {str(k).strip().lower(): (v or "").strip()
                              for k, v in row.items() if k is not None}
                try:
                    amount = Decimal(normalized.get("amount", ""))
                    if not amount.is_finite():
                        raise InvalidOperation
                except (InvalidOperation, ValueError):
                    skipped += 1
                    continue
                category = normalized.get("category") or "Uncategorised"
                totals[category] += amount
                count += 1
    except (OSError, UnicodeError, csv.Error) as error:
        print(f"Could not read CSV: {error}")
        return 1

    print(f"Valid records: {count} | Skipped rows: {skipped}")
    print("\nTotals by category")
    for category, total in sorted(totals.items(), key=lambda item: item[1], reverse=True):
        print(f"{category:24} {total:,.2f}")
    print(f"\nOverall total: {sum(totals.values(), Decimal('0')):,.2f}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
