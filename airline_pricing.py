# ============================================================
# Greedy Method - Airline Ticket Pricing
# ============================================================
# Greedy Method: At each step, pick the best available option
# (highest price first) to maximize total revenue.
# It never goes back to reconsider earlier choices.
# ============================================================

def greedy_airline_pricing(fare_classes, total_seats):
    """
    fare_classes: list of (price, max_seats) tuples
    total_seats: total aircraft capacity
    """
    # Step 1: Sort fare classes from highest to lowest price (greedy choice)
    sorted_fares = sorted(fare_classes, key=lambda x: x[0], reverse=True)

    total_revenue = 0
    seats_left = total_seats
    allocation = []

    # Step 2: Print the sorted fare order
    print("Sorted Fare Order (Highest to Lowest):")
    for price, max_seats in sorted_fares:
        print(f"  ${price}/seat  (max {max_seats} seats)")
    print()

    # Step 3: Allocate seats greedily — fill highest price first
    for price, max_seats in sorted_fares:
        if seats_left == 0:
            break
        seats_sold = min(seats_left, max_seats)   # don't exceed available seats
        revenue = seats_sold * price
        total_revenue += revenue
        seats_left -= seats_sold
        allocation.append((price, seats_sold, revenue))

    return total_revenue, allocation, seats_left


# ── Driver Code ──────────────────────────────────────────────

# Define fare classes: (price per seat, max seats available)
fare_classes = [
    (850, 30),   # Business Class
    (180, 50),   # Economy
    (520, 50),   # Premium Economy
    (320, 70),   # Economy Plus
]

total_seats = 200   # total aircraft capacity

# Run the greedy algorithm
revenue, plan, remaining = greedy_airline_pricing(fare_classes, total_seats)

# Print results
print(f"Max Revenue: ${revenue:,}")
for price, seats, rev in plan:
    print(f"  ${price}/seat × {seats} seats = ${rev:,}")

print(f"\nRemaining seats after allocation: {remaining}")
