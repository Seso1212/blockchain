from flask import Flask, jsonify, request, render_template, make_response
import logging
import os
from blockchain import Blockchain
from flask_cors import CORS

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration
app.secret_key = os.environ.get("SESSION_SECRET", "default_secret_key")

# Initialize blockchain with lower difficulty for ~30s blocks
blockchain = Blockchain(difficulty=2)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chain', methods=['GET'])
def get_chain():
    chain_data = blockchain.get_chain_data()
    return jsonify({
        'chain': chain_data,
        'length': len(chain_data)
    })

@app.route('/balance/<address>', methods=['GET'])
def get_balance(address):
    balance = blockchain.get_balance(address)
    return jsonify({
        'address': address,
        'balance': balance,
        'unit': 'SCR'
    })

@app.route('/transaction/new', methods=['POST'])
def new_transaction():
    try:
        values = request.get_json()
        required = ['sender', 'recipient', 'amount']

        if not all(k in values for k in required):
            return jsonify({'error': 'Missing required fields'}), 400

        try:
            blockchain.add_transaction(
                values['sender'],
                values['recipient'],
                float(values['amount'])
            )
            return jsonify({'message': 'Transaction added successfully'}), 201
        except ValueError as ve:
            return jsonify({'error': str(ve)}), 400

    except Exception as e:
        logger.error(f"Error in new_transaction: {str(e)}")
        return jsonify({'error': 'Failed to add transaction'}), 500

@app.route('/mine', methods=['POST'])
def mine():
    try:
        values = request.get_json()
        if 'miner_address' not in values:
            return jsonify({'error': 'Missing miner address'}), 400

        new_block = blockchain.mine_pending_transactions(values['miner_address'])

        response = {
            'message': f'New block mined! Earned: {blockchain.mining_reward} SCR',
            'block': {
                'index': new_block.index,
                'transactions': new_block.transactions,
                'timestamp': new_block.timestamp,
                'previous_hash': new_block.previous_hash,
                'hash': new_block.hash,
                'nonce': new_block.nonce
            }
        }
        return jsonify(response), 201
    except Exception as e:
        logger.error(f"Error in mine: {str(e)}")
        return jsonify({'error': 'Mining failed'}), 500

@app.route('/chain/valid', methods=['GET'])
def validate_chain():
    is_valid = blockchain.is_chain_valid()
    return jsonify({'valid': is_valid})

# API for Scrappy Miner Integration
@app.route('/api/wallet/create', methods=['POST'])
def create_wallet():
    try:
        values = request.get_json()
        if not values or 'address' not in values:
            return jsonify({'error': 'Missing wallet address'}), 400

        address = values['address']
        # Initialize wallet in blockchain with 0 balance
        blockchain.initialize_wallet(address)

        return jsonify({
            'address': address,
            'balance': 0,
            'message': 'Wallet created successfully'
        })
    except Exception as e:
        logger.error(f"Error creating wallet: {str(e)}")
        return jsonify({'error': 'Failed to create wallet'}), 500

@app.route('/api/mining/start', methods=['POST'])
def start_mining():
    try:
        values = request.get_json()
        if not values or 'address' not in values:
            return jsonify({'error': 'Missing miner address'}), 400

        # Mine a block and get mining reward
        new_block = blockchain.mine_pending_transactions(values['address'])

        return jsonify({
            'success': True,
            'reward': blockchain.mining_reward,
            'new_balance': blockchain.get_balance(values['address'])
        })
    except Exception as e:
        logger.error(f"Error starting mining: {str(e)}")
        return jsonify({'error': 'Mining failed'}), 500

@app.route('/api/transfer', methods=['POST'])
def transfer_scr():
    try:
        values = request.get_json()
        required = ['from_address', 'to_address', 'amount']

        if not all(k in values for k in required):
            return jsonify({'error': 'Missing required fields'}), 400

        # Verify sender has sufficient balance
        sender_balance = blockchain.get_balance(values['from_address'])
        amount = float(values['amount'])

        if sender_balance < amount:
            return jsonify({'error': 'Insufficient balance'}), 400

        # Add transaction to blockchain
        blockchain.add_transaction(
            values['from_address'],
            values['to_address'],
            amount
        )

        return jsonify({
            'success': True,
            'message': f'Successfully transferred {amount} SCR',
            'new_balance': blockchain.get_balance(values['from_address'])
        })
    except Exception as e:
        logger.error(f"Error in transfer: {str(e)}")
        return jsonify({'error': 'Transfer failed'}), 500