document.addEventListener('DOMContentLoaded', function() {
    // Initial load
    refreshChain();
    validateChain();

    // Form submission for new transaction
    document.getElementById('transactionForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const transaction = {
            sender: document.getElementById('sender').value,
            recipient: document.getElementById('recipient').value,
            amount: parseFloat(document.getElementById('amount').value)
        };

        try {
            const response = await fetch('/transaction/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transaction)
            });

            const result = await response.json();
            if (response.ok) {
                alert('Transaction added successfully!');
                this.reset();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            alert('Failed to submit transaction');
            console.error('Error:', error);
        }
    });

    // Mining
    document.getElementById('mineButton').addEventListener('click', async function() {
        const minerAddress = document.getElementById('minerAddress').value;
        if (!minerAddress) {
            alert('Please enter a miner address');
            return;
        }

        try {
            const response = await fetch('/mine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ miner_address: minerAddress })
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                refreshChain();
                validateChain();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            alert('Mining failed');
            console.error('Error:', error);
        }
    });

    // Refresh chain
    document.getElementById('refreshChain').addEventListener('click', function() {
        refreshChain();
        validateChain();
    });
});

async function refreshChain() {
    try {
        const response = await fetch('/chain');
        const data = await response.json();
        
        const blockchainDiv = document.getElementById('blockchainData');
        blockchainDiv.innerHTML = '';

        data.chain.forEach(block => {
            const blockElement = document.createElement('div');
            blockElement.className = 'card mb-3';
            blockElement.innerHTML = `
                <div class="card-header">
                    <h6 class="mb-0">Block #${block.index}</h6>
                </div>
                <div class="card-body">
                    <p class="mb-1"><small>Hash: ${block.hash}</small></p>
                    <p class="mb-1"><small>Previous Hash: ${block.previous_hash}</small></p>
                    <p class="mb-1"><small>Timestamp: ${new Date(block.timestamp * 1000).toLocaleString()}</small></p>
                    <p class="mb-1"><small>Nonce: ${block.nonce}</small></p>
                    <h6 class="mt-3">Transactions:</h6>
                    <ul class="list-unstyled">
                        ${block.transactions.map(tx => `
                            <li class="mb-2">
                                <small>
                                    ${tx.sender} → ${tx.recipient}: ${tx.amount}
                                </small>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
            blockchainDiv.appendChild(blockElement);
        });
    } catch (error) {
        console.error('Error fetching chain:', error);
    }
}

async function validateChain() {
    try {
        const response = await fetch('/chain/valid');
        const data = await response.json();
        
        const statusDiv = document.getElementById('chainStatus');
        if (data.valid) {
            statusDiv.className = 'alert alert-success';
            statusDiv.textContent = 'Chain Status: Valid';
        } else {
            statusDiv.className = 'alert alert-danger';
            statusDiv.textContent = 'Chain Status: Invalid';
        }
    } catch (error) {
        console.error('Error validating chain:', error);
    }
}
