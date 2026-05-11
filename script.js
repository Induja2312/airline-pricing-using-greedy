function addFareClass() {
    const container = document.getElementById('fareClassesContainer');
    const div = document.createElement('div');
    div.className = 'fare-class-input';
    div.innerHTML = `
        <input type="number" placeholder="Price ($)" min="0">
        <input type="number" placeholder="Max Seats" min="0">
        <button class="remove-btn" onclick="removeFareClass(this)">×</button>
    `;
    container.appendChild(div);
}

function removeFareClass(btn) {
    const container = document.getElementById('fareClassesContainer');
    if (container.children.length > 1) {
        btn.parentElement.remove();
    }
}

function calculate() {
    const totalSeats = parseInt(document.getElementById('totalSeats').value);
    const fareInputs = document.querySelectorAll('.fare-class-input');
    
    const fareClasses = [];
    fareInputs.forEach((input, idx) => {
        const price = parseInt(input.children[0].value) || 0;
        const maxSeats = parseInt(input.children[1].value) || 0;
        if (price > 0 && maxSeats > 0) {
            fareClasses.push({ price, maxSeats, id: idx + 1 });
        }
    });

    if (fareClasses.length === 0 || totalSeats <= 0) {
        alert('Please enter valid inputs');
        return;
    }

    const result = fractionalKnapsack(fareClasses, totalSeats);
    displayResults(result, totalSeats);
}

function fractionalKnapsack(fareClasses, totalSeats) {
    const sorted = [...fareClasses].sort((a, b) => b.price - a.price);
    
    let seatsLeft = totalSeats;
    let totalRevenue = 0;
    const allocation = [];
    const steps = [];

    steps.push({
        type: 'sort',
        message: 'Step 1: Sort fare classes by price (Greedy Choice - Highest price first)',
        data: sorted.map(f => `$${f.price}/seat (max ${f.maxSeats} seats)`)
    });

    sorted.forEach((fare, idx) => {
        if (seatsLeft === 0) return;

        const seatsSold = Math.min(fare.maxSeats, seatsLeft);
        const revenue = seatsSold * fare.price;
        
        totalRevenue += revenue;
        seatsLeft -= seatsSold;
        
        allocation.push({
            price: fare.price,
            seatsSold,
            revenue,
            percentage: (seatsSold / totalSeats) * 100
        });

        steps.push({
            type: 'allocation',
            step: idx + 2,
            message: `Step ${idx + 2}: Allocate ${seatsSold} seats at $${fare.price}/seat`,
            detail: `Revenue: $${revenue.toLocaleString()} | Remaining seats: ${seatsLeft}`
        });
    });

    return { allocation, totalRevenue, seatsLeft, steps };
}

function displayResults(result, totalSeats) {
    document.getElementById('results').classList.remove('hidden');
    
    const stepsDiv = document.getElementById('steps');
    stepsDiv.innerHTML = '';
    
    result.steps.forEach(step => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step';
        
        if (step.type === 'sort') {
            stepDiv.innerHTML = `
                <div class="step-header">${step.message}</div>
                ${step.data.map(d => `<div class="step-detail">→ ${d}</div>`).join('')}
            `;
        } else {
            stepDiv.innerHTML = `
                <div class="step-header">${step.message}</div>
                <div class="step-detail">${step.detail}</div>
            `;
        }
        
        stepsDiv.appendChild(stepDiv);
    });

    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];
    const seatChart = document.getElementById('seatChart');
    seatChart.innerHTML = '';
    
    result.allocation.forEach((alloc, idx) => {
        const barDiv = document.createElement('div');
        barDiv.className = 'bar-row';
        barDiv.innerHTML = `
            <span class="seat-label" style="color: ${colors[idx % colors.length]}">$${alloc.price}/seat</span>
            <div class="seat-bar">
                <div class="seat-fill" style="width: ${alloc.percentage}%; background: ${colors[idx % colors.length]}"></div>
            </div>
            <span class="seat-value">${alloc.seatsSold} seats → $${alloc.revenue.toLocaleString()}</span>
        `;
        seatChart.appendChild(barDiv);
    });

    const summaryDiv = document.getElementById('summaryContent');
    summaryDiv.innerHTML = `
        <div class="summary-item">
            <span class="summary-label">Total Seats:</span>
            <span class="summary-value">${totalSeats}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Seats Allocated:</span>
            <span class="summary-value">${totalSeats - result.seatsLeft}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Remaining Seats:</span>
            <span class="summary-value">${result.seatsLeft}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Total Revenue:</span>
            <span class="summary-value total-revenue">$${result.totalRevenue.toLocaleString()}</span>
        </div>
    `;

    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}
