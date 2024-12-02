// Bar chart
new Chart(document.getElementById("bar-chart"), {
    type: 'bar',
    data: {
        labels: ["Classic", "Roasted", "Spicy"],
        datasets: [
            {
                label: "Chicken Flavor",
                backgroundColor: ["#008000", "#ffff00", "#ff0000"],
                data: [2478, 5267, 734]
            }
        ]
    },
    options: {
        responsive: true, // Enable responsiveness
        maintainAspectRatio: false, // Allow chart to adjust its height
        legend: { display: false },
        title: {
            display: true,
            text: 'Predicted World Population (millions) in 2050'
        }
    }
});

// Import dependencies if needed (for frameworks like Node.js or front-end bundlers)

// Fetch inventory data and update the product list
async function syncInventory() {
    try {
        // Fetch the inventory data from the API
        const response = await fetch('/inventory'); // Adjust endpoint if necessary
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const inventory = await response.json();

        // Update the quantities in the product list
        inventory.forEach(item => {
            // Find the corresponding row for the product
            const productRow = document.querySelector(
                `.card.product-list table tr:has(th:contains("${item.productName}"))`
            );

            if (productRow) {
                // Update the quantity in the second <td>
                const quantityCell = productRow.querySelector('td:nth-child(2)');
                if (quantityCell) {
                    quantityCell.textContent = item.quantity;
                }

                // Update the status color based on quantity
                const statusCell = productRow.querySelector('td:nth-child(3) .status');
                if (statusCell) {
                    if (item.quantity > 50) {
                        statusCell.className = 'status green';
                    } else if (item.quantity > 20) {
                        statusCell.className = 'status yellow';
                    } else {
                        statusCell.className = 'status red';
                    }
                }
            }
        });

        // Update the chart with new data
        updateBarChart(inventory);
    } catch (error) {
        console.error('Error syncing inventory:', error);
    }
}

// Initialize and update the bar chart
let barChart;

function initializeBarChart() {
    const ctx = document.getElementById('bar-chart').getContext('2d');
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Chicken Flavor',
                    backgroundColor: ['#008000', '#ffff00', '#ff0000'],
                    data: []
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: { display: false },
            title: {
                display: true,
                text: 'Inventory Status'
            }
        }
    });
}

function updateBarChart(inventory) {
    const labels = inventory.map(item => item.productName);
    const data = inventory.map(item => item.quantity);

    barChart.data.labels = labels;
    barChart.data.datasets[0].data = data;
    barChart.update();
}

// Initialize the dashboard
function initializeDashboard() {
    initializeBarChart();
    syncInventory();
}

// Run the initializeDashboard function when the page loads
document.addEventListener('DOMContentLoaded', initializeDashboard);
