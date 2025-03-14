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
                checkBalance();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            alert('Failed to submit transaction');
            console.error('Error:', error);
        }
    });

    // Mining
    let miningInterval = null;
    document.getElementById('mineButton').addEventListener('click', function() {
        const button = this;
        const minerAddress = document.getElementById('minerAddress').value;
        const miningStatus = document.getElementById('miningStatus');

        if (!minerAddress) {
            alert('Please enter a mining wallet address');
            return;
        }

        if (button.textContent === 'Start Mining') {
            button.textContent = 'Stop Mining';
            button.classList.replace('btn-success', 'btn-danger');
            miningStatus.innerHTML = '<div class="alert alert-info">Mining in progress... (0.5 SCR per block)</div>';

            // Start mining every 30 seconds
            mine(); // Mine immediately
            miningInterval = setInterval(mine, 30000); // Then every 30 seconds
        } else {
            stopMining();
        }
    });

    // Refresh chain
    document.getElementById('refreshChain').addEventListener('click', function() {
        refreshChain();
        validateChain();
    });

    // Check balance function
    window.checkBalance = async function() {
        const address = document.getElementById('walletAddress').value;
        if (!address) {
            alert('Please enter a wallet address');
            return;
        }

        try {
            const response = await fetch(`/balance/${address}`);
            const data = await response.json();
            const balanceDisplay = document.getElementById('balanceDisplay');
            balanceDisplay.innerHTML = `
                <div class="alert alert-success">
                    Balance: ${data.balance} ${data.unit}
                </div>
            `;
        } catch (error) {
            console.error('Error checking balance:', error);
            alert('Failed to check balance');
        }
    };

    function stopMining() {
        const button = document.getElementById('mineButton');
        const miningStatus = document.getElementById('miningStatus');

        clearInterval(miningInterval);
        button.textContent = 'Start Mining';
        button.classList.replace('btn-danger', 'btn-success');
        miningStatus.innerHTML = '<div class="alert alert-secondary">Mining stopped</div>';
    }

    async function mine() {
        const minerAddress = document.getElementById('minerAddress').value;
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
                refreshChain();
                validateChain();
                checkBalance();
            } else {
                console.error('Mining failed:', result.error);
                stopMining();
            }
        } catch (error) {
            console.error('Mining error:', error);
            stopMining();
        }
    }
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
                                    ${tx.sender} → ${tx.recipient}: ${tx.amount} SCR
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